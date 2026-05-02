using Microsoft.EntityFrameworkCore;
using MindMapManager.Core.Entities;
using MindMapManager.Core.RepositoryContracts;
using MindMapManager.Infrastructure.DatabaseContext;

namespace MindMapManager.Infrastructure.Repository
{
    public class TrackRepository : ITrackRepository
    {
        private readonly AppDbContext _context;

        public TrackRepository(AppDbContext context)
        {
            _context = context;
        }

        public void Add(Track track)
        {
            _context.Tracks.Add(track);
        }

        public int Count()
        {
           return _context.Tracks.Count();
        }

        public Track? FindByName(string name)
        {
            return _context.Tracks.FirstOrDefault(t => t.Name == name);
        }

        public IQueryable<Track> Get()
        {
            return _context.Tracks.AsQueryable();
        }

        public Track? GetById(int id)
        {
            return _context.Tracks.FirstOrDefault(track => track.TrackId == id);
        }

        public Track? GetByIdIncludeUsersAndRoadMaps(int id)
        {
            return _context.Tracks
                .Include(t => t.Roadmaps)
                .FirstOrDefault(track => track.TrackId == id);
        }

        public IQueryable<Track> GetIncludeUsersAndRoadMaps()
        {
            return _context.Tracks
                .Include(t => t.Roadmaps)
                .AsQueryable();
        }

        public Track? GetWithRoadmapsAndLevels(int id)
        {
            return _context.Tracks
                .Include(x => x.Roadmaps)
                    .ThenInclude(x => x.Levels)
                .FirstOrDefault(x => x.TrackId == id);
        }

        public void Remove(Track track)
        {
            _context.Tracks.Remove(track);
        }

        public void Save()
        {
            _context.SaveChanges();
        }

        
        public IQueryable<Track> Search(string? searchTerm)
        {
            var query = Get();
            if (string.IsNullOrWhiteSpace(searchTerm))
                return query;

            var key = searchTerm.ToLower().Trim();
            return query.Where(t =>
                t.Name.ToLower().Contains(key) ||
                t.Description.ToLower().Contains(key));
        }




        public void Update(Track track)
        {
            _context.Tracks.Update(track);
        }
    }
}
