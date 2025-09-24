using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Auth.Interface;
using backend.models.Auth;
using Microsoft.EntityFrameworkCore;

namespace Auth.service;

public class AuthService : IAuthService
{
    private readonly AuthDbContext _context;
    private readonly string _secretKey;

    public AuthService(AuthDbContext context, IConfiguration config)
    {
        _context = context;
        _secretKey = config["Jwt:Key"];
    }

    public string GenerateToken(AuthModel user)
    {
        // 👇 Traer roles con join desde usuario_rol
        var roles = _context.UsuarioRoles
            .Include(ur => ur.Rol)
            .Where(ur => ur.id_user == user.id_user)
            .Select(ur => ur.Rol.nombre)
            .ToList();

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_secretKey);

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.id_user.ToString()),
            new Claim(ClaimTypes.Name, user.username)
        };

        // 👇 Agregar los roles como claims
        foreach (var rol in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, rol));
        }

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(8),
            Issuer = "APIMINA",
            Audience = "APIMINAUsers",
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature
            )
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public bool VerifyPassword(AuthModel user, string hashedPassword, string providedPassword)
    {
        var passwordHasher = new PasswordHasher<AuthModel>();
        var result = passwordHasher.VerifyHashedPassword(user, hashedPassword, providedPassword);
        return result == PasswordVerificationResult.Success;
    }
}
