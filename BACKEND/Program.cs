using BACKEND.Data;
using BACKEND.Extensions;
using BACKEND.Mapping;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddCatanSwaggerGen();
builder.Services.AddCatanCORS();


//dodavanje db contexta

builder.Services.AddDbContext<EdunovaContext>(o =>
{
    o.UseSqlServer(builder.Configuration.GetConnectionString("EdunovaContext"));
});

//automapper
builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddProfile<CatanMappingProfile>();
});

//security
builder.Services.AddCatanSecurity();
builder.Services.AddAuthorization();



var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI(opcije =>
{
    opcije.ConfigObject.AdditionalItems.Add("requestSnippetsEnabled", true);
    opcije.EnableTryItOutByDefault();
    opcije.DocExpansion(Swashbuckle.AspNetCore.SwaggerUI.DocExpansion.None);
});

app.UseHttpsRedirection();
app.UseCors("CorsPolicy");

//security
app.UseAuthentication();
app.UseAuthorization();
//security

app.MapControllers();

app.UseStaticFiles();
app.UseDefaultFiles();
app.MapFallbackToFile("index.html");



app.Run();