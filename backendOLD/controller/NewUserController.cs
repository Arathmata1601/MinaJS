using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.Models;
using newUsers.Service;

namespace backend.controller
{
    [ApiController]
    [Route("api/")]
    [Authorize]
    public class NewUserController : ControllerBase
    {
        private readonly NewUserService _userService;

        public NewUserController(NewUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("adduser")]
        public ActionResult AddUser([FromBody] UsuarioModel newUser)
        {
            var result = _userService.AddUser(newUser.username, newUser.password, newUser.rol);
            if (!result)
                return BadRequest("El usuario ya existe.");
            return Ok("Usuario creado correctamente.");
        }
    }
}