namespace BACKEND.Models.DTO
{
    public record TurnirDTORead(
        int Sifra,
        string Naziv,
        DateTime? DatumPocetka,
        DateTime? DatumZavrsetka
        );
}
