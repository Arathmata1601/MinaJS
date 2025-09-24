using inventario.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.db; // Asegúrate de que este namespace contiene la clase AppDbContext
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization; // <-- Agrega este using
using inventario.Service;
namespace inventario.controller
{
    [ApiController]
    [Route("api/inventario")]
    [Authorize]
    public class GetInventarioController : ControllerBase
    {
        private readonly ObtenerInventario _inventarioService;

        public GetInventarioController(ObtenerInventario inventarioService)
        {
            _inventarioService = inventarioService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<InventarioModel>>> GetInventarios()
        {
            var inventarios = await _inventarioService.ObtenerTodosAsync();
            if (inventarios == null || inventarios.Count == 0)
            {
                return NotFound("No se encontraron inventarios.");
            }
            return Ok(inventarios);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<InventarioModel>> GetInventarioById(int id)
        {
            var inventarios = await _inventarioService.ObtenerTodosAsync();
            var inventario = inventarios.Find(i => i.id_invent == id);
            if (inventario == null)
            {
                return NotFound("Inventario no encontrado.");
            }
            return Ok(inventario);
        }
        [HttpGet("sala/{sala}")]
        public async Task<ActionResult<IEnumerable<InventarioModel>>> GetInventariosBySala(string sala)
        {
            var inventarios = await _inventarioService.ObtenerTodosAsync();
            var inventariosFiltrados = inventarios.FindAll(i => i.sala == sala);
            if (inventariosFiltrados == null || inventariosFiltrados.Count == 0)
            {
                return NotFound($"No se encontraron inventarios en la sala {sala}.");
            }
            return Ok(inventariosFiltrados);
        }
        [HttpGet("vitrina/{vitrina}")]
        public async Task<ActionResult<IEnumerable<InventarioModel>>> GetInventariosByVitrina(string vitrina)
        {
            var inventarios = await _inventarioService.ObtenerTodosAsync();
            var inventariosFiltrados = inventarios.FindAll(i => i.vitrina == vitrina);
            if (inventariosFiltrados == null || inventariosFiltrados.Count == 0)
            {
                return NotFound($"No se encontraron inventarios en la vitrina {vitrina}.");
            }
            return Ok(inventariosFiltrados);
        }
        [HttpGet("sala/{sala}/vitrina/{vitrina}")]
        public async Task<ActionResult<IEnumerable<InventarioModel>>> GetInventariosBySalaYVitrina(string sala, string vitrina)
        {
            var inventarios = await _inventarioService.ObtenerTodosAsync();
            var inventariosFiltrados = inventarios
                .FindAll(i => i.sala == sala && i.vitrina == vitrina);

            if (inventariosFiltrados == null || inventariosFiltrados.Count == 0)
            {
                return NotFound($"No se encontraron inventarios en la sala {sala} y vitrina {vitrina}.");
            }
            return Ok(inventariosFiltrados);
        }
    }
}