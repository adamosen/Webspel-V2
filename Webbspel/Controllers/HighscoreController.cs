using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Webbspel.Controllers
{
    public class HighscoreController : Controller
    {
        
        // POST: /Highscore/
        public ActionResult Index();
   
        static void Main(){
   
        }
        int counter = 0;
        string line;

       // Skriver ut rad för rad från textfilen
       System.IO.StreamReader file = 
       new System.IO.StreamReader(@"c:\hscore.txt");
           while((line = file.ReadLine()) != null)
      {
        System.Console.WriteLine (line);
        counter++;
        }

        file.Close();
        System.Console.WriteLine("There were {0} lines.", counter);
        // Suspend the screen.
        System.Console.ReadLine();
        }

        static void Main(string [] args)
{
            int x = 0;
            while(x<100)
            {
                Console.WriteLine("Highscore:", x)
            }
            Console.Read();
}