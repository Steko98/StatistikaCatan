namespace BACKEND.Models
{
    /// <summary>
    /// Predstavlja operatera sustava.
    /// Nasljeđuje osnovne entitetske karakteristike iz klase <see cref="Entitet"/>.
    /// </summary>
    public class Operater : Entitet
    {
        /// <summary>
        /// Email adresa operatera.
        /// </summary>
        public string Email { get; set; } = "";

        /// <summary>
        /// Lozinka operatera.
        /// </summary>
        public string Lozinka { get; set; } = "";
    }
}
