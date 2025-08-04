using Microsoft.Identity.Client;

namespace BACKEND.Models.DTO
{
    public record ClanDTORead(
        int sifra,
        int? BrojBodova,
        bool Pobjeda,
        string ImeIgrac,
        int SifraIgrac,
        int SifraIgra
        );
}
