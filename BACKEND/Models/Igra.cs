using System.ComponentModel.DataAnnotations.Schema;

namespace BACKEND.Models
{
    /// <summary>
    /// Predstavlja igru unutar sustava.
    /// Nasljeđuje osnovne entitetske karakteristike iz klase <see cref="Entitet"/>.
    /// </summary>
    public class Igra : Entitet
    {
        /// <summary>
        /// Datum održavanja igre.
        /// </summary>
        public DateTime? Datum { get; set; }

        /// <summary>
        /// Turnir kojem igra pripada.
        /// </summary>
        [ForeignKey("turnir")]
        public required Turnir Turnir { get; set; }

        /// <summary>
        /// Kolekcija članova koji sudjeluju u igri.
        /// </summary>
        public ICollection<Clan> Clanovi { get; set; }
    }
}
