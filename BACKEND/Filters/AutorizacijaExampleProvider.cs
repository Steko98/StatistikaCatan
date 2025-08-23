using BACKEND.Models.DTO;
using Swashbuckle.AspNetCore.Filters;

namespace BACKEND.Filters
{
    public class AutorizacijaExampleProvider : IExamplesProvider<OperaterDTO>
    {
        public OperaterDTO GetExamples() => new
            (
            "ime.prezime@email.com", "lozinka"
            );
    }
}
