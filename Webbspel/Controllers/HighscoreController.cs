using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Webbspel.Controllers
{
    public class HighscoreController : Controller
    {
        
        // GET: /Highscore/
        public ActionResult Index()
        {
            return View();
        }
	}
}