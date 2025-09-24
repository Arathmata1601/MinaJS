using backend.db;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using mineral.Models;

namespace deleteMineral.service
{
    public class DeleteMineralService
    {
        private readonly AppDbContext _context;

        public DeleteMineralService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> DeleteMineralAsync(int id_mineral)
        {
            var mineral = await _context.Minerales.FindAsync(id_mineral);
            if (mineral == null)
            {
                return false; // Mineral not found
            }

            _context.Minerales.Remove(mineral);
            await _context.SaveChangesAsync();
            return true; // Mineral deleted successfully
        }
    }
}