//using Microsoft.AspNetCore.Authentication.JwtBearer;
//using Microsoft.IdentityModel.Tokens;
//using Microsoft.OpenApi.Models;
//using System.Reflection;
//using System.Text;

//namespace BACKEND.Extensions
//{
//    public static class CatanExtensions
//    {
//        public static void AddCatanSwaggerGen(this IServiceCollection Services)
//        {
//            Services.AddSwaggerGen(sgo =>
//            {
//                var o = new Microsoft.OpenApi.Models.OpenApiInfo()
//                {
//                    Title = "Catan API",
//                    Version = "v1",
//                    Contact = new Microsoft.OpenApi.Models.OpenApiContact()
//                    {
//                        Email = "ivan.steko5@gmail.com",
//                        Name = "Ivan Steko"
//                    },
//                    Description = "Ovo je dokumentacija za Catan API",
//                    License = new Microsoft.OpenApi.Models.OpenApiLicense()
//                    {
//                        Name = "Edukacijska licenca?"
//                    }
//                };
//                sgo.SwaggerDoc("v1", o);

//                sgo.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
//                {
//                    Description = @"JWT Autorizacija radi tako da se prvo na ruti /api/v1/Autorizacija/token.  
//                              autorizirate i dobijete token (bez navodnika). Upišite 'Bearer' [razmak] i dobiveni token.
//                              Primjer: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE2OTc3MTc2MjksImV4cCI6MTY5Nzc0NjQyOSwiaWF0IjoxNjk3NzE3NjI5fQ.PN7YPayllTrWESc6mdyp3XCQ1wp3FfDLZmka6_dAJsY'",
//                    Name = "Authorization",
//                    In = ParameterLocation.Header,
//                    Type = SecuritySchemeType.ApiKey,
//                    Scheme = "Bearer"
//                });

//                sgo.AddSecurityRequirement(new OpenApiSecurityRequirement()
//                {
//                    {
//                        new OpenApiSecurityScheme
//                        {
//                            Reference = new OpenApiReference
//                            {
//                                Type = ReferenceType.SecurityScheme,
//                                Id="Bearer"
//                            },
//                            Scheme="oauth2",
//                            Name = "Bearer",
//                            In = ParameterLocation.Header,
//                        },
//                        new List<string>()
//                    }
//                });

//                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
//                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
//                sgo.IncludeXmlComments(xmlPath, includeControllerXmlComments: true);
//            });
//        }

//        public static

//    }
//}
