using Microsoft.AspNetCore.Mvc;
using deleteMineral.service;
using System.Threading.Tasks;
using mineral.Models;
using Microsoft.AspNetCore.Authorization; // Uncomment this line if you want to enforce authorization
//using deleteMineral.service;

[ApiController]
[Route("api/minerals")]
[Authorize] // Uncomment this line if you want to enforce authorization
public class DeleteMineralController : ControllerBase
{
    private readonly DeleteMineralService _deleteMineralService;

    public DeleteMineralController(DeleteMineralService deleteMineralService)
    {
        _deleteMineralService = deleteMineralService;
    }

    [HttpDelete("delete/{id_mineral}")]
    public async Task<IActionResult> DeleteMineral(int id_mineral)
    {
        var result = await _deleteMineralService.DeleteMineralAsync(id_mineral);
        if (!result)
        {
            return NotFound("Mineral no encontrado.");
        }
        return NoContent(); // 204 No Content
    }
}
