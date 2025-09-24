using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization; // <-- Agrega este using
using backend.Models;
using backend.Service;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.controller
{
    [ApiController]
    [Route("api/users")]
    [Authorize]
    public class GetUserController : ControllerBase
    {
        private readonly ObtenerUsuarios _userService;

        public GetUserController(ObtenerUsuarios userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UsuarioModel>>> GetUsers()
        {
            var users = await _userService.ObtenerTodosAsync();
            if (users == null || users.Count == 0)
            {
                return NotFound("No se encontraron usuarios.");
            }
            return Ok(users);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<UsuarioModel>> GetUserById(int id)
        {
            var users = await _userService.ObtenerTodosAsync();
            var user = users.Find(u => u.IdUser == id);
            if (user == null)
            {
                return NotFound("Usuario no encontrado.");
            }
            return Ok(user);
        }


    }
    
}