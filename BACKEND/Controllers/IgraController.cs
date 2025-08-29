using AutoMapper;
using BACKEND.Data;
using BACKEND.Models;
using BACKEND.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BACKEND.Controllers
{
    /// <summary>
    /// API kontroler za upravljanje entitetom Igra.
    /// Omogućuje dohvat, unos, izmjenu, brisanje i pretragu igara te upravljanje članovima igre.
    /// </summary>
    [ApiController]
    [Route("api/v1/[controller]")]
    public class IgraController(EdunovaContext context, IMapper mapper) : CatanController(context, mapper)
    {

        /// <summary>
        /// Dohvaća sve igre iz baze podataka.
        /// </summary>
        /// <returns>Lista svih igara u obliku DTO objekata.</returns>
        [HttpGet]
        public ActionResult<List<IgraDTORead>> Get()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                return Ok(_mapper.Map<List<IgraDTORead>>(_context.Igre.Include(i => i.Turnir)));
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        /// <summary>
        /// Dohvaća igru prema šifri.
        /// </summary>
        /// <param name="sifra">Šifra igre.</param>
        /// <returns>Igra u obliku DTO objekta za unos/izmjenu.</returns>
        [HttpGet]
        [Route("{sifra:int}")]
        public ActionResult<IgraDTOInsertUpdate> GetBySifra(int sifra)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            Igra? e;
            try
            {
                e = _context.Igre.Include(i => i.Turnir).FirstOrDefault(i => i.Sifra == sifra);
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
            if (e == null)
            {
                return NotFound(new { poruka = "Igra nije pronađena" });
            }

            return Ok(_mapper.Map<IgraDTOInsertUpdate>(e));
        }

        /// <summary>
        /// Dodaje novu igru u bazu podataka.
        /// </summary>
        /// <param name="dto">DTO objekt s podacima o igri.</param>
        /// <returns>Kreirana igra u obliku DTO objekta.</returns>
        [HttpPost]
        public IActionResult Post(IgraDTOInsertUpdate dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }

            Turnir? es;
            try
            {
                es = _context.Turniri.Find(dto.TurnirSifra);
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
            if (es == null)
            {
                return NotFound(new { poruka = "Odabrani turnir nije pronađen" });
            }

            try
            {
                var e = _mapper.Map<Igra>(dto);
                e.Turnir = es;
                _context.Igre.Add(e);
                _context.SaveChanges();
                return StatusCode(StatusCodes.Status201Created, _mapper.Map<IgraDTORead>(e));
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        /// <summary>
        /// Ažurira podatke postojeće igre.
        /// </summary>
        /// <param name="sifra">Šifra igre.</param>
        /// <param name="dto">DTO objekt s novim podacima o igri.</param>
        /// <returns>Poruka o uspješnosti ažuriranja.</returns>
        [HttpPut]
        [Route("{sifra:int}")]
        [Produces("application/json")]
        public IActionResult Put(int sifra, IgraDTOInsertUpdate dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }

            try
            {
                Igra? e;
                try
                {
                    e = _context.Igre.Include(i => i.Turnir).FirstOrDefault(x => x.Sifra == sifra);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { poruka = ex.Message });
                }
                if (e == null)
                {
                    return NotFound(new { poruka = "Igra nije pronađena" });
                }

                Turnir? es;
                try
                {
                    es = _context.Turniri.Find(dto.TurnirSifra);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { poruka = ex.Message });
                }
                if (es == null)
                {
                    return NotFound(new { poruka = "Odabrani turnir nije pronađen" });
                }

                e = _mapper.Map(dto, e);
                e.Turnir = es;
                _context.Igre.Update(e);
                _context.SaveChanges();

                return Ok(new { poruka = "Uspješno promjenjeno" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        /// <summary>
        /// Djelomično ažurira podatke igre (samo datum).
        /// </summary>
        /// <param name="sifra">Šifra igre.</param>
        /// <param name="datum">Novi datum igre.</param>
        /// <returns>Poruka o uspješnosti ažuriranja datuma.</returns>
        [HttpPatch]
        [Route("{sifra:int}")]
        public IActionResult Patch(int sifra, DateTime datum)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }

            try
            {
                Igra? e;
                try
                {
                    e = _context.Igre.Find(sifra);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { poruka = ex.Message });
                }
                if (e == null)
                {
                    return NotFound(new { poruka = "Igra nije pronađena" });
                }

                e.Datum = datum;
                _context.Igre.Update(e);
                _context.SaveChanges();
                return Ok(new { poruka = "Uspješno promijenjen datum" });
            } catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        /// <summary>
        /// Briše igru iz baze podataka.
        /// </summary>
        /// <param name="sifra">Šifra igre.</param>
        /// <returns>Poruka o uspješnosti brisanja.</returns>
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
                Igra? e;
                try
                {
                    e = _context.Igre.Find(sifra);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { poruka = ex.Message });
                }

                if (e == null)
                {
                    return NotFound("Igra nije pronađena");
                }

                _context.Igre.Remove(e);
                _context.SaveChanges();
                return Ok(new { poruka = "Uspješno obrisano" });

            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        /// <summary>
        /// Dohvaća sve članove (igrače) određene igre.
        /// </summary>
        /// <param name="sifraIgre">Šifra igre.</param>
        /// <returns>Lista članova igre u obliku DTO objekata.</returns>
        [HttpGet]
        [Route("Igraci/{sifraIgre:int}")]
        public ActionResult<List<ClanDTORead>> GetIgraci(int sifraIgre)
        {
            if (!ModelState.IsValid || sifraIgre < 1)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var p = _context.Igre
                    .Include(i => i.Clanovi)
                        .ThenInclude(c => c.Igrac)
                    .FirstOrDefault(x => x.Sifra == sifraIgre);
                if (p == null)
                {
                    return BadRequest("Ne postoji igra pod šifrom " + sifraIgre);
                }

                return Ok(_mapper.Map<List<ClanDTORead>>(p.Clanovi));
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        /// <summary>
        /// Dodaje igrača u igru.
        /// </summary>
        /// <param name="sifra">Šifra igre.</param>
        /// <param name="igracSifra">Šifra igrača.</param>
        /// <param name="brojBodova">Broj bodova koje je igrač ostvario.</param>
        /// <param name="pobjeda">Označava je li igrač pobijedio.</param>
        /// <returns>Poruka o uspješnosti dodavanja igrača.</returns>
        [HttpPost]
        [Route("{sifra:int}/dodaj/{igracSifra:int}")]
        public IActionResult DodajIgraca(int sifra, int igracSifra, int brojBodova, bool pobjeda)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (sifra < 1 || igracSifra < 1)
            {
                return BadRequest("Šifra igre ili igrača nije pronađena");
            }
            try
            {
                var igra = _context.Igre
                    .Include(i => i.Clanovi)
                        .ThenInclude(c => c.Igrac)
                    .FirstOrDefault(i => i.Sifra == sifra);
                if (igra == null)
                {
                    return BadRequest("Igra pod odabranom šifrom nije pronađena");
                }
                var igrac = _context.Igraci.Find(igracSifra);
                if (igrac == null)
                {
                    return BadRequest("Igrač pod odabranom šifrom nije pronađen");
                }

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

        /// <summary>
        /// Uklanja igrača iz igre.
        /// </summary>
        /// <param name="sifra">Šifra igre.</param>
        /// <param name="igracSifra">Šifra igrača.</param>
        /// <returns>Poruka o uspješnosti uklanjanja igrača.</returns>
        [HttpDelete]
        [Route("{sifra:int}/obrisi/{igracSifra:int}")]
        public IActionResult ObrisiIgraca(int sifra, int igracSifra)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (sifra < 1 || igracSifra < 1)
            {
                return BadRequest("Šifra igre ili igrača nije pronađena");
            }
            try
            {
                var igra = _context.Igre
                    .Include(i => i.Clanovi)
                        .ThenInclude(c => c.Igrac)
                    .FirstOrDefault(i => i.Sifra == sifra);
                if (igra == null)
                {
                    return BadRequest("Igra pod odabranom šifrom nije pronađena");
                }
                var igrac = _context.Igraci.Find(igracSifra);
                if (igrac == null)
                {
                    return BadRequest("Igrač pod odabranom šifrom nije pronađen");
                }
                var clan = _context.Clanovi
                    .Include(c => c.Igra)
                    .Include(c => c.Igrac)
                    .FirstOrDefault(c => c.Igra.Sifra == sifra && c.Igrac.Sifra == igracSifra);

                igra.Clanovi.Remove(clan);
                _context.Igre.Update(igra);
                _context.SaveChanges();

                return Ok(new { poruka = igrac.Ime + " uklonjen iz igre" });

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Pretražuje igre prema datumu održavanja.
        /// </summary>
        /// <param name="uvjetPocetak">Početni datum pretrage.</param>
        /// <param name="uvjetKraj">Završni datum pretrage.</param>
        /// <returns>Lista igara koje zadovoljavaju uvjete pretrage.</returns>
        [HttpGet]
        [Route("trazi")]
        public ActionResult<List<IgracDTORead>> TraziIgru(DateTime uvjetPocetak, DateTime uvjetKraj)
        {
            if (uvjetPocetak > uvjetKraj)
            {
                return BadRequest(ModelState);
            }
            try
            {
                IEnumerable<Igra> query = _context.Igre
                    .Include(i => i.Turnir);
                query = query.Where(i => i.Datum >= uvjetPocetak && i.Datum <= uvjetKraj);
                var igre = query.ToList();
                return Ok(_mapper.Map<List<IgraDTORead>>(igre));
            }
            catch (Exception e)
            {
                return BadRequest(new { poruka = e.Message });
            }
        }

    }
}
