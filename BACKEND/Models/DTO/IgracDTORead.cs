namespace BACKEND.Models.DTO
{
    /// <summary>
    /// DTO zapis za prikaz podataka o igraču.
    /// </summary>
    /// <param name="Sifra">Jedinstvena šifra igrača.</param>
    /// <param name="Ime">Ime igrača.</param>
    /// <param name="Slika">Putanja ili URL slike igrača (može biti null).</param>
    public record IgracDTORead(
        int Sifra,
        string Ime,
        string? Slika
        );
}
