using System;
using System.Security.Cryptography;
using System.Text; // Asegúrate de que este namespace contiene la clase User
using backend.db;   // Asegúrate de tener un contexto de base de datos
using System.Linq;
using backend.Models;

namespace newUsers.Service
{
    public class NewUserService
    {
        private readonly AppDbContext _context;

        public NewUserService(AppDbContext context)
        {
            _context = context;
        }

        public bool AddUser(string username, string password, string rol)
        {
            if (_context.Users.Any(u => u.username == username))
                return false; // Usuario ya existe

            var hashedPassword = HashPassword(password);

            var user = new UsuarioModel
            {
                username = username,
                password = hashedPassword,
                rol = rol
            };

            _context.Users.Add(user);
            _context.SaveChanges();
            return true;
        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var bytes = Encoding.UTF8.GetBytes(password);
                var hash = sha256.ComputeHash(bytes);
                return Convert.ToBase64String(hash);
            }
        }
    }
}