using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using mineral.Models;
using mineral.service;
using System;

namespace mineral.controller
{
    [ApiController]
    [Route("api/")]
    [Authorize]
    public class NewMineralController : ControllerBase
    {
        private readonly NewMineralService _userService;

        public NewMineralController(NewMineralService userService)
        {
            _userService = userService;
        }

        [HttpPost("addmineral")]
        public ActionResult AddMineral([FromBody] MineralModel newMineral)
        {
            if (string.IsNullOrWhiteSpace(newMineral.nombre_mineral) ||
                string.IsNullOrWhiteSpace(newMineral.procedencia_mineral) ||
                string.IsNullOrWhiteSpace(newMineral.descripcion_mineral) ||
                string.IsNullOrWhiteSpace(newMineral.clave_mineral) ||
                string.IsNullOrWhiteSpace(newMineral.tipo))
            {
                return BadRequest("Todos los campos obligatorios deben estar completos.");
            }

            // Si viene imagen base64, intenta convertirla
            if (!string.IsNullOrWhiteSpace(newMineral.imagen_mineral_base64))
            {
                if (!newMineral.imagen_mineral_base64.StartsWith("data:image/"))
                    return BadRequest("El formato de imagen base64 no es válido.");
                try
            {
                newMineral.ProcesarImagen();
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error al procesar imagen base64: " + ex.Message);
                return BadRequest("La imagen base64 está mal codificada.");
            }

            }

            var result = _userService.AddMineral(
                newMineral.nombre_mineral,
                newMineral.procedencia_mineral,
                newMineral.descripcion_mineral,
                newMineral.clave_mineral,
                newMineral.tipo,
                newMineral.imagen_mineral); // ← guarda byte[] en la base

            if (!result)
                return BadRequest("El mineral ya existe.");

            return Ok("Mineral creado correctamente.");
        }
    }
}
