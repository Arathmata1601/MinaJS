using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using System.Text;
using backend.db; // Asegúrate de que este namespace contiene la clase AppDbContext
using backend.Models;
using getmineral.service; // Asegúrate de que este namespace contiene la clase ObtenerMinerales
using backend.Service;
using newUsers.Service;
using Auth.service; // Asegúrate de que este namespace contiene la clase AuthService
using vitrina.service; // Asegúrate de que este namespace contiene la clase ObtenerVitrinas
using mineral.service; // Asegúrate de que este namespace contiene la clase InventarioModel
using inventario.Service; // Asegúrate de que este namespace contiene la clase ObtenerInventario
using NewInventario.service; // Asegúrate de que este namespace contiene la clase NewInventario
 // Asegúrate de que este namespace contiene la clase NewUserService
using deleteMineral.service; // Asegúrate de que este namespace contiene la clase DeleteMineralService
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using System;
var builder = WebApplication.CreateBuilder(args);

// Obtén la cadena de conexión desde appsettings.json
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Usa solo una vez AddDbContext con la cadena de conexión correcta:
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 32)))
);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "APIMINA", // Asegúrate de que esto coincida con lo que usas al generar el token
            ValidAudience = "APIMINAUsers", // Asegúrate de que esto coincida con lo que usas al generar el token
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes("b&Q8fP2hL#xM3rT9vYzW4nJ7sK!pD6gB")) // La clave secreta que usas para generar los tokens
        };
    });

builder.Services.AddControllers();

builder.Services.AddScoped<ObtenerUsuarios>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ObtenerMinerales>();
builder.Services.AddScoped<NewUserService>();
builder.Services.AddScoped<NewMineralService>();
builder.Services.AddScoped<ObtenerInventario>();
builder.Services.AddScoped<NewInventarioService>();
builder.Services.AddScoped<ObtenerVitrinas>();
builder.Services.AddAuthorization();    

var corsPolicy = "_allowFrontend";

/*builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        //policy.WithOrigins("http://127.0.0.1:5500", "http://localhost:5183")
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});*/

// Agrega CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddScoped<DeleteMineralService>();

var app = builder.Build();
app.UseCors("AllowAll"); 
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
