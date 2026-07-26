using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SimpleNotesApi.Models
{
    [Table("notes")]
    public class Note
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        [Column("title")]
        public string Title { get; set; } = string.Empty;

        [Required]
        [Column("content")]
        public string Content { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        [Column("category")]
        public string Category { get; set; } = "Personal";

        [Column("is_pinned")]
        public bool IsPinned { get; set; } = false;

        [Column("is_completed")]
        public bool IsCompleted { get; set; } = false;

        [MaxLength(20)]
        [Column("color_hex")]
        public string ColorHex { get; set; } = "#FFF8E1";

        [Column("timestamp")]
        public long Timestamp { get; set; } = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
