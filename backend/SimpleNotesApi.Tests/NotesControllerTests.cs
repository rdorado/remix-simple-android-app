using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using SimpleNotesApi.Controllers;
using SimpleNotesApi.Data;
using SimpleNotesApi.DTOs;
using SimpleNotesApi.Models;
using Xunit;

namespace SimpleNotesApi.Tests
{
    public class NotesControllerTests
    {
        private static NotesDbContext GetInMemoryDbContext(string dbName)
        {
            var options = new DbContextOptionsBuilder<NotesDbContext>()
                .UseInMemoryDatabase(databaseName: dbName)
                .Options;

            return new NotesDbContext(options);
        }

        [Fact]
        public async Task GetNotes_ShouldReturnAllNotes_WhenNoFilterApplied()
        {
            // Arrange
            using var context = GetInMemoryDbContext(nameof(GetNotes_ShouldReturnAllNotes_WhenNoFilterApplied));
            context.Notes.AddRange(
                new Note { Id = 1, Title = "Note A", Content = "Content A", Category = "Work" },
                new Note { Id = 2, Title = "Note B", Content = "Content B", Category = "Personal" }
            );
            await context.SaveChangesAsync();

            var logger = NullLogger<NotesController>.Instance;
            var controller = new NotesController(context, logger);

            // Act
            var actionResult = await controller.GetNotes(query: null, category: null);

            // Assert
            var okResult = actionResult.Result.Should().BeOfType<OkObjectResult>().Subject;
            var notes = okResult.Value.Should().BeAssignableTo<IEnumerable<NoteResponseDto>>().Subject;
            notes.Should().HaveCount(2);
        }

        [Fact]
        public async Task GetNotes_ShouldFilterBySearchQuery()
        {
            // Arrange
            using var context = GetInMemoryDbContext(nameof(GetNotes_ShouldFilterBySearchQuery));
            context.Notes.AddRange(
                new Note { Id = 1, Title = "Shopping list", Content = "Buy apples", Category = "Tasks" },
                new Note { Id = 2, Title = "Meeting notes", Content = "Discuss architecture", Category = "Work" }
            );
            await context.SaveChangesAsync();

            var controller = new NotesController(context, NullLogger<NotesController>.Instance);

            // Act
            var actionResult = await controller.GetNotes(query: "apples", category: null);

            // Assert
            var okResult = actionResult.Result.Should().BeOfType<OkObjectResult>().Subject;
            var notes = okResult.Value.Should().BeAssignableTo<IEnumerable<NoteResponseDto>>().Subject.ToList();
            notes.Should().HaveCount(1);
            notes.First().Title.Should().Be("Shopping list");
        }

        [Fact]
        public async Task GetNotes_ShouldFilterByCategory()
        {
            // Arrange
            using var context = GetInMemoryDbContext(nameof(GetNotes_ShouldFilterByCategory));
            context.Notes.AddRange(
                new Note { Id = 1, Title = "Note 1", Content = "Text", Category = "Work" },
                new Note { Id = 2, Title = "Note 2", Content = "Text", Category = "Personal" }
            );
            await context.SaveChangesAsync();

            var controller = new NotesController(context, NullLogger<NotesController>.Instance);

            // Act
            var actionResult = await controller.GetNotes(query: null, category: "Work");

            // Assert
            var okResult = actionResult.Result.Should().BeOfType<OkObjectResult>().Subject;
            var notes = okResult.Value.Should().BeAssignableTo<IEnumerable<NoteResponseDto>>().Subject.ToList();
            notes.Should().HaveCount(1);
            notes.First().Category.Should().Be("Work");
        }

        [Fact]
        public async Task GetNoteById_ShouldReturnNote_WhenIdExists()
        {
            // Arrange
            using var context = GetInMemoryDbContext(nameof(GetNoteById_ShouldReturnNote_WhenIdExists));
            context.Notes.Add(new Note { Id = 10, Title = "Target Note", Content = "Target Content", Category = "Ideas" });
            await context.SaveChangesAsync();

            var controller = new NotesController(context, NullLogger<NotesController>.Instance);

            // Act
            var actionResult = await controller.GetNoteById(10);

            // Assert
            var okResult = actionResult.Result.Should().BeOfType<OkObjectResult>().Subject;
            var note = okResult.Value.Should().BeOfType<NoteResponseDto>().Subject;
            note.Id.Should().Be(10);
            note.Title.Should().Be("Target Note");
        }

        [Fact]
        public async Task GetNoteById_ShouldReturnNotFound_WhenIdDoesNotExist()
        {
            // Arrange
            using var context = GetInMemoryDbContext(nameof(GetNoteById_ShouldReturnNotFound_WhenIdDoesNotExist));
            var controller = new NotesController(context, NullLogger<NotesController>.Instance);

            // Act
            var actionResult = await controller.GetNoteById(999);

            // Assert
            actionResult.Result.Should().BeOfType<NotFoundObjectResult>();
        }

