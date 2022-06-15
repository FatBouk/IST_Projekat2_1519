using IST_Projekat2.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace IST_Projekat2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FakturaController : ControllerBase
    {
        static List<Faktura> lst = new List<Faktura>()
        {
            new Faktura(1, "299999999","999999999",DateTime.Now, DateTime.Now.AddDays(20), new List<Stavka>{new Stavka("Stavka 1", 20, "g",20), new Stavka("Stavka 2", 30, "g",30)},"Izlazna"),
            new Faktura(2, "999999999","299999999",DateTime.Now, DateTime.Now.AddDays(30), new List<Stavka>{new Stavka("Stavka New 1", 30, "g",30), new Stavka("Stavka New 2", 11, "g",11)},"Ulazna")
        };
        [HttpGet]
        public IActionResult SveFakture()
        {
            var data = lst.OrderBy(p => p.Id);
            return Ok(data);
        }

        [HttpGet("test")]
        public IActionResult Test()
        {
            var data = lst.Where(l=>l.Id==1).Select(l => l.stavke);
            return Ok(data);
        }

        [HttpPost("dodajFakturu")]
        public IActionResult dodajFakturu([FromForm]string pibStart, [FromForm]string pibEnd,[FromForm]DateTime datumStart, [FromForm]DateTime datumEnd,[FromForm]List<Stavka> stavkeLis, [FromForm]string tip)
        {
            Console.WriteLine("dodat: " + stavkeLis.Count() + "stavkeLis");
            int id = lst.OrderByDescending(p => p.Id).First().Id + 1;
            Faktura f = new Faktura(id, pibStart,pibEnd, datumStart,datumEnd,stavkeLis,tip);
            lst.Add(f);
            return Ok(SveFakture());
        }

        [HttpPost("dodajFakturu2")]
        public IActionResult dodajFakturu2([FromBody]Faktura fak)
        {
            int id = lst.OrderByDescending(p => p.Id).First().Id + 1;
            fak.Id = id;
            lst.Add(fak);
            foreach (Faktura f in lst)
            {
                Console.WriteLine(f);
            }
            return Ok(SveFakture());
        }
    }
}

