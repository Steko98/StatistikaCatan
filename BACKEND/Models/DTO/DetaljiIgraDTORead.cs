namespace BACKEND.Models.DTO
{
    public class DetaljiIgraDTORead
    {
        public int Sifra { get; set; }
        public DateTime Datum { get; set; }
        public List<ClanDTORead> Clanovi { get; set; }
    }
}
