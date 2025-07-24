using AutoMapper;
using BACKEND.Data;
using BACKEND.Models;
using BACKEND.Models.DTO;
using Microsoft.AspNetCore.Mvc;

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



    }
}
