using BACKEND.Data;
using BACKEND.Models;
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

        [HttpGet("{sifra:int}")]
        public IActionResult Get(int sifra)
        {
            if (sifra<=0)
            {
                return BadRequest("Sifra ti ne valja");
            }

            try
            {
                var turnir = _context.Turniri.Find(sifra);
                if (turnir == null)
                {
                    return NotFound();
                }

                return Ok(turnir);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }

        [HttpPost]
        public IActionResult Post(Turnir turnir)
        {
            try
            {
                _context.Turniri.Add(turnir);
                _context.SaveChanges();
                return StatusCode(StatusCodes.Status201Created, turnir);
            } 
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }

        [HttpPut("{sifra:int}")]
        public IActionResult Put(int sifra, Turnir turnir)
        {
            if (sifra < 1)
            {
                return BadRequest(new { poruka = "Šifra mora biti veća od 0" });
            }

            try {
                Turnir t = _context.Turniri.Find(sifra);
                if (t == null)
                {
                    return NotFound();
                }
                t.Naziv = turnir.Naziv;
                t.DatumPocetka = turnir.DatumPocetka;
                t.DatumZavrsetka = turnir.DatumZavrsetka;

                _context.Turniri.Update(t);
                _context.SaveChanges();
                return Ok(t);

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
                Turnir t = _context.Turniri.Find(sifra);
                if (t == null)
                {
                    return NotFound();
                }

                _context.Turniri.Remove(t);
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
