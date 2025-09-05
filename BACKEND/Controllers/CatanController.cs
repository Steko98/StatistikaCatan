using AutoMapper;
using BACKEND.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BACKEND.Controllers
{
    /// <summary>
    /// Apstraktna bazna kontrolerska klasa za Catan aplikaciju.
    /// Sadrži zajedničke resurse i funkcionalnosti za izvedene kontrolere.
    /// </summary>
    [Authorize]
    public abstract class CatanController : ControllerBase
    {
        /// <summary>
        /// Kontekst baze podataka za pristup podacima aplikacije.
        /// </summary>
        protected readonly EdunovaContext _context;

        /// <summary>
        /// AutoMapper instanca za mapiranje između entiteta i DTO objekata.
        /// </summary>
        protected readonly IMapper _mapper;

        /// <summary>
        /// Inicijalizira novi primjerak <see cref="CatanController"/> klase s navedenim kontekstom i mapperom.
        /// </summary>
        /// <param name="context">Kontekst baze podataka.</param>
        /// <param name="mapper">AutoMapper instanca.</param>
        public CatanController(EdunovaContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        protected int trenutniKorsnik
        {
            get
            {
                var claim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (claim == null)
                {
                    throw new UnauthorizedAccessException("ID korisnika nije prinađen u tokenu");
                }
                return int.Parse(claim.Value);
            }
        }
    }
}
