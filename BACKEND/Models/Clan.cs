using System.ComponentModel.DataAnnotations.Schema;

namespace BACKEND.Models
{
    public class Clan
    {
        public int? BrojBodova { get; set; }
        public bool Pobjeda { get; set; }

        [ForeignKey("igrac")]
        public required Igrac Igrac { get; set; }

        [ForeignKey("igra")]
        public required Igra Igra { get; set; }
    }
}
