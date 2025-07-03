using BACKEND.Data;
using BACKEND.Models;
using Microsoft.AspNetCore.Mvc;

namespace BACKEND.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class IgracController : ControllerBase
    {
        private readonly EdunovaContext _context;
        public IgracController(EdunovaContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                return Ok(_context.Igraci);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }

        [HttpPost]
        public IActionResult Post(Igrac igrac)
        {
            try
            {
                _context.Igraci.Add(igrac);
                _context.SaveChanges();
                return StatusCode(StatusCodes.Status201Created, igrac);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }






    }
}
