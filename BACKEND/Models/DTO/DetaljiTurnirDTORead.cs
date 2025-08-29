namespace BACKEND.Models.DTO
{
    /// <summary>
    /// DTO klasa za prikaz detalja turnira.
    /// </summary>
    public class DetaljiTurnirDTORead
    {
        /// <summary>
        /// Jedinstvena šifra turnira.
        /// </summary>
        public int Sifra { get; set; }

        /// <summary>
        /// Naziv turnira.
        /// </summary>
        public string Naziv { get; set; }

        /// <summary>
        /// Popis igara koje su povezane s turnirom.
        /// </summary>
        public List<DetaljiIgraDTORead> Igre { get; set; }
    }
}
