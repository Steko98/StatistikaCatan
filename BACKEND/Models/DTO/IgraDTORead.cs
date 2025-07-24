namespace BACKEND.Models.DTO
{
    public record IgraDTORead(
        int Sifra,
        DateTime? datum,
        string? TurnirNaziv
        );
}
