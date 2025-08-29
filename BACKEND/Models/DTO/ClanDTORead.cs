using Microsoft.Identity.Client;

namespace BACKEND.Models.DTO
{
    /// <summary>
    /// DTO zapis koji predstavlja člana igre.
    /// </summary>
    /// <param name="sifra">Jedinstvena šifra člana.</param>
    /// <param name="BrojBodova">Broj bodova koje je član osvojio (može biti null).</param>
    /// <param name="Pobjeda">Označava je li član ostvario pobjedu.</param>
    /// <param name="ImeIgrac">Ime igrača.</param>
    /// <param name="SifraIgrac">Jedinstvena šifra igrača.</param>
    /// <param name="SifraIgra">Jedinstvena šifra igre.</param>
    public record ClanDTORead(
        int sifra,
        int? BrojBodova,
        bool Pobjeda,
        string ImeIgrac,
        int SifraIgrac,
        int SifraIgra
        );
}
