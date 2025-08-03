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
    public class IgracController(EdunovaContext context, IMapper mapper) : CatanController(context, mapper)
    {

        [HttpGet]
        public ActionResult<List<IgracDTORead>> Get()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                return Ok(_mapper.Map<List<IgracDTORead>>(_context.Igraci));
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        [HttpGet]
        [Route("{sifra:int}")]
        public ActionResult<IgracDTOInsertUpdate> GetBySifra(int sifra)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            Igrac? e;
            try
            {
                e = _context.Igraci.Find(sifra);
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
            if (e == null)
            {
                return NotFound(new { poruka = "Igrač nije pronađen" });
            }

            return Ok(_mapper.Map<IgracDTOInsertUpdate>(e));
        }

        [HttpPost]
        public IActionResult Post(IgracDTOInsertUpdate dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                var e = _mapper.Map<Igrac>(dto);
                _context.Igraci.Add(e);
                _context.SaveChanges();
                return StatusCode(StatusCodes.Status201Created, _mapper.Map<IgracDTORead>(e));
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        [HttpPut]
        [Route("{sifra:int}")]
        [Produces("application/json")]
        public IActionResult Put(int sifra, IgracDTOInsertUpdate dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }

            try
            {
                Igrac? e;
                try
                {
                    e = _context.Igraci.Find(sifra);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { poruka = ex.Message });
                }
                if (e == null)
                {
                    return NotFound(new { poruka = "Igrac nije pronađen" });
                }

                e = _mapper.Map(dto, e);

                _context.Igraci.Update(e);
                _context.SaveChanges();

                return Ok(new { poruka = "Uspješno promjenjeno" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
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
                Igrac? e;
                try
                {
                    e = _context.Igraci.Find(sifra);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { poruka = ex.Message });
                }

                if (e == null)
                {
                    return NotFound("Igrac nije pronađen");
                }

                _context.Igraci.Remove(e);
                _context.SaveChanges();
                return Ok(new { poruka = "Uspješno obrisano" });

            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        [HttpGet]
        [Route("Igre/{sifraIgraca:int}")]
        public ActionResult<List<ClanDTORead>> GetIgre(int sifraIgraca)
        {
            if (!ModelState.IsValid || sifraIgraca < 1)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var p = _context.Igraci
                    .Include(i => i.Clanovi)
                        .ThenInclude(c => c.Igra)
                    .FirstOrDefault(x => x.Sifra == sifraIgraca);
                if (p == null)
                {
                    return BadRequest("Ne postoji igrač pod šifrom " + sifraIgraca);
                }
                return Ok(_mapper.Map<List<ClanDTORead>>(p.Clanovi));
            }
            catch(Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        [HttpPost]
        [Route("{sifra:int}/dodaj/{igraSifra:int}")]
        public IActionResult DodajIgru(int sifra, int igraSifra, int brojBodova, bool pobjeda)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (sifra < 1 || igraSifra < 1)
            {
                return BadRequest("Šifra igre ili igrača nije pronađena");
            }
            try
            {
                var igrac = _context.Igraci
                    .Include(i => i.Clanovi)
                        .ThenInclude(c => c.Igra)
                    .FirstOrDefault(i => i.Sifra == sifra);
                if (igrac == null)
                {
                    return BadRequest("Igra pod odabranom šifrom nije pronađena");
                }
                var igra = _context.Igre.Find(igraSifra);

                var clan = new Clan { Igra = igra, Igrac = igrac, BrojBodova = brojBodova, Pobjeda = pobjeda };

                _context.Clanovi.Add(clan);
                _context.SaveChanges();

                return Ok(new
                {
                    poruka = igrac.Ime + " dodan u igru " + igra.Sifra
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex.Message);
            }
        }

        [HttpDelete]
        [Route("{sifra:int}/obrisi/{igraSifra:int}")]
        public IActionResult ObrisiIgru(int sifra, int igraSifra)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (sifra < 1 || igraSifra < 1)
            {
                return BadRequest("Šifra igre ili igrača nije pronađena");
            }
            try
            {
                var igrac = _context.Igraci
                    .Include(i => i.Clanovi)
                        .ThenInclude(c => c.Igra)
                    .FirstOrDefault(i => i.Sifra == sifra);
                if (igrac == null)
                {
                    return BadRequest("Igrač pod odabranom šifrom nije pronađen");
                }
                var igra = _context.Igraci.Find(igraSifra);
                if (igrac == null)
                {
                    return BadRequest("Igra pod odabranom šifrom nije pronađena");
                }
                var clan = _context.Clanovi
                    .Include(c => c.Igrac)
                    .Include(c => c.Igra)
                    .FirstOrDefault(c => c.Igrac.Sifra == sifra && c.Igra.Sifra == igraSifra);
                igrac.Clanovi.Remove(clan);
                _context.Igraci.Update(igrac);
                _context.SaveChanges();

                return Ok(new { poruka = igrac.Ime + " uklonjen iz igre" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet]
        [Route("trazi/{uvjet}")]
        public ActionResult<List<IgracDTORead>> TraziIgraca(string uvjet)
        {
            if (uvjet == null || uvjet.Length < 3)
            {
                return BadRequest(ModelState);
            }
            uvjet = uvjet.ToLower();
            try
            {
                IEnumerable<Igrac> query = _context.Igraci;
                foreach (var s in uvjet.Split(" "))
                {
                    query = query.Where(i => i.Ime.ToLower().Contains(s));
                }
                var igraci = query.ToList();
                return Ok(_mapper.Map<List<IgracDTORead>>(igraci));
            }
            catch (Exception e)
            {
                return BadRequest(new { poruka = e.Message });
            }
        }

    }
}
