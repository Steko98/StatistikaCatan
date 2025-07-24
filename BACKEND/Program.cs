using BACKEND.Data;
using BACKEND.Mapping;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddOpenApi(); // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddSwaggerGen();

//dodavanje db contexta

builder.Services.AddDbContext<EdunovaContext>(o =>
{
    o.UseSqlServer(builder.Configuration.GetConnectionString("EdunovaContext"));
});


builder.Services.AddCors(o =>
{
    o.AddPolicy("CorsPolicy", builder =>
    {
        builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

//automapper
builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddProfile<CatanMappingProfile>();
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.MapOpenApi();

app.UseHttpsRedirection();

app.UseAuthorization();

//Swagger
app.UseSwagger();
app.UseSwaggerUI(options => {
    options.EnableTryItOutByDefault();
    options.ConfigObject.AdditionalItems.Add("requestSnippetsEnabled", true);
});


app.MapControllers();
app.UseCors("CorsPolicy");



app.UseStaticFiles();
app.UseDefaultFiles();
app.MapFallbackToFile("index.html");


app.Run();