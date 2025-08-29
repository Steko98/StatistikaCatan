using BACKEND.Models;
using Microsoft.EntityFrameworkCore;

namespace BACKEND.Data
{
    /// <summary>
    /// Predstavlja kontekst baze podataka za Catan aplikaciju.
    /// Nasljeđuje <see cref="DbContext"/> i omogućuje pristup entitetima baze podataka.
    /// </summary>
    public class EdunovaContext : DbContext
    {
        /// <summary>
        /// Inicijalizira novi primjerak <see cref="EdunovaContext"/> klase s navedenim opcijama.
        /// </summary>
        /// <param name="options">Opcije za konfiguraciju konteksta baze podataka.</param>
        public EdunovaContext(DbContextOptions<EdunovaContext> options) : base(options)
        {

        }

        /// <summary>
        /// Skup entiteta koji predstavlja turnire u bazi podataka.
        /// </summary>
        public DbSet<Turnir> Turniri { get; set; }

        /// <summary>
        /// Skup entiteta koji predstavlja igrače u bazi podataka.
        /// </summary>
        public DbSet<Igrac> Igraci { get; set; }

        /// <summary>
        /// Skup entiteta koji predstavlja igre u bazi podataka.
        /// </summary>
        public DbSet<Igra> Igre { get; set; }

        /// <summary>
        /// Skup entiteta koji predstavlja članove u bazi podataka.
        /// </summary>
        public DbSet<Clan> Clanovi { get; set; }

        /// <summary>
        /// Skup entiteta koji predstavlja operatere u bazi podataka.
        /// </summary>
        public DbSet<Operater> Operateri { get; set; }

        /// <summary>
        /// Konfigurira odnose između entiteta prilikom izgradnje modela baze podataka.
        /// </summary>
        /// <param name="modelBuilder">Objekt za izgradnju modela baze podataka.</param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Igra>().HasOne(t => t.Turnir);
            modelBuilder.Entity<Clan>(ent =>
            {
                ent.HasOne(i => i.Igra);
                ent.HasOne(ig => ig.Igrac);
            });

        }
    }
}
