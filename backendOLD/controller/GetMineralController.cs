using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization; // <-- Agrega este using  
using mineral.Models;
using getmineral.service;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using backend.db;
using deleteMineral.service;

namespace mineral.controller
{
    [ApiController]
    [Route("api/minerals")]
    //[Authorize]
    public class GetMineralController : ControllerBase
    {
        private readonly ObtenerMinerales _mineralService;

        public GetMineralController(ObtenerMinerales mineralService)
        {
            _mineralService = mineralService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MineralModel>>> GetMinerals()
        {
            var minerals = await _mineralService.ObtenerTodosAsync();
            if (minerals == null || !minerals.Any())
            {
                return NotFound("No se encontraron minerales.");
            }
            return Ok(minerals);
        }

        [HttpGet("by-id/{id}")]
        public async Task<ActionResult<MineralModel>> GetMineralById(int id)
        {
            var minerals = await _mineralService.ObtenerTodosAsync();
            var mineral = minerals.Find(m => m.id_mineral == id);
            if (mineral == null)
            {
                return NotFound("Mineral no encontrado.");
            }
            return Ok(mineral);
        }
        [HttpGet("by-type/{tipo}")]
        public async Task<ActionResult<IEnumerable<MineralModel>>> GetMineralsByType(string tipo)
        {
            var minerals = await _mineralService.ObtenerTodosAsync();
            var filteredMinerals = minerals.Where(m => m.tipo.Equals(tipo, System.StringComparison.OrdinalIgnoreCase)).ToList();

            if (!filteredMinerals.Any())
            {
                return NotFound("No se encontraron minerales del tipo especificado.");
            }

            return Ok(filteredMinerals);
        }
        [HttpGet("by-name/{nombre}")]
        public async Task<ActionResult<IEnumerable<MineralModel>>> GetMineralsByName(string nombre)
        {
            var minerals = await _mineralService.ObtenerTodosAsync();
            var filteredMinerals = minerals.Where(m => m.nombre_mineral.Contains(nombre, System.StringComparison.OrdinalIgnoreCase)).ToList();

            if (!filteredMinerals.Any())
            {
                return NotFound("No se encontraron minerales con el nombre especificado.");
            }

            return Ok(filteredMinerals);
        }
        [HttpGet("by-clave/{clave_mineral}")]
        public async Task<ActionResult<IEnumerable<MineralModel>>> GetMineralsByOrigin(string clave_mineral)
        {
            var minerals = await _mineralService.ObtenerTodosAsync();
            var filteredMinerals = minerals.Where(m => m.clave_mineral.Equals(clave_mineral, System.StringComparison.OrdinalIgnoreCase)).ToList();

            if (!filteredMinerals.Any())
            {
                return NotFound("No se encontraron minerales con la clave especificada.");
            }

            return Ok(filteredMinerals);
        }
        [HttpGet("by-estatus/{estatus}")]
        public async Task<ActionResult<IEnumerable<MineralModel>>> GetMineralsByStatus(string estatus)
        {
            var minerals = await _mineralService.ObtenerTodosAsync();
            var filteredMinerals = minerals.Where(m => m.estatus.Equals(estatus, System.StringComparison.OrdinalIgnoreCase)).ToList();

            if (!filteredMinerals.Any())
            {
                return NotFound("No se encontraron minerales con el estatus especificado.");
            }

            return Ok(filteredMinerals);
        }
    }
}