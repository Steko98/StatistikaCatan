using System.ComponentModel.DataAnnotations;

namespace BACKEND.Models.DTO
{
    /// <summary>
    /// DTO (Data Transfer Object) za operatera.
    /// Koristi se za prijenos podataka o operateru prilikom autentikacije.
    /// </summary>
    /// <param name="Email">
    /// Email adresa operatera. Obavezno polje.
    /// </param>
    /// <param name="Password">
    /// Lozinka operatera. Obavezno polje.
    /// </param>
    public record OperaterDTO(
        [Required(ErrorMessage = "Obvezan email.")]
        string Email,
        [Required(ErrorMessage = "Obvezna lozinka")]
        string Password
    );
}
