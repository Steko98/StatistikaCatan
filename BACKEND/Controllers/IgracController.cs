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

        [HttpPut("{sifra:int}")]
        public IActionResult Put(int sifra, Igrac igrac)
        {
            if (sifra < 1)
            {
                return BadRequest(new { poruka = "Šifra mora biti veća od 0" });
            }

            try
            {
                Igrac i = _context.Igraci.Find(sifra);
                if (i == null)
                {
                    return NotFound();
                }
                i.Ime = igrac.Ime;

                _context.Igraci.Update(i);
                _context.SaveChanges();
                return Ok(i);

            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }

        [HttpDelete("{sifra:int}")]
        public IActionResult Delete(int sifra)
        {
            if (sifra < 1)
            {
                return BadRequest(new { poruka = "Šifra mora biti veća od 0" });
            }

            try
            {
                Igrac i = _context.Igraci.Find(sifra);
                if (i == null)
                {
                    return NotFound();
                }

                _context.Igraci.Remove(i);
                _context.SaveChanges();
                return NoContent();

            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }


    }
}
