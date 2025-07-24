using System.ComponentModel.DataAnnotations;

namespace BACKEND.Models.DTO
{
    public record IgracDTOInsertUpdate(
        [Required(ErrorMessage = "Obavezno ime")]
        string Ime
        );
}
