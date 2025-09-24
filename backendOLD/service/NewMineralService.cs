using System;
using System.Security.Cryptography;
using System.Text; // Asegúrate de que este namespace contiene la clase User
using backend.db;   // Asegúrate de tener un contexto de base de datos
using System.Linq;
using mineral.Models; //

namespace mineral.service
{
    public class NewMineralService
    {
        private readonly AppDbContext _context;

        public NewMineralService(AppDbContext context)
        {
            _context = context;
        }

        public bool AddMineral(string nombre_mineral, string procedencia_mineral, string description_mineral, string clave_mineral, string tipo, byte[] imagen_mineral, string estatus = "Almacen")
        {
            if (_context.Minerales.Any(m => m.nombre_mineral == nombre_mineral))
                return false; // Mineral ya existe

            var mineral = new MineralModel
            {
                nombre_mineral = nombre_mineral,
                procedencia_mineral = procedencia_mineral,
                descripcion_mineral = description_mineral,
                clave_mineral = clave_mineral,
                tipo = tipo,
                imagen_mineral = imagen_mineral,
                estatus = estatus
            };

            _context.Minerales.Add(mineral);
            _context.SaveChanges();
            return true;
        }
        
    }
}