using inventario.Models;
using Microsoft.EntityFrameworkCore;
using backend.db;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace NewInventario.service
{
    public class NewInventarioService
    {
        private readonly AppDbContext _context;

        public NewInventarioService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<InventarioModel>> ObtenerTodosAsync()
        {
            return await _context.Inventarios.Include(i => i.Mineral).ToListAsync();
        }

        public async Task<InventarioModel> ObtenerPorIdAsync(int id)
        {
            return await _context.Inventarios.Include(i => i.Mineral)
                                             .FirstOrDefaultAsync(i => i.id_invent == id);
        }
    }
}