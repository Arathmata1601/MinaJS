using mineral.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.db; // Asegúrate de que este namespace contiene la clase AppDbContext



namespace getmineral.service
{
    public class ObtenerMinerales
    {
        private readonly AppDbContext _context;

        public ObtenerMinerales(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<MineralModel>> ObtenerTodosAsync()
        {
            return await _context.Minerales.ToListAsync();
        }

        public async Task<MineralModel> ObtenerPorIdAsync(int id)
        {
            return await _context.Minerales.FindAsync(id);
        }
    }
}