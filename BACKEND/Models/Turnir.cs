namespace BACKEND.Models
{
    public class Turnir : Entitet
    {
        public string Naziv { get; set; } = "";
        public DateTime? DatumPocetka { get; set; }
        public DateTime? DatumZavrsetka { get; set; }
    }
}
