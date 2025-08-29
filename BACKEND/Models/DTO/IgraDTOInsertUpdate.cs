using System.ComponentModel.DataAnnotations;

namespace BACKEND.Models.DTO
{
    /// <summary>
    /// DTO za umetanje ili ažuriranje entiteta Igra.
    /// </summary>
    /// <param name="datum">
    /// Datum održavanja igre. Može biti null ako datum nije poznat.
    /// </param>
    /// <param name="TurnirSifra">
    /// Šifra turnira na kojem se igra održava. Obavezno polje, mora biti veće od 0.
    /// </param>
    public record IgraDTOInsertUpdate(
        DateTime? datum,
        [Range(1, int.MaxValue, ErrorMessage = "{0} mora biti između {1} i {2}")]
        [Required(ErrorMessage = "Obavezan turnir")]
        int? TurnirSifra
        );
}
