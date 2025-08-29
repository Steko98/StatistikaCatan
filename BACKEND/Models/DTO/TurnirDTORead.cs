namespace BACKEND.Models.DTO
{
    /// <summary>
    /// DTO zapis za prikaz podataka o turniru.
    /// </summary>
    /// <param name="Sifra">Jedinstvena šifra turnira.</param>
    /// <param name="Naziv">Naziv turnira.</param>
    /// <param name="DatumPocetka">Datum početka turnira (može biti null).</param>
    /// <param name="DatumZavrsetka">Datum završetka turnira (može biti null).</param>
    public record TurnirDTORead(
        int Sifra,
        string Naziv,
        DateTime? DatumPocetka,
        DateTime? DatumZavrsetka
    );
}
