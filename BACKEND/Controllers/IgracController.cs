using AutoMapper;
using Azure.Core;
using BACKEND.Data;
using BACKEND.Models;
using BACKEND.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BACKEND.Controllers
{
    /// <summary>
    /// Kontroler za upravljanje entitetima igrača.
    /// Omogućuje dohvat, pretragu, dodavanje, ažuriranje i brisanje igrača te upravljanje njihovim sudjelovanjem u igrama.
    /// </summary>
    [ApiController]
    [Route("api/v1/[controller]")]
    public class IgracController(EdunovaContext context, IMapper mapper) : CatanController(context, mapper)
    {

        /// <summary>
        /// Dohvaća sve igrače iz baze podataka.
        /// </summary>
        /// <returns>Lista DTO objekata igrača.</returns>
        [HttpGet]
        public ActionResult<List<IgracDTORead>> Get()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                var igraciDb = _context.Igraci
                    .Where(i => i.OperaterId == trenutniKorsnik)
                    .ToList();
                return Ok(_mapper.Map<List<IgracDTORead>>(igraciDb));
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        /// <summary>
        /// Dohvaća sve igrače koji nisu sudjelovali u određenoj igri.
        /// </summary>
        /// <param name="sifraIgra">Šifra igre za koju se traže dostupni igrači.</param>
        /// <returns>Lista DTO objekata igrača koji nisu članovi navedene igre.</returns>
        [HttpGet]
        [Route("IgraciZaIgru/{sifraIgra:int}")]
        public ActionResult<List<IgracDTORead>> GetIgraciZaIgru(int sifraIgra)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                // Execute raw SQL: select * from igraci where sifra not in (select distinct igrac from clanovi where igra = @sifraIgra);
                var igraci = _context.Igraci
                    .FromSqlRaw(
                        @"SELECT * FROM Igraci WHERE operater_id = {0} AND Sifra NOT IN (SELECT DISTINCT Igrac FROM Clanovi WHERE Igra = {1})",
                        trenutniKorsnik, sifraIgra
                    )
                    .ToList();

                return Ok(_mapper.Map<List<IgracDTORead>>(igraci));
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }

        }


        /// <summary>
        /// Dohvaća igrača prema zadanoj šifri.
        /// </summary>
        /// <param name="sifra">Jedinstvena šifra igrača kojeg treba dohvatiti.</param>
        /// <returns>
        /// Ako je igrač pronađen, vraća DTO objekt igrača.
        /// Ako nije pronađen, vraća poruku o pogrešci.
        /// </returns>
        [HttpGet]
        [Route("{sifra:int}")]
        public ActionResult<IgracDTORead> GetBySifra(int sifra)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            Igrac? e;
            try
            {
                e = _context.Igraci
                    .FirstOrDefault(i => i.Sifra == sifra && i.OperaterId == trenutniKorsnik);
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
            if (e == null)
            {
                return NotFound(new { poruka = "Igrač nije pronađen" });
            }

            return Ok(_mapper.Map<IgracDTORead>(e));
        }

        /// <summary>
        /// Dodaje novog igrača u bazu podataka.
        /// </summary>
        /// <param name="dto">DTO objekt s podacima o igraču koji se dodaje.</param>
        /// <returns>
        /// Status 201 Created s DTO objektom novog igrača ako je unos uspješan.
        /// Status 400 BadRequest s porukom o pogrešci ako unos nije valjan ili dođe do iznimke.
        /// </returns>
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
                e.OperaterId = trenutniKorsnik;
                _context.Igraci.Add(e);
                _context.SaveChanges();
                return StatusCode(StatusCodes.Status201Created, _mapper.Map<IgracDTORead>(e));
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        /// <summary>
        /// Ažurira podatke postojećeg igrača prema zadanoj šifri.
        /// </summary>
        /// <param name="sifra">Jedinstvena šifra igrača kojeg treba ažurirati.</param>
        /// <param name="dto">DTO objekt s novim podacima za igrača.</param>
        /// <returns>
        /// Status 200 OK s porukom o uspješnoj izmjeni ako je ažuriranje uspješno.
        /// Status 404 NotFound ako igrač nije pronađen.
        /// Status 400 BadRequest s porukom o pogrešci ako unos nije valjan ili dođe do iznimke.
        /// </returns>
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
                    e = _context.Igraci
                        .FirstOrDefault(i => i.Sifra == sifra && i.OperaterId == trenutniKorsnik);
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

        /// <summary>
        /// Briše igrača iz baze podataka prema zadanoj šifri.
        /// </summary>
        /// <param name="sifra">Jedinstvena šifra igrača kojeg treba obrisati.</param>
        /// <returns>
        /// Status 200 OK s porukom o uspješnom brisanju ako je igrač obrisan.
        /// Status 404 NotFound ako igrač nije pronađen.
        /// Status 400 BadRequest s porukom o pogrešci ako unos nije valjan ili dođe do iznimke.
        /// </returns>
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
                    e = _context.Igraci
                        .FirstOrDefault(i => i.Sifra == sifra && i.OperaterId == trenutniKorsnik);
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

        /// <summary>
        /// Dohvaća sve igre u kojima sudjeluje određeni igrač.
        /// </summary>
        /// <param name="sifraIgraca">Jedinstvena šifra igrača za kojeg se dohvaćaju igre.</param>
        /// <returns>
        /// Lista DTO objekata članova (igara) u kojima igrač sudjeluje.
        /// Status 400 BadRequest s porukom o pogrešci ako unos nije valjan ili dođe do iznimke.
        /// </returns>
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
                    .FirstOrDefault(x => x.Sifra == sifraIgraca && x.OperaterId == trenutniKorsnik);
                if (p == null)
                {
                    return BadRequest("Ne postoji igrač pod šifrom " + sifraIgraca);
                }
                return Ok(_mapper.Map<List<ClanDTORead>>(p.Clanovi));
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        /// <summary>
        /// Dodaje igrača u određenu igru s brojem bodova i oznakom pobjede.
        /// </summary>
        /// <param name="sifra">Jedinstvena šifra igrača koji se dodaje u igru.</param>
        /// <param name="igraSifra">Jedinstvena šifra igre u koju se igrač dodaje.</param>
        /// <param name="brojBodova">Broj bodova koje je igrač ostvario u igri.</param>
        /// <param name="pobjeda">Označava je li igrač ostvario pobjedu u igri.</param>
        /// <returns>
        /// Status 200 OK s porukom o uspješnom dodavanju igrača u igru.
        /// Status 400 BadRequest s porukom o pogrešci ako unos nije valjan ili dođe do iznimke.
        /// Status 503 ServiceUnavailable ako dođe do iznimke prilikom spremanja u bazu.
        /// </returns>
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
                    .FirstOrDefault(i => i.Sifra == sifra && i.OperaterId == trenutniKorsnik);
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

        /// <summary>
        /// Briše vezu između igrača i igre (uklanja igrača iz određene igre).
        /// </summary>
        /// <param name="sifra">Jedinstvena šifra igrača kojeg treba ukloniti iz igre.</param>
        /// <param name="igraSifra">Jedinstvena šifra igre iz koje se igrač uklanja.</param>
        /// <returns>
        /// Status 200 OK s porukom o uspješnom uklanjanju igrača iz igre.
        /// Status 400 BadRequest s porukom o pogrešci ako unos nije valjan ili dođe do iznimke.
        /// </returns>
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
                    .FirstOrDefault(i => i.Sifra == sifra && i.OperaterId == trenutniKorsnik);
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


        /// <summary>
        /// Pretražuje igrače prema zadanom uvjetu (ime ili dio imena).
        /// </summary>
        /// <param name="uvjet">Tekstualni uvjet za pretragu igrača (najmanje 3 znaka).</param>
        /// <returns>
        /// Lista DTO objekata igrača koji odgovaraju uvjetu pretrage.
        /// Status 400 BadRequest ako je uvjet prekratak ili dođe do iznimke.
        /// </returns>
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
                IEnumerable<Igrac> query = _context.Igraci
                    .Where(i => i.OperaterId == trenutniKorsnik);
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
        /// <summary>
        /// Pretražuje igrače prema zadanom uvjetu i vraća rezultate s podrškom za straničenje.
        /// </summary>
        /// <param name="stranica">Redni broj stranice rezultata (počinje od 1).</param>
        /// <param name="uvjet">Tekstualni uvjet za pretragu igrača (opcionalno, može biti prazan).</param>
        /// <returns>
        /// Status 200 OK s listom DTO objekata igrača za traženu stranicu.
        /// Status 400 BadRequest s porukom o pogrešci ako dođe do iznimke.
        /// </returns>
        [HttpGet]
        [Route("traziStranicenje/{stranica}")]
        public IActionResult TraziIgracStranicenje(int stranica, string uvjet = "")
        {
            var poStranici = 6;
            uvjet = uvjet.ToLower();
            try
            {
                IEnumerable<Igrac> query = _context.Igraci
                    .Where(i => i.OperaterId == trenutniKorsnik);

                var niz = uvjet.Split(" ");
                foreach (var s in niz)
                {
                    query = query.Where(p => p.Ime.ToLower().Contains(s));
                }
                query.OrderBy(i => i.Ime);
                var igraci = query.ToList();
                var filtriranaLista = igraci.Skip((poStranici * stranica) - poStranici).Take(poStranici);
                return Ok(_mapper.Map<List<IgracDTORead>>(filtriranaLista.ToList()));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Postavlja ili ažurira sliku igrača na temelju šifre igrača.
        /// </summary>
        /// <param name="sifra">Jedinstvena šifra igrača kojem se postavlja slika.</param>
        /// <param name="slika">DTO objekt koji sadrži sliku u Base64 formatu.</param>
        /// <returns>
        /// Status 200 OK s porukom o uspješnom spremanju slike.
        /// Status 400 BadRequest s porukom o pogrešci ako unos nije valjan ili dođe do iznimke.
        /// </returns>
        [HttpPut]
        [Route("postaviSliku/{sifra:int}")]
        public IActionResult PostaviSliku(int sifra, SlikaDTO slika)
        {
            if (sifra < 1)
            {
                return BadRequest("Šifra mora biti veća od 0");
            }
            if (slika.Base64 == null || slika.Base64?.Length == 0)
            {
                return BadRequest("Slika nije postavljena");
            }
            var i = _context.Igraci
                .FirstOrDefault(x=> x.Sifra == sifra && x.OperaterId == trenutniKorsnik);
            if (i == null)
            {
                return NotFound("Igrač pod šifrom " + sifra + "nije pronađen");
            }

            string base64 = slika.Base64;


            byte[] bytes;
            try
            {
                bytes = Convert.FromBase64String(base64);
            } catch (FormatException)
            {
                return BadRequest("Neispravan format");
            }
            const int maxBytes = 5 * 1024 * 1024;
            if (bytes.Length > maxBytes)
            {
                return BadRequest("Image cannot be over 5MB.");
            }

            try
            {
                string dir = Path.Combine(Directory.GetCurrentDirectory()
                ,"wwwroot","slike","igraci");

                if (!System.IO.Directory.Exists(dir))
                {
                    System.IO.Directory.CreateDirectory(dir);
                }
                var putanja = Path.Combine(dir, sifra + ".png");
                System.IO.File.WriteAllBytes(putanja, bytes);
                return Ok("Uspješno pohranjena slika");
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }


        [HttpDelete]
        [Route("obrisiSliku/{sifra:int}")]
        public IActionResult ObrisiSliku(int sifra)
        {
            if (sifra < 1)
            {
                return BadRequest("Šifra mora biti veća od 1");
            }
            var i = _context.Igraci
                .FirstOrDefault(x => x.Sifra == sifra && x.OperaterId == trenutniKorsnik);
            if (i == null)
            {
                return NotFound("Igrač nije pronađen");
            }


            try
            {
                string dir = Path.Combine(Directory.GetCurrentDirectory()
                , "wwwroot", "slike", "igraci");
                var putanja = Path.Combine(dir, sifra + ".png");

                if (!System.IO.File.Exists(putanja))
                {
                    return NotFound("Igrač nema postavljenu sliku");
                } else
                {
                    System.IO.File.Delete(putanja);
                    return Ok("Slika uspješno obrisana");
                }


            }
            catch (Exception ex)
            {
                return StatusCode(500, "Greška pri brisanju slike");
            }
        }
    }
}
