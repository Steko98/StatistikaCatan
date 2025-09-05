using System.ComponentModel.DataAnnotations.Schema;

namespace BACKEND.Models
{
    /// <summary>
    /// Predstavlja turnir u sustavu.
    /// Nasljeđuje osnovne entitetske karakteristike iz klase <see cref="Entitet"/>.
    /// </summary>
    public class Turnir : Entitet
    {
        /// <summary>
        /// Naziv turnira.
        /// </summary>
        [Column("Ime")]
        public string Naziv { get; set; } = "";

        /// <summary>
        /// Datum početka turnira.
        /// </summary>
        public DateTime? DatumPocetka { get; set; }

        /// <summary>
        /// Datum završetka turnira.
        /// </summary>
        public DateTime? DatumZavrsetka { get; set; }

        /// <summary>
        /// Kolekcija igara koje su povezane s ovim turnirom.
        /// </summary>
        public ICollection<Igra>? Igre { get; set; }

        [Column("operater_id")]
        public int OperaterId { get; set; }
        public Operater Operater { get; set; }
    }
}
