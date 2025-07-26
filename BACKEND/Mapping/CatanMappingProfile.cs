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

            CreateMap<Igrac, IgracDTORead>();
            CreateMap<IgracDTOInsertUpdate, Igrac>();
            CreateMap<Igrac, IgracDTOInsertUpdate>();

            CreateMap<Clan, ClanDTORead>()
                .ForCtorParam("SifraIgra", opt => opt.MapFrom(src => src.Igra.Sifra))
                .ForCtorParam("ImeIgrac", opt => opt.MapFrom(src => src.Igrac.Ime));
            CreateMap<ClanDTOInsertUpdate, Clan>();
            CreateMap<Clan, ClanDTOInsertUpdate>()
                .ForMember(
                    dest => dest.SifraIgrac,
                    opt => opt.MapFrom(src => src.Igrac.Sifra))
                .ForMember(
                    dest => dest.SifraIgra,
                    opt => opt.MapFrom(src => src.Igra.Sifra)
                );
        }
    }
}
