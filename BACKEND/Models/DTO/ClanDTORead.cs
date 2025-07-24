using Microsoft.Identity.Client;

namespace BACKEND.Models.DTO
{
    public record ClanDTORead(
        int Sifra,
        int? BrojBodova,
        bool Pobjeda,
        int SifraIgrac,
        string ImeIgrac,
        int SifraIgra
        );
}
