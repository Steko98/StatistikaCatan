using System.ComponentModel.DataAnnotations;

namespace BACKEND.Models.DTO
{
    public record TurnirDTOInsertUpdate(
        [Required(ErrorMessage = "Naziv je obvezan")]
        string Naziv,
        DateTime? DatumPocetka,
        DateTime? DatumZavrsetka
    );
}
