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
    public class ClanController(EdunovaContext context, IMapper mapper) : CatanController(context, mapper)
    {

        [HttpGet]
        public ActionResult<List<ClanDTORead>> Get()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                var clanoviDb = _context.Clanovi
                    .Include(c => c.Igrac)
                    .Include(c => c.Igra)
                    .ToList();
                return Ok(_mapper.Map<List<ClanDTORead>>(clanoviDb));
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }


        [HttpGet]
        [Route("{sifra:int}")]
        public ActionResult<ClanDTOInsertUpdate> GetBySifra(int sifra)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            Clan? e;
            try
            {
                e = _context.Clanovi
                    .Include(i => i.Igrac)
                    .Include(i => i.Igra)
                    .FirstOrDefault(i => i.Sifra == sifra);
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
            if (e == null)
            {
                return NotFound(new { poruka = "Nije pronađeno" });
            }

            return Ok(_mapper.Map<ClanDTOInsertUpdate>(e));
        }

        [HttpPost]
        public IActionResult Post(ClanDTOInsertUpdate dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            Igra? g;
            try
            {
                g = _context.Igre.Find(dto.SifraIgra);
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
            if (g == null)
            {
                return NotFound(new { poruka = "Odabrana igra nije pronađena" });
            }
            Igrac? p;
            try
            {
                p = _context.Igraci.Find(dto.SifraIgrac);
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
            if (p == null)
            {
                return NotFound(new { poruka = "Odabrani igrač nije pronađen" });
            }


            try
            {
                var e = _mapper.Map<Clan>(dto);
                e.Igra = g;
                e.Igrac = p;
                _context.Clanovi.Add(e);
                _context.SaveChanges();
                return StatusCode(StatusCodes.Status201Created, _mapper.Map<ClanDTORead>(e));
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }


        [HttpPut]
        [Route("{sifra:int}")]
        [Produces("application/json")]
        public IActionResult Put(int sifra, ClanDTOInsertUpdate dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }

            try
            {
                Clan? e;
                try
                {
                    e = _context.Clanovi
                        .Include(c => c.Igrac)
                        .Include(c => c.Igra)
                        .FirstOrDefault(x => x.Sifra == sifra);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { poruka = ex.Message });
                }
                if (e == null)
                {
                    return NotFound(new { poruka = "Nije pronađeno" });
                }

                Igra? es;
                try
                {
                    es = _context.Igre.Find(dto.SifraIgra);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { poruka = ex.Message });
                }
                if (es==null)
                {
                    return NotFound(new { poruka = "Igra nije pronađena" });
                }

                Igrac? esi;
                try
                {
                    esi = _context.Igraci.Find(dto.SifraIgrac);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { poruka = ex.Message });
                }
                if (esi == null)
                {
                    return NotFound(new { poruka = "Igrač nije pronađen" });
                }

                e = _mapper.Map(dto, e);
                e.Igra = es;
                e.Igrac = esi;
                _context.Clanovi.Update(e);
                _context.SaveChanges();

                return Ok(new { poruka = "Uspješno promjenjeno" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        [HttpPatch]
        [Route("clan")]
        public IActionResult Patch(int sifraIgrac, int sifraIgra, int bodovi)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }

            try
            {
                Clan? e;
                try
                {
                    e = _context.Clanovi
                        .FirstOrDefault(c => c.Igra.Sifra == sifraIgra && c.Igrac.Sifra == sifraIgrac);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { poruka = ex.Message });
                }
                if (e == null)
                {
                    return NotFound(new { poruka = "Član nije pronađen" });
                }

                e.BrojBodova = bodovi;
                _context.Clanovi.Update(e);
                _context.SaveChanges();
                return Ok(new { poruka = "Uspješno promijenjeni bodovi" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        [HttpPatch("pobjeda")]
        public IActionResult PatchPobjeda(int sifraIgrac, int sifraIgra, bool pobjeda)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }

            try
            {
                Clan? e;
                try
                {
                    e = _context.Clanovi
                        .FirstOrDefault(c => c.Igra.Sifra == sifraIgra && c.Igrac.Sifra == sifraIgrac);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { poruka = ex.Message });
                }
                if (e == null)
                {
                    return NotFound(new { poruka = "Član nije pronađen" });
                }

                e.Pobjeda = pobjeda;
                _context.Clanovi.Update(e);
                _context.SaveChanges();
                return Ok(new { poruka = "Promjena uspješna" });
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
                Clan? e;
                try
                {
                    e = _context.Clanovi.Find(sifra);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { poruka = ex.Message });
                }

                if (e == null)
                {
                    return NotFound("Nije pronađeno");
                }

                _context.Clanovi.Remove(e);
                _context.SaveChanges();
                return Ok(new { poruka = "Uspješno obrisano" });

            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }



    }
}
