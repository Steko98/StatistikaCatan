using System.ComponentModel.DataAnnotations;

namespace BACKEND.Models.DTO
{
    public record OperaterDTO(
        [Required(ErrorMessage = "Obvezan email.")]
        string Email,
        [Required(ErrorMessage = "Obvezna lozinka")]
        string Password
    );
}
