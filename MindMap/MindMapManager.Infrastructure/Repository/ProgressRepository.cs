using MindMapManager.Core.Entities;
using MindMapManager.Core.RepositoryContracts;
using MindMapManager.Infrastructure.DatabaseContext;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace MindMapManager.Infrastructure.Repository
{
    public class ProgressRepository : IProgressRepository
    {
        private readonly AppDbContext _context;

        public ProgressRepository(AppDbContext context)
        {
            _context = context;
        }

        public void Add(Progress progress)
        {
           _context.Add(progress);
        }

        public Progress? GetProgress(int userId, int levelId)
        {
            return _context.Progresses
                .FirstOrDefault(x => x.UserId == userId && x.Lid == levelId);
        }
        public bool IsRoadmapCompleted(int userId, int roadmapId)
        {
            var totalLevels = _context.Levels
                .Where(l => l.Rid == roadmapId)
                .Count();

            if (totalLevels == 0) return false;

            var completedLevels = _context.Progresses
                .Include(p => p.LidNavigation)
                .Where(p => p.UserId == userId
                    && p.LidNavigation != null
                    && p.LidNavigation.Rid == roadmapId
                    && p.CompPerc == 100)
                .Count();

            return completedLevels >= totalLevels;
        }
        public void Update(Progress progress)
        {
            _context.Update(progress);
        }
        public void Save()
        {
            _context.SaveChanges();
        }
        public void AddRange(IEnumerable<Progress> progresses)
        {
            _context.Progresses.AddRange(progresses);
        }
    }
}

