using BACKEND.Models.DTO;
using Swashbuckle.AspNetCore.Filters;

namespace BACKEND.Filters
{
    /// <summary>
    /// Pruža primjer objekta <see cref="OperaterDTO"/> za potrebe Swagger dokumentacije.
    /// </summary>
    public class AutorizacijaExampleProvider : IExamplesProvider<OperaterDTO>
    {
        /// <summary>
        /// Vraća primjer objekta <see cref="OperaterDTO"/> s unaprijed definiranim podacima.
        /// </summary>
        /// <returns>
        /// Primjer objekta <see cref="OperaterDTO"/> s korisničkim imenom i lozinkom.
        /// </returns>
        public OperaterDTO GetExamples() => new
            (
            "ivan.steko5@gmail.com", "edunovawp8"
            );
    }
}
