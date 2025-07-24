using System.ComponentModel.DataAnnotations.Schema;

namespace BACKEND.Models
{
    public class Igra : Entitet
    {
        public DateTime? Datum { get; set; }

        [ForeignKey("turnir")]
        public required Turnir Turnir { get; set; }

        public ICollection<Clan> Clanovi { get; set; }
    }
}
