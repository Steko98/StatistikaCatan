using BACKEND.Data;
using Microsoft.AspNetCore.Mvc;

namespace BACKEND.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class TurnirController : ControllerBase
    {
        //dependency injection
        private readonly EdunovaContext _context;
        //konstruktor
        public TurnirController(EdunovaContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                return Ok(_context.Turniri);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }

    }
}
