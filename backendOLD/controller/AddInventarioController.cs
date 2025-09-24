using NewInventario.service;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using inventario.Models;
using Microsoft.AspNetCore.Authorization;
using backend.db;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace newInventario.controller
{
    [ApiController]
    [Route("api/addinventario")]
    [Authorize]
    public class AddInventario : ControllerBase
    {
        private readonly NewInventarioService _inventarioService;
        private readonly AppDbContext _context;
        public AddInventario(NewInventarioService inventarioService, AppDbContext context)
        {
            _inventarioService = inventarioService;
            _context = context;
        }
        [HttpPost]
        public async Task<ActionResult<InventarioModel>> AddInventarioAsync(InventarioModel inventario)
        {
            if (inventario == null)
            {
                return BadRequest("El inventario no puede ser nulo.");
            }

            // Verificar si el mineral existe
            var mineral = await _context.Minerales.FindAsync(inventario.id_mineral);
            if (mineral == null)
            {
                return NotFound("Mineral no encontrado.");
            }

            // Asignar el mineral al inventario
            inventario.Mineral = mineral;

            // Agregar el inventario a la base de datos
            _context.Inventarios.Add(inventario);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetInventarioById), new { id = inventario.id_invent }, inventario);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<InventarioModel>> GetInventarioById(int id)
        {
            var inventario = await _context.Inventarios
                .Include(i => i.Mineral) // Si quieres incluir los datos del mineral relacionado
                .FirstOrDefaultAsync(i => i.id_invent == id);

            if (inventario == null)
            {
                return NotFound("Inventario no encontrado.");
            }

            return Ok(inventario);
        }


    }
}
