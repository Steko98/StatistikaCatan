using BACKEND.Data;
using BACKEND.Models;
using Microsoft.AspNetCore.Mvc;

namespace BACKEND.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class RekordController : ControllerBase
    {
        private readonly EdunovaContext _context;

        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                return Ok(_context.Rekordi);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }

        [HttpPost]
        public IActionResult Post(Rekord rekord)
        {
            try
            {
                _context.Rekordi.Add(rekord);
                _context.SaveChanges();
                return StatusCode(StatusCodes.Status201Created, rekord);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }

        [HttpPut("{sifra:int}")]
        public IActionResult Put(int sifra, Rekord rekord)
        {
            if (sifra < 1)
            {
                return BadRequest(new { poruka = "Šifra mora biti veća od 0" });
            }

            try
            {
                Rekord r = _context.Rekordi.Find(sifra);
                if (r == null)
                {
                    return NotFound();
                }
                r.Naziv = rekord.Naziv;

                _context.Rekordi.Update(r);
                _context.SaveChanges();
                return Ok(r);

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
                Rekord r = _context.Rekordi.Find(sifra);
                if (r == null)
                {
                    return NotFound();
                }

                _context.Rekordi.Remove(r);
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
