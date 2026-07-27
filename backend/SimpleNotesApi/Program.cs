using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using SimpleNotesApi.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Simple Notes REST API",
        Version = "v1",
        Description = ".NET Core 10 Web API backend with PostgreSQL persistence for Simple Notes Android Application."
    });
});

// Configure EF Core with PostgreSQL (Npgsql)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Host=postgres;Database=simplenotesdb;Username=postgres;Password=postgres";

builder.Services.AddDbContext<NotesDbContext>(options =>
    options.UseNpgsql(connectionString));

// Configure CORS for mobile / web client access
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Auto-migrate or ensure PostgreSQL database is created at startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<NotesDbContext>();
        context.Database.EnsureCreated();
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while initializing or creating the PostgreSQL database.");
    }
}

// Enable Swagger UI in Development and Container environments
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Simple Notes API v1");
    c.RoutePrefix = string.Empty; // Serve Swagger UI at app root
});

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
