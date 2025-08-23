using AutoMapper;
using BACKEND.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BACKEND.Controllers
{
    [Authorize]
    public abstract class CatanController:ControllerBase
    {
        protected readonly EdunovaContext _context;
        protected readonly IMapper _mapper;

        public CatanController(EdunovaContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
    }
}
