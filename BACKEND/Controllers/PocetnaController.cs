using BACKEND.Data;
using Microsoft.AspNetCore.Mvc;

namespace BACKEND.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class PocetnaController(EdunovaContext _context) : ControllerBase
    {
        [HttpGet]
        [Route("UkupnoTurnira")]
        public IActionResult UkupnoTurnira()
        {
            try
            {
                return Ok(new { poruka = _context.Turniri.Count() });
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        [HttpGet]
        [Route("UkupnoIgraca")]
        public IActionResult UkupnoIgraca()
        {
            try
            {
                return Ok(new { poruka = _context.Igraci.Count() });
            }
            catch(Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        [HttpGet]
        [Route("UkupnoIgara")]
        public IActionResult UkupnoIgara()
        {
            try
            {
                return Ok(new { poruka = _context.Igre.Count() });
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }
    }
}
