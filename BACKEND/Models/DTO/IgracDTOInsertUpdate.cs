using System.ComponentModel.DataAnnotations;

namespace BACKEND.Models.DTO
{
    /// <summary>
    /// DTO zapis za unos ili ažuriranje igrača.
    /// </summary>
    /// <param name="Ime">
    /// Ime igrača. Ovo polje je obavezno.
    /// </param>
    public record IgracDTOInsertUpdate(
        [Required(ErrorMessage = "Obavezno ime")]
        string Ime
        );
}
