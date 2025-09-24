using backend.models.Auth;
namespace Auth.Interface;

public interface IAuthService
{
    string GenerateToken(AuthModel user);
    bool VerifyPassword(AuthModel user,string hashedPassword, string providedPassword);
}