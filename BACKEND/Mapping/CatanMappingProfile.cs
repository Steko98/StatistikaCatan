using AutoMapper;
using BACKEND.Models;
using BACKEND.Models.DTO;

namespace BACKEND.Mapping
{
    public class CatanMappingProfile:Profile
    {
        public CatanMappingProfile()
        {
            CreateMap<Turnir, TurnirDTORead>();
            CreateMap<TurnirDTOInsertUpdate, Turnir>();
            CreateMap<Turnir, TurnirDTOInsertUpdate>();

            CreateMap<Igra, IgraDTORead>()
                .ForCtorParam("TurnirNaziv",
                opt => opt.MapFrom(src => src.Turnir.Naziv)
                );
            CreateMap<IgraDTOInsertUpdate, Igra>(); 
            CreateMap<Igra, IgraDTOInsertUpdate>().ForMember(
                dest => dest.TurnirSifra,
                opt => opt.MapFrom(src => src.Turnir.Sifra)
                );

            CreateMap<Igrac, IgracDTORead>()
                .ConstructUsing(entitet =>
                new IgracDTORead(
                    entitet.Sifra ?? 0,
                    entitet.Ime ?? "",
                    PutanjaDatoteke(entitet)));
            CreateMap<IgracDTOInsertUpdate, Igrac>();
            CreateMap<Igrac, IgracDTOInsertUpdate>();

            CreateMap<Clan, ClanDTORead>()
                .ForCtorParam("SifraIgra", opt => opt.MapFrom(src => src.Igra.Sifra))
                .ForCtorParam("ImeIgrac", opt => opt.MapFrom(src => src.Igrac.Ime))
                .ForCtorParam("SifraIgrac", opt => opt.MapFrom(src => src.Igrac.Sifra));
            CreateMap<ClanDTOInsertUpdate, Clan>();
            CreateMap<Clan, ClanDTOInsertUpdate>()
                .ForCtorParam("SifraIgrac", opt => opt.MapFrom(src => src.Igrac.Sifra))
                .ForCtorParam("SifraIgra", opt => opt.MapFrom(src => src.Igra.Sifra)
                );

            CreateMap<Turnir, DetaljiTurnirDTORead>()
                .ForMember(dest => dest.Sifra, opt => opt.MapFrom(src => src.Sifra))
                .ForMember(dest => dest.Naziv, opt => opt.MapFrom(src => src.Naziv));
            CreateMap<Igra, DetaljiIgraDTORead>()
                .ForMember(dest => dest.Sifra, opt => opt.MapFrom(src => src.Sifra));
            


        }

        private static string? PutanjaDatoteke(Igrac e)
        {
            try
            {
                var ds = Path.DirectorySeparatorChar;
                string slika = Path.Combine(Directory.GetCurrentDirectory()
                    + ds + "wwwroot" + ds + "slike" + ds + "igraci" + ds + e.Sifra + ".png");
                return File.Exists(slika) ? "/slike/igraci/" + e.Sifra + ".png" : null;
            }
            catch
            {
                return null;
            }
        }
    }
}
