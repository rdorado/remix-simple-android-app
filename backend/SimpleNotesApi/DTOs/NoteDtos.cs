namespace SimpleNotesApi.DTOs
{
    public class NoteResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Category { get; set; } = "Personal";
        public bool IsPinned { get; set; }
        public bool IsCompleted { get; set; }
        public string ColorHex { get; set; } = "#FFF8E1";
        public long Timestamp { get; set; }
    }

    public class CreateNoteDto
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Category { get; set; } = "Personal";
        public bool IsPinned { get; set; } = false;
        public bool IsCompleted { get; set; } = false;
        public string ColorHex { get; set; } = "#FFF8E1";
    }

    public class UpdateNoteDto
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Category { get; set; } = "Personal";
        public bool IsPinned { get; set; }
        public bool IsCompleted { get; set; }
        public string ColorHex { get; set; } = "#FFF8E1";
    }

    public class UpdatePinDto
    {
        public bool IsPinned { get; set; }
    }

    public class UpdateCompletedDto
    {
        public bool IsCompleted { get; set; }
    }
}
