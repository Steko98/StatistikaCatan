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
    }
}
