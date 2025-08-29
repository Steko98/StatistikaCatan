using System.ComponentModel.DataAnnotations;

namespace BACKEND.Models.DTO
{
    /// <summary>
    /// DTO (Data Transfer Object) za prijenos slike u obliku Base64 zapisa.
    /// </summary>
    /// <param name="Base64">
    /// Base64 zapis slike. Ovo polje je obavezno.
    /// </param>
    public record SlikaDTO([Required(ErrorMessage = "Base64 zapis slike obavezno")] string Base64);
}
