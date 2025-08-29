using System.ComponentModel.DataAnnotations.Schema;

namespace BACKEND.Models
{
    /// <summary>
    /// Predstavlja vezu između igrača i igre.
    /// Nasljeđuje osnovne entitetske karakteristike iz klase <see cref="Entitet"/>.
    /// </summary>
    public class Clan : Entitet
    {
        /// <summary>
        /// Broj bodova koje je igrač ostvario u igri.
        /// </summary>
        public int? BrojBodova { get; set; }

        /// <summary>
        /// Označava je li igrač ostvario pobjedu u igri.
        /// </summary>
        public bool Pobjeda { get; set; }

        /// <summary>
        /// Igrač koji je član igre.
        /// </summary>
        [ForeignKey("igrac")]
        public required Igrac Igrac { get; set; }

        /// <summary>
        /// Igra u kojoj igrač sudjeluje.
        /// </summary>
        [ForeignKey("igra")]
        public required Igra Igra { get; set; }
    }
}
