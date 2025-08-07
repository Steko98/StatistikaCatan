using AutoMapper;
using BACKEND.Data;
using BACKEND.Models;
using BACKEND.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BACKEND.Controllers
{

    [ApiController]
    [Route("api/v1/[controller]")]
    public class TurnirController(EdunovaContext context, IMapper mapper) : CatanController(context, mapper)
    {

        [HttpGet]
        public ActionResult<List<TurnirDTORead>> Get()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                var turniriDb = _context.Turniri.ToList();
                return Ok(_mapper.Map<List<TurnirDTORead>>(turniriDb));
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }


        [HttpGet]
        [Route("{sifra:int}")]
        public ActionResult<TurnirDTOInsertUpdate> GetBySifra(int sifra)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            Turnir? e;
            try
            {
                e = _context.Turniri.Find(sifra);
            } 
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
            if (e == null)
            {
                return NotFound(new { poruka = "Turnir nije pronađen" });
            }

            return Ok(_mapper.Map<TurnirDTOInsertUpdate>(e));
        }

        [HttpPost]
        public IActionResult Post(TurnirDTOInsertUpdate dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                var e = _mapper.Map<Turnir>(dto);
                _context.Turniri.Add(e);
                _context.SaveChanges();
                return StatusCode(StatusCodes.Status201Created, _mapper.Map<TurnirDTORead>(e));
            } 
            catch (Exception ex)
            {
                return BadRequest(new {poruka = ex.Message});
            }
        }


        [HttpPut]
        [Route("{sifra:int}")]
        [Produces("application/json")]
        public IActionResult Put(int sifra, TurnirDTOInsertUpdate dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            
            try
            {
                Turnir? e;
                try
                {
                    e = _context.Turniri.Find(sifra);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { poruka = ex.Message });
                }
                if (e == null)
                {
                    return NotFound(new { poruka = "Turnir nije pronađen" });
                }

                e = _mapper.Map(dto, e);

                _context.Turniri.Update(e);
                _context.SaveChanges();

                return Ok(new { poruka = "Uspješno promjenjeno" });
            }
            catch (Exception ex)
            {
                return BadRequest(new {poruka = ex.Message});
            }
        }

        [HttpDelete]
        [Route("{sifra:int}")]
        [Produces("application/json")]
        public IActionResult Delete(int sifra)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }

            try
            {
                Turnir? e;
                try
                {
                    e = _context.Turniri.Find(sifra);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { poruka = ex.Message });
                }

                if (e == null)
                {
                    return NotFound("Turnir nije pronađen");
                }

                _context.Turniri.Remove(e);
                _context.SaveChanges();
                return Ok(new {poruka="Uspješno obrisano"});

            }
            catch (Exception ex)
            {
                return BadRequest(new {poruka = ex.Message});
            }
        }

        [HttpGet]
        [Route("Igre/{sifraTurnira:int}")]
        public ActionResult<List<IgraDTORead>> GetIgre(int sifraTurnira)
        {
            if (!ModelState.IsValid || sifraTurnira < 1)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var p = _context.Turniri
                    .Include(i => i.Igre)
                    .FirstOrDefault(x => x.Sifra == sifraTurnira);
                if (p == null)
                {
                    return BadRequest("Ne postoji turnir pod šifrom " + sifraTurnira);
                }

                return Ok(_mapper.Map<List<IgraDTORead>>(p.Igre));
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        [HttpGet]
        [Route("trazi/{uvjet}")]
        public ActionResult<List<TurnirDTORead>> TraziTurnir(string uvjet)
        {
            if (uvjet == null || uvjet.Length < 3)
            {
                return BadRequest(ModelState);
            }
            uvjet = uvjet.ToLower();
            try
            {
                IEnumerable<Turnir> query = _context.Turniri;
                foreach (var s in uvjet.Split(" "))
                {
                    query = query.Where(t => t.Naziv.ToLower().Contains(s));
                }
                var turniri = query.ToList();
                return Ok(_mapper.Map<List<TurnirDTORead>>(turniri));
            }
            catch (Exception e)
            {
                return BadRequest(new { poruka = e.Message });
            }
        }

        [HttpGet]
        [Route("{sifra:int}/detalji")]
        public ActionResult<List<DetaljiTurnirDTORead>> GetDetalji(int sifra)
        {
            if (!ModelState.IsValid || sifra < 1)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var turnir = _context.Turniri
                    .Include(t => t.Igre)
                        .ThenInclude(i => i.Clanovi)
                            .ThenInclude(c => c.Igrac)
                    .FirstOrDefault(t => t.Sifra == sifra);
                if (turnir == null)
                {
                    return BadRequest("Turnir nije pronađen");
                }
                var turnirDetalji = _mapper.Map<DetaljiTurnirDTORead>(turnir);
                return Ok(turnirDetalji);
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

    }
}
