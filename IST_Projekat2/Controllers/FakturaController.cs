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

       /* [HttpPost("dodajFakturu")]
        public IActionResult dodajFakturu([FromForm]string pibStart, [FromForm]string pibEnd,[FromForm]DateTime datumStart, [FromForm]DateTime datumEnd,[FromForm]List<Stavka> stavkeLis, [FromForm]string tip)
        {
            Console.WriteLine("dodat: " + stavkeLis.Count() + "stavkeLis");
            int id = lst.OrderByDescending(p => p.Id).First().Id + 1;
            Faktura f = new Faktura(id, pibStart,pibEnd, datumStart,datumEnd,stavkeLis,tip);
            lst.Add(f);
            return Ok(SveFakture());
        }*/

        [HttpPost("dodajFakturu")]
        public IActionResult dodajFakturu2([FromBody]Faktura fak)
        {
            int id = lst.OrderByDescending(p => p.Id).First().Id + 1;
            fak.Id = id;
            fak.calcCena();
            lst.Add(fak);
            return Ok(SveFakture());
        }

        [HttpGet("izmeniFakturu/{id}")]
        public IActionResult IzmeniGet(int id)
        {
            return Ok(GetById(id));
        }

        [HttpGet("details/{id}")]
        public IActionResult GetById(int id)
        {
            var faktura = lst.Where(p => p.Id == id).Select(p => p);
            return Ok(faktura);
        }

        [HttpPost("izmeniFakturu")]
        public IActionResult IzmeniPost([FromBody]Faktura fak)
        {
            Faktura f = lst.Find(f => f.Id == fak.Id);
            if (f == null)
            {
                return BadRequest("Nekako ne postoji preduzece sa tim identifikatorom.");
            }
            f.pibStart = fak.pibStart;
            f.pibEnd= fak.pibEnd;
            f.datumGen = fak.datumGen;
            f.datumRok = fak.datumRok;
            f.stavke = fak.stavke;
            f.calcCena();
            f.tip = fak.tip;
            return Ok(SveFakture());
        }

        [HttpDelete("deleteFaktura/{id}")]
        public IActionResult DeletePreduzece(int id)
        {
            lst.RemoveAll(f => f.Id == id);
            return Ok(SveFakture());
        }


        [HttpGet("filter/{kriterijum}")]
        public IActionResult FiltrirajPreduzece(string kriterijum)
        {
            var data = lst.Where(f => f.pibStart.Contains(kriterijum) || f.pibEnd.Contains(kriterijum))
                .Select(k => k);
            return Ok(data);
        }

        [HttpPost("balans")]
        public IActionResult BalansPreduzeca([FromQuery]string pibStart, [FromQuery]DateTime dateStart, [FromQuery] DateTime dateEnd)
        {
            double balans = 0;
            var data = lst.Where(f => f.pibStart == pibStart && f.datumGen>dateStart && f.datumRok<dateEnd);
            Console.WriteLine(data.Count());
            foreach(Faktura f in data)
            {
                if (f.tip.ToLower() == "ulazna".ToLower())
                {
                    balans += f.cena;
                }
                else
                {
                    balans-= f.cena;
                }
            }
            return Ok(balans);
        }
    }
}

