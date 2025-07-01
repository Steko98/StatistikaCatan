using System.ComponentModel.DataAnnotations;

namespace BACKEND.Models
{
    public abstract class Entitet
    {
        [Key]
        public int Sifra { get; set; }
    }
}
