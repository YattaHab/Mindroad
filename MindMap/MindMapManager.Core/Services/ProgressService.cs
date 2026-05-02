using Microsoft.AspNetCore.Identity;
using MindMapManager.Core.DTOs;
using MindMapManager.Core.Entities;
using MindMapManager.Core.Exceptions;
using MindMapManager.Core.RepositoryContracts;
using MindMapManager.Core.ServiceContracts;


namespace MindMapManager.Core.Services
{
    public class ProgressService : IProgressService
    {
        private readonly IProgressRepository _progressRepo;
        private readonly ITopicRepository _topicRepo;
        private readonly ICompletedTopicRepository _completedTopicRepo;
        private readonly IRoadmapRepository _roadmapRepo;
        private readonly IUserTrackRepository _userTrackRepo;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ICertificateService _certificateService;
        private readonly ICertificateRepository _certificateRepo;


        public ProgressService(IProgressRepository progressRepo, ITopicRepository topicRepo, ICompletedTopicRepository completedTopicRepo,IRoadmapRepository roadmapRepo, IUserTrackRepository userTrackRepo, UserManager<ApplicationUser> userManager, ICertificateService certificateService, ICertificateRepository certificateRepo)
        {
            _progressRepo = progressRepo;
            _topicRepo = topicRepo;
            _completedTopicRepo = completedTopicRepo;
            _roadmapRepo = roadmapRepo;
            _userTrackRepo = userTrackRepo;
            _userManager = userManager;
            _certificateService = certificateService;
            _certificateRepo = certificateRepo;
        }

        public async Task CompleteTopic(int userId, int topicId)
        {
            var topic = _topicRepo.GetWithLevel(topicId);

            if (topic == null)
            {
                throw new NotFoundException("topic not found");
            }
            var isEnrolled = _userTrackRepo.IsEnrolled(userId, topic.LidNavigation.Rid);
            if (!isEnrolled)
                throw new ForbiddenException("User doesn't enroll");

            var levelId = topic.Lid.Value;
            

            var isCompleted = _completedTopicRepo.IsCompleted(userId, topicId);

            if (isCompleted)
            {
                return;
            }

            _completedTopicRepo.Add(new CompletedTopic()
            {
                topicId = topicId,
                userId = userId,
            });

            _completedTopicRepo.Save();

            var totalTopics = _topicRepo.CountPerLevel(levelId);
            var completedTopics = _completedTopicRepo.CountPerUserInLevel(userId, levelId);

            decimal percentage = Math.Round(((decimal)completedTopics/ totalTopics)*100);

            var progress = _progressRepo.GetProgress(userId, levelId);

            progress!.CompPerc = percentage;

            _progressRepo.Update(progress);

            await UpdateStreak(userId);

            _progressRepo.Save();
        }

        public void UnCompleteTopic(int userId, int topicId)
        {
            var topic = _topicRepo.GetByIdWithLevelAndRoadmaps(topicId);

            if (topic == null)
            {
                throw new NotFoundException("topic not found");
            }
          

            var levelId = topic.Lid!.Value;
            var roadmapId = topic.LidNavigation!.Rid!.Value;
            var trackId = topic.LidNavigation.RidNavigation!.TrackId;

            var isEnrolled = _userTrackRepo.IsEnrolled(userId, trackId);
            if (!isEnrolled)
                throw new ForbiddenException("User doesn't enroll");


            var isCompleted = _completedTopicRepo.IsCompleted(userId, topicId);

            if (!isCompleted)
            {
                return;
            }

            var hasCertificate = _certificateRepo.IsAlreadyExisted(userId, roadmapId);
            if (hasCertificate) 
            {
                throw new
                    ConflictException("You cannot uncheck a topic after a certificate has been issued for this roadmap");
            }

            _completedTopicRepo.Delete(userId, topicId);
            _completedTopicRepo.Save();

            var totalTopics = _topicRepo.CountPerLevel(levelId);
            var completedTopics = _completedTopicRepo.CountPerUserInLevel(userId, levelId);

            decimal percentage = Math.Round(((decimal)completedTopics / totalTopics) * 100);

            var progress = _progressRepo.GetProgress(userId, levelId);

            progress!.CompPerc = percentage;

            _progressRepo.Update(progress);

            _progressRepo.Save();
        }

        public async Task<RoadmapProgressResponse> RoadmapProgress(int userId ,int roadmapId)
        {
            var roadmap = _roadmapRepo.GetByIdWithLevelsAndProgress(roadmapId);

            if (roadmap == null)
                throw new NotFoundException("raodmap not found");

            bool isEnrolled = _userTrackRepo.IsEnrolled(userId, roadmap.TrackId);
            if (!isEnrolled)
            {
                throw new ForbiddenException("user doesn't enroll in the track");
            }

            var lastTopicName = _completedTopicRepo.GetLastTopicCompleted(userId, roadmapId) ?? "no topic yet";

            var percentage = roadmap.Levels
                    .SelectMany(l => l.Progresses
                        .Where(p => p.UserId == userId)
                        .Select(p => (decimal)p.CompPerc))
                    .DefaultIfEmpty(0)
                    .Average();
            var roundedPercentage = (int)Math.Round(percentage);

            if (roundedPercentage == 100)
            {
                await _certificateService.AutoIssue(userId , roadmapId);
            }

            return new RoadmapProgressResponse()
            {
                roadmapId = roadmap.Rid,
                roadmapName = roadmap.Name,
                roadmapDescription = roadmap.Description,
                lastTopicCompleted = lastTopicName,
                Percentage = roundedPercentage,
                Levels = roadmap.Levels.Select(l => new LevelProgressResponse()
                {
                    levelId = l.Lid,
                    progressPercentage = (int)Math.Round(
                        l.Progresses
                        .Where( p => p.UserId == userId)
                        .Select(p => p.CompPerc)
                        .FirstOrDefault())
                })
            };
        }

        private async Task UpdateStreak(int userId)
        {
            var appUser = await _userManager.FindByIdAsync(userId.ToString()); 

            if (appUser == null) return;

            var today = DateTime.UtcNow.Date;
            if (!appUser.LastActDate.HasValue)
            {
                appUser.Streak = 1;
            }
            else
            {
                var daysDiff = (today - appUser.LastActDate.Value.Date).Days;
                if (daysDiff == 1)
                    appUser.Streak += 1;
                else if (daysDiff > 1)
                    appUser.Streak = 1;
                
            }

            appUser.LastActDate = today;
            await _userManager.UpdateAsync(appUser);
        }
    }
}
