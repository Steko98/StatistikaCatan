using AutoMapper;
using BACKEND.Data;
using BACKEND.Models;
using BACKEND.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BACKEND.Controllers
{

    /// <summary>
    /// Kontroler za upravljanje turnirima.
    /// Omogućuje dohvat, pretragu, dodavanje, izmjenu i brisanje turnira te dohvat povezanih igara i detalja turnira.
    /// </summary>
    [ApiController]
    [Route("api/v1/[controller]")]
    public class TurnirController(EdunovaContext context, IMapper mapper) : CatanController(context, mapper)
    {

        /// <summary>
        /// Dohvaća sve turnire iz baze podataka.
        /// </summary>
        /// <returns>Lista svih turnira u obliku DTO objekata.</returns>
        [HttpGet]
        public ActionResult<List<TurnirDTORead>> Get()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
              
                var turniriDb = _context.Turniri
                    .Where(t => t.OperaterId == trenutniKorsnik)
                    .ToList();
                return Ok(_mapper.Map<List<TurnirDTORead>>(turniriDb));
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        /// <summary>
        /// Dohvaća turnir prema zadanoj šifri.
        /// </summary>
        /// <param name="sifra">Šifra turnira.</param>
        /// <returns>DTO objekt turnira za unos ili izmjenu.</returns>
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
                e = _context.Turniri
                    .FirstOrDefault(t => t.Sifra == sifra && t.OperaterId == trenutniKorsnik);
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

        /// <summary>
        /// Dodaje novi turnir u bazu podataka.
        /// </summary>
        /// <param name="dto">DTO objekt s podacima za unos turnira.</param>
        /// <returns>Kreirani turnir u obliku DTO objekta.</returns>
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
                e.OperaterId = trenutniKorsnik;
                _context.Turniri.Add(e);
                _context.SaveChanges();
                return StatusCode(StatusCodes.Status201Created, _mapper.Map<TurnirDTORead>(e));
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        /// <summary>
        /// Ažurira postojeći turnir prema zadanoj šifri.
        /// </summary>
        /// <param name="sifra">Šifra turnira koji se ažurira.</param>
        /// <param name="dto">DTO objekt s novim podacima turnira.</param>
        /// <returns>Poruka o uspješnosti ažuriranja.</returns>
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
                    e = _context.Turniri
                        .FirstOrDefault(t=> t.Sifra == sifra && t.OperaterId == trenutniKorsnik);
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
                return BadRequest(new { poruka = ex.Message });
            }
        }

        /// <summary>
        /// Briše turnir prema zadanoj šifri.
        /// </summary>
        /// <param name="sifra">Šifra turnira koji se briše.</param>
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
                Turnir? e;
                try
                {
                    e = _context.Turniri
                        .FirstOrDefault(t => t.Sifra == sifra && t.OperaterId == trenutniKorsnik);
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
                return Ok(new { poruka = "Uspješno obrisano" });

            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        /// <summary>
        /// Dohvaća sve igre povezane s određenim turnirom.
        /// </summary>
        /// <param name="sifraTurnira">Šifra turnira.</param>
        /// <returns>Lista igara u obliku DTO objekata.</returns>
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
                    .FirstOrDefault(x => x.Sifra == sifraTurnira && x.OperaterId == trenutniKorsnik);
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

        /// <summary>
        /// Pretražuje turnire prema uvjetu (nazivu).
        /// </summary>
        /// <param name="uvjet">Uvjet pretrage (najmanje 3 znaka).</param>
        /// <returns>Lista pronađenih turnira u obliku DTO objekata.</returns>
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
                IEnumerable<Turnir> query = _context.Turniri
                    .Where(t => t.OperaterId == trenutniKorsnik);
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

        /// <summary>
        /// Dohvaća detalje turnira, uključujući igre i članove igara.
        /// </summary>
        /// <param name="sifra">Šifra turnira.</param>
        /// <returns>Detalji turnira u obliku DTO objekta.</returns>
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
                    .FirstOrDefault(t => t.Sifra == sifra && t.OperaterId == trenutniKorsnik);
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
