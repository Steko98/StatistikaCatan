using System.ComponentModel.DataAnnotations;

namespace BACKEND.Models.DTO
{
    /// <summary>
    /// DTO za unos ili ažuriranje člana igre.
    /// </summary>
    /// <param name="BrojBodova">
    /// Broj bodova koje je član ostvario. Mora biti između 2 i maksimalne vrijednosti cijelog broja.
    /// </param>
    /// <param name="Pobjeda">
    /// Označava je li član ostvario pobjedu. Obavezno polje.
    /// </param>
    /// <param name="SifraIgrac">
    /// Šifra igrača. Obavezno polje.
    /// </param>
    /// <param name="SifraIgra">
    /// Šifra igre. Obavezno polje.
    /// </param>
    public record ClanDTOInsertUpdate(
        [Range(2, int.MaxValue, ErrorMessage = "{0} mora biti između {1} i {2}")]
            int? BrojBodova,
        [Required(ErrorMessage = "Obavezno")]
            bool Pobjeda,
        [Required(ErrorMessage = "Obavezno")]
            int SifraIgrac,
        [Required(ErrorMessage = "Obavezno")]
            int SifraIgra
    );
}
