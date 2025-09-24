using System.Collections.Generic;
using System.Threading.Tasks;

namespace vitrinas.controller
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Authorization;
    using backend.Models;
    using vitrina.models;
    using vitrina.service;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    [ApiController]
    [Route("api/vitrinas")]
    [Authorize]

    public class VitrinasController : ControllerBase
    {
        private readonly ObtenerVitrinas _service;

        public VitrinasController(ObtenerVitrinas service)
        {
            _service = service;
        }

        [HttpGet("por-sala/{idSala}")]
        public async Task<ActionResult<List<VitrinaModel>>> GetVitrinasPorSala(int idSala)
        {
            var vitrinas = await _service.ObtenerPorSalaAsync(idSala);
            return Ok(vitrinas);
        }
    }
}
