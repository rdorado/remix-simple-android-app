using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SimpleNotesApi.Data;
using SimpleNotesApi.DTOs;
using SimpleNotesApi.Models;

namespace SimpleNotesApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotesController : ControllerBase
    {
        private readonly NotesDbContext _context;
        private readonly ILogger<NotesController> _logger;

        public NotesController(NotesDbContext context, ILogger<NotesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/notes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NoteResponseDto>>> GetNotes(
            [FromQuery] string? query = null,
            [FromQuery] string? category = null)
        {
            IQueryable<Note> notesQuery = _context.Notes.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(query))
            {
                var search = query.Trim().ToLower();
                notesQuery = notesQuery.Where(n =>
                    n.Title.ToLower().Contains(search) ||
                    n.Content.ToLower().Contains(search));
            }

            if (!string.IsNullOrWhiteSpace(category) && !category.Equals("All", StringComparison.OrdinalIgnoreCase))
            {
                notesQuery = notesQuery.Where(n => n.Category.ToLower() == category.ToLower());
            }

            var notes = await notesQuery
                .OrderByDescending(n => n.IsPinned)
                .ThenByDescending(n => n.Timestamp)
                .Select(n => MapToResponseDto(n))
                .ToListAsync();

            return Ok(notes);
        }

        // GET: api/notes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<NoteResponseDto>> GetNoteById(int id)
        {
            var note = await _context.Notes.FindAsync(id);
            if (note == null)
            {
                return NotFound(new { message = $"Note with ID {id} not found." });
            }

            return Ok(MapToResponseDto(note));
        }

        // POST: api/notes
        [HttpPost]
        public async Task<ActionResult<NoteResponseDto>> CreateNote([FromBody] CreateNoteDto createDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var nowMs = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            var note = new Note
            {
                Title = createDto.Title,
                Content = createDto.Content,
                Category = string.IsNullOrWhiteSpace(createDto.Category) ? "Personal" : createDto.Category,
                IsPinned = createDto.IsPinned,
                IsCompleted = createDto.IsCompleted,
                ColorHex = string.IsNullOrWhiteSpace(createDto.ColorHex) ? "#FFF8E1" : createDto.ColorHex,
                Timestamp = nowMs,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Notes.Add(note);
            await _context.SaveChangesAsync();

            var responseDto = MapToResponseDto(note);
            return CreatedAtAction(nameof(GetNoteById), new { id = note.Id }, responseDto);
        }

        // PUT: api/notes/5
        [HttpPut("{id}")]
        public async Task<ActionResult<NoteResponseDto>> UpdateNote(int id, [FromBody] UpdateNoteDto updateDto)
        {
            var note = await _context.Notes.FindAsync(id);
            if (note == null)
            {
                return NotFound(new { message = $"Note with ID {id} not found." });
            }

            note.Title = updateDto.Title;
            note.Content = updateDto.Content;
            note.Category = updateDto.Category;
            note.IsPinned = updateDto.IsPinned;
            note.IsCompleted = updateDto.IsCompleted;
            note.ColorHex = updateDto.ColorHex;
            note.Timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            note.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(MapToResponseDto(note));
        }

        // PATCH: api/notes/5/pin
        [HttpPatch("{id}/pin")]
        public async Task<ActionResult<NoteResponseDto>> UpdatePinStatus(int id, [FromBody] UpdatePinDto pinDto)
        {
            var note = await _context.Notes.FindAsync(id);
            if (note == null)
            {
                return NotFound(new { message = $"Note with ID {id} not found." });
            }

            note.IsPinned = pinDto.IsPinned;
            note.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(MapToResponseDto(note));
        }

        // PATCH: api/notes/5/complete
        [HttpPatch("{id}/complete")]
        public async Task<ActionResult<NoteResponseDto>> UpdateCompletedStatus(int id, [FromBody] UpdateCompletedDto completedDto)
        {
            var note = await _context.Notes.FindAsync(id);
            if (note == null)
            {
                return NotFound(new { message = $"Note with ID {id} not found." });
            }

            note.IsCompleted = completedDto.IsCompleted;
            note.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(MapToResponseDto(note));
        }

        // DELETE: api/notes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNote(int id)
        {
            var note = await _context.Notes.FindAsync(id);
            if (note == null)
            {
                return NotFound(new { message = $"Note with ID {id} not found." });
            }

            _context.Notes.Remove(note);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/notes/seed
        [HttpPost("seed")]
        public async Task<ActionResult<IEnumerable<NoteResponseDto>>> SeedNotes()
        {
            if (await _context.Notes.AnyAsync())
            {
                var existingNotes = await _context.Notes
                    .OrderByDescending(n => n.IsPinned)
                    .ThenByDescending(n => n.Timestamp)
                    .Select(n => MapToResponseDto(n))
                    .ToListAsync();
                return Ok(existingNotes);
            }

            var sampleNotes = new List<Note>
            {
                new Note
                {
                    Title = "Welcome to Simple Notes",
                    Content = "Tap the + button to capture quick ideas, daily to-dos, or notes. Filter by category above or pin important notes!",
                    Category = "Ideas",
                    IsPinned = true,
                    IsCompleted = false,
                    ColorHex = "#FEF3C7",
                    Timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
                },
                new Note
                {
                    Title = "Grocery Shopping List",
                    Content = "Fresh veggies, Almond Milk, Dark Chocolate, Oat cereal, and Organic coffee beans.",
                    Category = "Tasks",
                    IsPinned = false,
                    IsCompleted = false,
                    ColorHex = "#E0E7FF",
                    Timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
                },
                new Note
                {
                    Title = "Weekly Project Ideas",
                    Content = "1. Design a clean task dashboard\n2. Add custom color tags\n3. Test responsive layout on tablet",
                    Category = "Work",
                    IsPinned = false,
                    IsCompleted = false,
                    ColorHex = "#D1FAE5",
                    Timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
                }
            };

            _context.Notes.AddRange(sampleNotes);
            await _context.SaveChangesAsync();

            var seededDtos = sampleNotes.Select(MapToResponseDto).ToList();
            return Ok(seededDtos);
        }

        private static NoteResponseDto MapToResponseDto(Note note)
        {
            return new NoteResponseDto
            {
                Id = note.Id,
                Title = note.Title,
                Content = note.Content,
                Category = note.Category,
                IsPinned = note.IsPinned,
                IsCompleted = note.IsCompleted,
                ColorHex = note.ColorHex,
                Timestamp = note.Timestamp
            };
        }
    }
}
