using Microsoft.EntityFrameworkCore;
 // Ajusta el namespace según tu estructura
using backend.Models; // Asegúrate de que este namespace contiene la clase Usuario
//using Users.Models;
using System.Linq;
using mineral.Models;
using inventario.Models;
using vitrina.models;
using NewInventario.service;

namespace backend.db
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Define your entities here, for example:
        // public DbSet<YourEntity> YourEntities { get; set; }

        public DbSet<UsuarioModel> Usuarios { get; set; }
        public DbSet<UsuarioModel> Users { get; set; }
        public DbSet<MineralModel> Minerales { get; set; }
        public DbSet<InventarioModel> Inventarios { get; set; }

        public DbSet<VitrinaModel> Vitrinas { get; set; }
    }
}
