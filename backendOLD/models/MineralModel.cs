using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ZstdSharp.Unsafe;
using System;

namespace mineral.Models;


[Table("minerales")]
public class MineralModel
{
    [Key]
    public int id_mineral { get; set; }
    public string nombre_mineral { get; set; }
    public string procedencia_mineral { get; set; }
    public string descripcion_mineral { get; set; }
    public string clave_mineral { get; set; }
    public string tipo { get; set; }

    [NotMapped]
    public string? imagen_mineral_base64 { get; set; } // recibido como base64 desde el frontend

    public byte[]? imagen_mineral { get; set; } // este es el campo mapeado a la DB

    public string estatus { get; set; } = "Almacen"; // por defecto, el estatus es Activo

    public void ProcesarImagen()
    {
        if (!string.IsNullOrWhiteSpace(imagen_mineral_base64) && imagen_mineral_base64.StartsWith("data:image/"))
        {
            imagen_mineral = Convert.FromBase64String(imagen_mineral_base64.Split(',')[1]);
        }
    }
}
