

using Microsoft.EntityFrameworkCore;
using MindMapManager.Core.DTOs;
using MindMapManager.Core.Entities;
using MindMapManager.Core.Exceptions;
using MindMapManager.Core.RepositoryContracts;
using MindMapManager.Core.ServiceContracts;

namespace MindMapManager.Core.Services
{
    public class EnrollmentService :IEnrollmentService
    {
        private readonly ITrackRepository _trackRepo;
        private readonly IUserTrackRepository _userTrackRepo;
        private readonly IProgressRepository _progressRepo;

        public EnrollmentService(ITrackRepository trackRepo , IUserTrackRepository userTrackRepo, IProgressRepository progressRepo)
        {
            _trackRepo = trackRepo;
            _userTrackRepo = userTrackRepo;
            _progressRepo = progressRepo;
        }

        public enrollResponseDto Enroll(int trackId, int userId)
        {
            var track = _trackRepo.GetWithRoadmapsAndLevels(trackId);

            if (track == null)
                throw new NotFoundException("track is not found");

            if (_userTrackRepo.IsEnrolled(userId, trackId))
                throw new ConflictException("user already enrolled");

            _userTrackRepo.add(new UserTrack
            {
                trackId = trackId,
                userId = userId,
                EnrolledAt = DateTime.UtcNow 
            });

            var progressRecords = track.Roadmaps
                .SelectMany(r => r.Levels)
                .Select(level => new Progress
                {
                    UserId = userId,
                    Lid = level.Lid,
                    CompPerc = 0
                }).ToList();

            _progressRepo.AddRange(progressRecords);
            _userTrackRepo.Save();

            return new enrollResponseDto
            {
                trackId = trackId,
                trackName = track.Name,
                EnrolledAt = DateTime.UtcNow,
                enrolledMessage = $"successfully enrolled in {track.Name}"
            };
        }

        public bool IsEnrolled(int trackId, int userId)
        {
            return _userTrackRepo.IsEnrolled(userId, trackId);
        }
    }
}