        [Fact]
        public async Task CreateNote_ShouldAddNoteToDatabase()
        {
            // Arrange
            using var context = GetInMemoryDbContext(nameof(CreateNote_ShouldAddNoteToDatabase));
            var controller = new NotesController(context, NullLogger<NotesController>.Instance);

            var createDto = new CreateNoteDto
            {
                Title = "New Note",
                Content = "New Content",
                Category = "Work",
                IsPinned = true,
                ColorHex = "#FEF3C7"
            };

            // Act
            var actionResult = await controller.CreateNote(createDto);

            // Assert
            var createdResult = actionResult.Result.Should().BeOfType<CreatedAtActionResult>().Subject;
            var responseDto = createdResult.Value.Should().BeOfType<NoteResponseDto>().Subject;

            responseDto.Title.Should().Be("New Note");
            responseDto.IsPinned.Should().BeTrue();

            var dbNote = await context.Notes.FirstOrDefaultAsync(n => n.Title == "New Note");
            dbNote.Should().NotBeNull();
        }

        [Fact]
        public async Task UpdateNote_ShouldModifyExistingNote()
        {
            // Arrange
            using var context = GetInMemoryDbContext(nameof(UpdateNote_ShouldModifyExistingNote));
            context.Notes.Add(new Note { Id = 1, Title = "Old Title", Content = "Old Content", Category = "Work" });
            await context.SaveChangesAsync();

            var controller = new NotesController(context, NullLogger<NotesController>.Instance);
            var updateDto = new UpdateNoteDto
            {
                Title = "Updated Title",
                Content = "Updated Content",
                Category = "Personal",
                IsPinned = true,
                IsCompleted = true,
                ColorHex = "#E0E7FF"
            };

            // Act
            var actionResult = await controller.UpdateNote(1, updateDto);

            // Assert
            var okResult = actionResult.Result.Should().BeOfType<OkObjectResult>().Subject;
            var responseDto = okResult.Value.Should().BeOfType<NoteResponseDto>().Subject;
            responseDto.Title.Should().Be("Updated Title");

            var updatedInDb = await context.Notes.FindAsync(1);
            updatedInDb!.Title.Should().Be("Updated Title");
            updatedInDb.IsCompleted.Should().BeTrue();
        }

        [Fact]
        public async Task UpdatePinStatus_ShouldToggleIsPinnedFlag()
        {
            // Arrange
            using var context = GetInMemoryDbContext(nameof(UpdatePinStatus_ShouldToggleIsPinnedFlag));
            context.Notes.Add(new Note { Id = 1, Title = "Note 1", Content = "Content", IsPinned = false });
            await context.SaveChangesAsync();

            var controller = new NotesController(context, NullLogger<NotesController>.Instance);

            // Act
            var actionResult = await controller.UpdatePinStatus(1, new UpdatePinDto { IsPinned = true });

            // Assert
            var okResult = actionResult.Result.Should().BeOfType<OkObjectResult>().Subject;
            var responseDto = okResult.Value.Should().BeOfType<NoteResponseDto>().Subject;
            responseDto.IsPinned.Should().BeTrue();
        }

        [Fact]
        public async Task UpdateCompletedStatus_ShouldToggleIsCompletedFlag()
        {
            // Arrange
            using var context = GetInMemoryDbContext(nameof(UpdateCompletedStatus_ShouldToggleIsCompletedFlag));
            context.Notes.Add(new Note { Id = 1, Title = "Note 1", Content = "Content", IsCompleted = false });
            await context.SaveChangesAsync();

            var controller = new NotesController(context, NullLogger<NotesController>.Instance);

            // Act
            var actionResult = await controller.UpdateCompletedStatus(1, new UpdateCompletedDto { IsCompleted = true });

            // Assert
            var okResult = actionResult.Result.Should().BeOfType<OkObjectResult>().Subject;
            var responseDto = okResult.Value.Should().BeOfType<NoteResponseDto>().Subject;
            responseDto.IsCompleted.Should().BeTrue();
        }

        [Fact]
        public async Task DeleteNote_ShouldRemoveNoteFromDatabase()
        {
            // Arrange
            using var context = GetInMemoryDbContext(nameof(DeleteNote_ShouldRemoveNoteFromDatabase));
            context.Notes.Add(new Note { Id = 5, Title = "To Delete", Content = "Content" });
            await context.SaveChangesAsync();

            var controller = new NotesController(context, NullLogger<NotesController>.Instance);

            // Act
            var result = await controller.DeleteNote(5);

            // Assert
            result.Should().BeOfType<NoContentResult>();
            var dbNote = await context.Notes.FindAsync(5);
            dbNote.Should().BeNull();
        }

        [Fact]
        public async Task SeedNotes_ShouldPopulateSampleNotes_WhenDatabaseIsEmpty()
        {
            // Arrange
            using var context = GetInMemoryDbContext(nameof(SeedNotes_ShouldPopulateSampleNotes_WhenDatabaseIsEmpty));
            var controller = new NotesController(context, NullLogger<NotesController>.Instance);

            // Act
            var actionResult = await controller.SeedNotes();

            // Assert
            var okResult = actionResult.Result.Should().BeOfType<OkObjectResult>().Subject;
            var seededNotes = okResult.Value.Should().BeAssignableTo<IEnumerable<NoteResponseDto>>().Subject.ToList();
            seededNotes.Should().HaveCount(3);

            var dbCount = await context.Notes.CountAsync();
            dbCount.Should().Be(3);
        }
    }
}
