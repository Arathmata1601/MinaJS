using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using vitrina.models;
using backend.db;

namespace vitrina.service
{
    public class ObtenerVitrinas
    {
        private readonly AppDbContext _context;

        public ObtenerVitrinas(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<VitrinaModel>> ObtenerPorSalaAsync(int id_sala)
        {
            return await _context.Vitrinas
                                 .Where(v => v.id_sala == id_sala)
                                 .ToListAsync();
        }

        public async Task<VitrinaModel> ObtenerPorIdAsync(int id)
        {
            return await _context.Vitrinas.FindAsync(id);
        }
    }
}
