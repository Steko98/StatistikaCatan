using System.ComponentModel.DataAnnotations;

namespace BACKEND.Models.DTO
{
    public record IgraDTOInsertUpdate(
        DateTime? datum,
        [Range(1, int.MaxValue, ErrorMessage = "{0} mora biti između {1} i {2}")]
        [Required(ErrorMessage = "Obavezan turnir")]
        int? TurnirSifra
        );
}
