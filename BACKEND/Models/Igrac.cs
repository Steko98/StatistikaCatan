using System.ComponentModel.DataAnnotations.Schema;

namespace BACKEND.Models
{
    /// <summary>
    /// Predstavlja igrača u sustavu.
    /// Nasljeđuje osnovne entitetske karakteristike iz klase <see cref="Entitet"/>.
    /// </summary>
    public class Igrac : Entitet
    {
        /// <summary>
        /// Ime igrača.
        /// </summary>
        public string Ime { get; set; } = "";

        /// <summary>
        /// Kolekcija članova (Clan) koji su povezani s ovim igračem.
        /// </summary>
        public ICollection<Clan>? Clanovi { get; set; }

        [Column("operater_id")]
        public int OperaterId { get; set; }
        public Operater Operater { get; set; }
    }
}
