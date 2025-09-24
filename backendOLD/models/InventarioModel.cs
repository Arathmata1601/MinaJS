using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using mineral.Models;

namespace inventario.Models;


[Table("inventario_minerales")]
public class InventarioModel
{
    [Key]
    public int id_invent { get; set; }

    [Required]
    public int id_mineral { get; set; }

    [Required]
    public string ubicacion { get; set; }

    [Required]
    public string sala { get; set; }
    [Required]

    public string vitrina { get; set; }
    
    [Required]
    public string estatus { get; set; }

    // Relación con la entidad MineralModel
    [ForeignKey("id_mineral")]
    public virtual MineralModel? Mineral { get; set; }
}