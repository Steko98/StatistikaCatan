using AutoMapper;
using BACKEND.Models;
using BACKEND.Models.DTO;

namespace BACKEND.Mapping
{
    /// <summary>
    /// AutoMapper profil za mapiranje entiteta i DTO objekata vezanih uz Catan aplikaciju.
    /// Sadrži konfiguracije za mapiranje između modela baze podataka i DTO klasa
    /// koje se koriste za prijenos podataka prema i od klijenta.
    /// </summary>
    public class CatanMappingProfile : Profile
    {
        /// <summary>
        /// Inicijalizira novi primjerak klase <see cref="CatanMappingProfile"/> i definira pravila mapiranja.
        /// </summary>
        public CatanMappingProfile()
        {
            // Mapiranje između entiteta Turnir i njegovih DTO klasa
            CreateMap<Turnir, TurnirDTORead>();
            CreateMap<TurnirDTOInsertUpdate, Turnir>();
            CreateMap<Turnir, TurnirDTOInsertUpdate>();

            // Mapiranje između entiteta Igra i njegovih DTO klasa
            CreateMap<Igra, IgraDTORead>()
                .ForCtorParam("TurnirNaziv",
                    opt => opt.MapFrom(src => src.Turnir.Naziv)
                );
            CreateMap<IgraDTOInsertUpdate, Igra>();
            CreateMap<Igra, IgraDTOInsertUpdate>().ForMember(
                dest => dest.TurnirSifra,
                opt => opt.MapFrom(src => src.Turnir.Sifra)
            );

            // Mapiranje između entiteta Igrac i njegovih DTO klasa
            CreateMap<Igrac, IgracDTORead>()
                .ConstructUsing(entitet =>
                    new IgracDTORead(
                        entitet.Sifra ?? 0,
                        entitet.Ime ?? "",
                        PutanjaDatoteke(entitet)));
            CreateMap<IgracDTOInsertUpdate, Igrac>();
            CreateMap<Igrac, IgracDTOInsertUpdate>();

            // Mapiranje između entiteta Clan i njegovih DTO klasa
            CreateMap<Clan, ClanDTORead>()
                .ForCtorParam("SifraIgra", opt => opt.MapFrom(src => src.Igra.Sifra))
                .ForCtorParam("ImeIgrac", opt => opt.MapFrom(src => src.Igrac.Ime))
                .ForCtorParam("SifraIgrac", opt => opt.MapFrom(src => src.Igrac.Sifra));
            CreateMap<ClanDTOInsertUpdate, Clan>();
            CreateMap<Clan, ClanDTOInsertUpdate>()
                .ForCtorParam("SifraIgrac", opt => opt.MapFrom(src => src.Igrac.Sifra))
                .ForCtorParam("SifraIgra", opt => opt.MapFrom(src => src.Igra.Sifra)
                );

            // Mapiranje za detaljne DTO prikaze
            CreateMap<Turnir, DetaljiTurnirDTORead>()
                .ForMember(dest => dest.Sifra, opt => opt.MapFrom(src => src.Sifra))
                .ForMember(dest => dest.Naziv, opt => opt.MapFrom(src => src.Naziv));
            CreateMap<Igra, DetaljiIgraDTORead>()
                .ForMember(dest => dest.Sifra, opt => opt.MapFrom(src => src.Sifra));
        }

        /// <summary>
        /// Vraća relativnu putanju do slike igrača ako slika postoji, inače vraća null.
        /// </summary>
        /// <param name="e">Entitet igrača za kojeg se traži putanja slike.</param>
        /// <returns>Relativna putanja do slike ili null ako slika ne postoji.</returns>
        private static string? PutanjaDatoteke(Igrac e)
        {
            try
            {
                var ds = Path.DirectorySeparatorChar;
                string slika = Path.Combine(Directory.GetCurrentDirectory()
                , "wwwroot", "slike", "igraci" + ds + e.Sifra + ".png");
                return File.Exists(slika) ? "/slike/igraci/" + e.Sifra + ".png" : null;
            }
            catch
            {
                return null;
            }
        }
    }
}
