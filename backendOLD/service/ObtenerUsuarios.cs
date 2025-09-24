using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
// Ajusta el namespace según tu estructura
using backend.db;
using backend.Models; 
// Asegúrate de que este namespace contiene la clase AppDbContext
namespace backend.Service
{
    public class ObtenerUsuarios
    {
        private readonly AppDbContext _context;

        public ObtenerUsuarios(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<UsuarioModel>> ObtenerTodosAsync()
        {
            return await _context.Usuarios.ToListAsync();
        }
    }
}