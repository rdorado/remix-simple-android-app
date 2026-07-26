using Microsoft.EntityFrameworkCore;
using SimpleNotesApi.Models;

namespace SimpleNotesApi.Data
{
    public class NotesDbContext : DbContext
    {
        public NotesDbContext(DbContextOptions<NotesDbContext> options) : base(options)
        {
        }

        public DbSet<Note> Notes { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Note>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Content).IsRequired();
                entity.Property(e => e.Category).HasMaxLength(50).HasDefaultValue("Personal");
                entity.Property(e => e.ColorHex).HasMaxLength(20).HasDefaultValue("#FFF8E1");
                entity.HasIndex(e => new { e.IsPinned, e.Timestamp });
            });

            // Seed initial sample data
            modelBuilder.Entity<Note>().HasData(
                new Note
                {
                    Id = 1,
                    Title = "Welcome to Simple Notes",
                    Content = "Tap the + button to capture quick ideas, daily to-dos, or notes. Filter by category above or pin important notes!",
                    Category = "Ideas",
                    IsPinned = true,
                    IsCompleted = false,
                    ColorHex = "#FEF3C7",
                    Timestamp = 1700000000000
                },
                new Note
                {
                    Id = 2,
                    Title = "Grocery Shopping List",
                    Content = "Fresh veggies, Almond Milk, Dark Chocolate, Oat cereal, and Organic coffee beans.",
                    Category = "Tasks",
                    IsPinned = false,
                    IsCompleted = false,
                    ColorHex = "#E0E7FF",
                    Timestamp = 1700000100000
                },
                new Note
                {
                    Id = 3,
                    Title = "Weekly Project Ideas",
                    Content = "1. Design a clean task dashboard\n2. Add custom color tags\n3. Test responsive layout on tablet",
                    Category = "Work",
                    IsPinned = false,
                    IsCompleted = false,
                    ColorHex = "#D1FAE5",
                    Timestamp = 1700000200000
                }
            );
        }
    }
}
