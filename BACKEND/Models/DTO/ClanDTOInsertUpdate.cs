using System.ComponentModel.DataAnnotations;

namespace BACKEND.Models.DTO
{
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
