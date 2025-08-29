using BACKEND.Filters;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;
using System.Reflection;
using System.Text;

namespace BACKEND.Extensions
{
    /// <summary>
    /// Proširenja za konfiguraciju Catan aplikacije.
    /// Sadrži metode za dodavanje Swagger dokumentacije, CORS politike i sigurnosti.
    /// </summary>
    public static class CatanExtensions
    {
        public static void AddCatanSwaggerGen(this IServiceCollection Services)
        {
            Services.AddSwaggerGen(sgo =>
            {
                var o = new Microsoft.OpenApi.Models.OpenApiInfo()
                {
                    Title = "Catan API",
                    Version = "v1",
                    Contact = new Microsoft.OpenApi.Models.OpenApiContact()
                    {
                        Email = "ivan.steko5@gmail.com",
                        Name = "Ivan Steko"
                    },
                    Description = "Ovo je dokumentacija za Catan API",
                    License = new Microsoft.OpenApi.Models.OpenApiLicense()
                    {
                        Name = "Edukacijska licenca?"
                    }
                };
                sgo.SwaggerDoc("v1", o);

                sgo.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = @"JWT Autorizacija radi tako da se prvo na ruti /api/v1/Autorizacija/token.  
                              autorizirate i dobijete token (bez navodnika). Upišite 'Bearer' [razmak] i dobiveni token.
                              Primjer: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE2OTc3MTc2MjksImV4cCI6MTY5Nzc0NjQyOSwiaWF0IjoxNjk3NzE3NjI5fQ.PN7YPayllTrWESc6mdyp3XCQ1wp3FfDLZmka6_dAJsY'",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });

                sgo.AddSecurityRequirement(new OpenApiSecurityRequirement()
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id="Bearer"
                            },
                            Scheme="oauth2",
                            Name = "Bearer",
                            In = ParameterLocation.Header,
                        },
                        new List<string>()
                    }
                });

                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                sgo.IncludeXmlComments(xmlPath, includeControllerXmlComments: true);

                sgo.ExampleFilters();
            });

            Services.AddSwaggerExamplesFromAssemblies(typeof(AutorizacijaExampleProvider).Assembly);
        }

        /// <summary>
        /// Dodaje CORS politiku koja omogućuje pristup API-ju sa svih izvora, metoda i zaglavlja.
        /// </summary>
        /// <param name="Services">Kolekcija servisa aplikacije.</param>
        public static void AddCatanCORS(this IServiceCollection Services)
        {
            Services.AddCors(opcije =>
            {
                opcije.AddPolicy("CorsPolicy",
                    builder =>
                        builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()
                );
            });
        }

        /// <summary>
        /// Dodaje JWT autentikaciju i konfigurira sigurnosne parametre za Catan API.
        /// </summary>
        /// <param name="Services">Kolekcija servisa aplikacije.</param>
        public static void AddCatanSecurity(this IServiceCollection Services)
        {
            Services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(x =>
            {
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("NeZnamZaStoJeOvoTocnoAliJeKaoNekiTajniKljuc")),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = false
                };
            });
        }

    }
}
