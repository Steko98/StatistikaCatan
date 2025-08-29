namespace BACKEND.Models.DTO
{
    /// <summary>
    /// DTO klasa za prikaz detalja igre.
    /// </summary>
    public class DetaljiIgraDTORead
    {
        /// <summary>
        /// Jedinstvena šifra igre.
        /// </summary>
        public int Sifra { get; set; }

        /// <summary>
        /// Datum održavanja igre.
        /// </summary>
        public DateTime Datum { get; set; }

        /// <summary>
        /// Popis članova koji sudjeluju u igri.
        /// </summary>
        public List<ClanDTORead> Clanovi { get; set; }
    }
}
