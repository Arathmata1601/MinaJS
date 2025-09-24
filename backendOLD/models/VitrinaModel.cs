using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace vitrina.models;

[Table("salas")]
public class VitrinaModel
{
    [Key]
    public int id_sala { get; set; }
    public int num_vitrinas { get; set; }

}