using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

[Table("usuarios")]
public class UsuarioModel
{
    [Key]//
    [Column("id_user")]
    public int IdUser { get; set; }
    public string username { get; set; }
    public string password { get; set; }
    public string ?rol { get; set; }



}
