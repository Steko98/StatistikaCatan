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

            CreateMap<Igra, IgraDTORead>(); //treba dodati custom map za TurnirNaziv
            CreateMap<IgraDTOInsertUpdate, Igra>(); //custom map za TurnirSifra
            CreateMap<Igra, IgraDTOInsertUpdate>();

            CreateMap<Igrac, IgracDTORead>();
            CreateMap<IgracDTOInsertUpdate, Igrac>();
            CreateMap<Igrac, IgracDTOInsertUpdate>();

            CreateMap<Clan, ClanDTORead>(); //custom map za SifraIgrac, SifraIgra, ImeIgrac
            CreateMap<ClanDTOInsertUpdate, Clan>(); //custom map za SifraIgrac, SifraIgra
            CreateMap<Clan, ClanDTOInsertUpdate>();
        }
    }
}
