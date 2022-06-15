using IST_Projekat2.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace IST_Projekat2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PreduzeceController : ControllerBase
    {

        static List<Preduzece> lst = new List<Preduzece>() {
            new Preduzece(1, "Bogdan", "Djordjevic", "0000000000", "bogdannrt1519@gs.viser.edu.rs", "NRT1519","Beograd", "999999999"),
            new Preduzece(2, "Dva", "Dva", "0000000000", "bogdannrt1519@gs.viser.edu.rs", "Dva1519","Beograd", "299999999")
        };

        [HttpGet]
        public IActionResult SvaPreduzeca()
        {
            var data = lst.OrderBy(p => p.Pib).ThenBy(p => p.Naziv);
            return Ok(data);
        }

        [HttpGet("SvaPreduzecaPage")]
        public IActionResult SvaPreduzecaPage([FromQuery]int page, [FromQuery]int pageSize)
        {
            var data = lst.OrderBy(p => p.Pib).ThenBy(p => p.Naziv).Skip((page-1)*pageSize).Take(pageSize);
            return Ok(data);
        }

        [HttpPost("dodajPreduzece")]
        public IActionResult DodajNovoPreduzece([FromForm] string ime, [FromForm] string prezime, [FromForm] string telefon, [FromForm] string email, [FromForm] string naziv, [FromForm] string adresa, [FromForm] string pib)
        {
            Preduzece p = new Preduzece();
            p.Id = lst.OrderByDescending(p => p.Id).First().Id + 1;
            p.ImeLica = ime;
            p.PrezimeLica = prezime;
            p.Telefon = telefon;
            p.Email = email;
            p.Naziv = naziv;
            p.Adresa = adresa;
            p.Pib = pib;
            lst.Add(p);
            return Ok(SvaPreduzeca());
        }

        [HttpGet("izmeniPreduzece/{id}")]
        public IActionResult IzmeniGet(int id)
        {
            return Ok(GetById(id));
        }

        [HttpGet("details/{id}")]
        public IActionResult GetById(int id)
        {
            var preduzece = lst.Where(p => p.Id == id).Select(p => p);
            return Ok(preduzece);
        }

        [HttpPost("izmeniPreduzece")]
        public IActionResult IzmeniPost([FromForm] int id,[FromForm] string ime, [FromForm] string prezime, [FromForm] string telefon, [FromForm] string email, [FromForm] string naziv, [FromForm] string adresa, [FromForm] string pib)
        {
            Preduzece p = lst.Find(p => p.Id == id);
            if (p == null)
            {
                return BadRequest("Nekako ne postoji preduzece sa tim identifikatorom.");
            }
            p.ImeLica = ime;
            p.PrezimeLica = prezime;
            p.Telefon = telefon;
            p.Email = email;
            p.Naziv= naziv;
            p.Adresa= adresa;
            p.Pib = pib;
            return Ok(SvaPreduzeca());
        }

        [HttpDelete("deletePreduzece/{id}")]
        public IActionResult DeletePreduzece(int id)
        {
            lst.RemoveAll(p => p.Id == id);
            return Ok(SvaPreduzeca());
        }

        [HttpGet("filter/{kriterijum}")]
        public IActionResult FiltrirajPoNazivTip(string kriterijum)
        {
            var data = lst.Where(p => p.Naziv.Contains(kriterijum) || p.Pib.Contains(kriterijum))
                .OrderBy(k => k.Pib)
                .ThenBy(k => k.Naziv)
                .Select(k => k);
            return Ok(data);
        }
    }
}
