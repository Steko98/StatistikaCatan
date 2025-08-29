using System.ComponentModel.DataAnnotations;

namespace BACKEND.Models.DTO
{
    /// <summary>
    /// DTO za unos ili ažuriranje turnira.
    /// </summary>
    /// <param name="Naziv">
    /// Naziv turnira. Obavezno polje.
    /// </param>
    /// <param name="DatumPocetka">
    /// Datum početka turnira. Opcionalno polje.
    /// </param>
    /// <param name="DatumZavrsetka">
    /// Datum završetka turnira. Opcionalno polje.
    /// </param>
    public record TurnirDTOInsertUpdate(
        [Required(ErrorMessage = "Naziv je obvezan")]
        string Naziv,
        DateTime? DatumPocetka,
        DateTime? DatumZavrsetka
    );
}
