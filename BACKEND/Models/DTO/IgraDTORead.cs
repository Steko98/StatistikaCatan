namespace BACKEND.Models.DTO
{
    /// <summary>
    /// DTO zapis za prikaz podataka o igri.
    /// </summary>
    /// <param name="Sifra">Jedinstvena šifra igre.</param>
    /// <param name="datum">Datum održavanja igre (može biti null).</param>
    /// <param name="TurnirNaziv">Naziv turnira na kojem se igra održava (može biti null).</param>
    public record IgraDTORead(
        int Sifra,
        DateTime? datum,
        string? TurnirNaziv
        );
}
