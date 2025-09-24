using inventario.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.db; // Asegúrate de que este namespace contiene la clase AppDbContext
 // Asegúrate de que este namespace contiene la clase InventarioModel
namespace inventario.Service;
public class ObtenerInventario
{
    private readonly AppDbContext _context;

    public ObtenerInventario(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<InventarioModel>> ObtenerTodosAsync()
    {
        return await _context.Inventarios
            .Include(i => i.Mineral) // Incluye la relación con MineralModel
            .ToListAsync();
    }
}