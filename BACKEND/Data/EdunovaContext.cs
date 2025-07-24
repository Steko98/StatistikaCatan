using BACKEND.Models;
using Microsoft.EntityFrameworkCore;

namespace BACKEND.Data
{
    public class EdunovaContext : DbContext
    {
        public EdunovaContext(DbContextOptions<EdunovaContext> options) : base(options)
        {

        }

        public DbSet<Turnir> Turniri { get; set; }
        public DbSet<Igrac> Igraci { get; set; }
        public DbSet<Igra> Igre { get; set; }
        public DbSet<Clan> Clanovi { get; set; }

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
