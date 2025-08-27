using BACKEND.Models.DTO;
using Swashbuckle.AspNetCore.Filters;

namespace BACKEND.Filters
{
    public class AutorizacijaExampleProvider : IExamplesProvider<OperaterDTO>
    {
        public OperaterDTO GetExamples() => new
            (
            "ivan.steko5@gmail.com", "edunovawp8"
            );
    }
}
