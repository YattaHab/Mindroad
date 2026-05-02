using MindMapManager.Core.DTOs;
using MindMapManager.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MindMapManager.Core.ServiceContracts
{
    public interface IEnrollmentService
    {
        public enrollResponseDto Enroll(int trackId, int userId);
        bool IsEnrolled(int trackId, int userId);
    }
}
