using System.ComponentModel.DataAnnotations.Schema;

namespace BACKEND.Models
{
    public class Turnir : Entitet
    {
        [Column("Ime")]
        public string Naziv { get; set; } = "";
        public DateTime? DatumPocetka { get; set; }
        public DateTime? DatumZavrsetka { get; set; }
        public ICollection<Igra> Igre { get; set; }
    }
}
