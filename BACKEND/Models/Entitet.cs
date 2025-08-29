using System.ComponentModel.DataAnnotations;

namespace BACKEND.Models
{
    /// <summary>
    /// Apstraktna bazna klasa za entitete s jedinstvenom šifrom.
    /// </summary>
    public abstract class Entitet
    {
        /// <summary>
        /// Jedinstvena šifra entiteta.
        /// </summary>
        [Key]
        public int? Sifra { get; set; }
    }
}
