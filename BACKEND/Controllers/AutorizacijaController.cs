using BACKEND.Data;
using BACKEND.Filters;
using BACKEND.Models;
using BACKEND.Models.DTO;
using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Swashbuckle.AspNetCore.Filters;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace BACKEND.Controllers
{
    /// <summary>
    /// API kontroler za autorizaciju korisnika i generiranje JWT tokena.
    /// </summary>
    [ApiController]
    [Route("api/v1/[controller]")]
    public class AutorizacijaController(EdunovaContext context) : ControllerBase
    {
        private readonly EdunovaContext _context = context;

        /// <summary>
        /// Generira JWT token za autoriziranog operatera.
        /// </summary>
        /// <param name="operater">Podaci o operateru (email i lozinka).</param>
        /// <returns>
        /// JWT token ako su podaci ispravni; inače vraća status 403 (Niste autorizirani) ili 400 (Neispravan model).
        /// </returns>
        [HttpPost("token")]
        [SwaggerRequestExample(typeof(OperaterDTO), typeof(AutorizacijaExampleProvider))]
        public IActionResult GenerirajToken(OperaterDTO operater)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var operBaza = _context.Operateri
                .Where(p => p.Email!.Equals(operater.Email))
                .FirstOrDefault();
            if (operBaza == null)
            {
                return StatusCode(StatusCodes.Status403Forbidden, "Niste autorizirani");
            }
            if (!BCrypt.Net.BCrypt.EnhancedVerify(operater.Password, operBaza.Lozinka))
            {
                return StatusCode(StatusCodes.Status403Forbidden, "Niste autorizirani");
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes("NeZnamZaStoJeOvoTocnoAliJeKaoNekiTajniKljuc");

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Expires = DateTime.UtcNow.Add(TimeSpan.FromHours(8)),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwt = tokenHandler.WriteToken(token);

            return Ok(jwt);
        }



        /// <summary>
        /// Registrira novog operatera u sustavu.
        /// </summary>
        /// <param name="dto">Podaci o operateru za registraciju (email i lozinka).</param>
        /// <returns>
        /// Vraća status 200 i poruku o uspješnoj registraciji ako je registracija uspješna.<br/>
        /// Vraća status 400 i detalje o greškama modela ako podaci nisu ispravni.<br/>
        /// Vraća status 409 ako već postoji korisnik s istom e-mail adresom.
        /// </returns>
        [HttpPost("registracija")]
        public IActionResult Post(OperaterDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            var vecPostoji = _context.Operateri
                .FirstOrDefault(o => o.Email == dto.Email);
            if (vecPostoji != null)
            {
                return Conflict("Već postoji korisnik registriran pod ovom e-mail adresom.");
            }
            var hashLozinka = BCrypt.Net.BCrypt.EnhancedHashPassword(dto.Password);

            var noviOperater = new Operater
            {
                Email = dto.Email,
                Lozinka = hashLozinka
            };

            _context.Operateri.Add(noviOperater);
            _context.SaveChanges();

            return Ok("Uspješna registracija korisnika!");
        }
    }
}
