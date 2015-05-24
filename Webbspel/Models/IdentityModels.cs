﻿//Author: Ludwig Fingal
using Microsoft.AspNet.Identity.EntityFramework;

namespace Webbspel.Models
{
    public class ApplicationUser : IdentityUser
    {
    }

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext()
            : base("DefaultConnection")
        {
        }
    }
}