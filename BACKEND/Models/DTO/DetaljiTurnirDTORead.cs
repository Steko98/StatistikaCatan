namespace BACKEND.Models.DTO
{
    public class DetaljiTurnirDTORead
    {
        public int Sifra { get; set; }
        public string Naziv { get; set; }
        public List<DetaljiIgraDTORead> Igre { get; set; }

    }
}
