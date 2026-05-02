using MindMapManager.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MindMapManager.Core.RepositoryContracts
{
    public interface IProgressRepository
    {
        void Add(Progress progress);
        void Update(Progress progress);
        Progress? GetProgress(int userId, int levelId);
        void Save();
        bool IsRoadmapCompleted(int userId, int roadmapId);
        void AddRange(IEnumerable<Progress> progresses);
    }
}
