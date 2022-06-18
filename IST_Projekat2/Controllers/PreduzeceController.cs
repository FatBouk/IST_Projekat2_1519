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

        [HttpGet("SvaPreduzecaPage/{page}/{pageSize}")]
        public IActionResult SvaPreduzecaPage(int page, int pageSize)
        {
            var data = lst.OrderBy(p => p.Pib).ThenBy(p => p.Naziv).Skip((page-1)*pageSize).Take(pageSize);
            return Ok(data);
        }

        [HttpPost("dodajPreduzece")]
        public IActionResult DodajNovoPreduzece([FromBody] Preduzece p)
        {
            int id = lst.OrderByDescending(p => p.Id).First().Id + 1;
            p.Id = id;
            lst.Add(p);
            return Ok(SvaPreduzeca());
        }

        [HttpGet("izmeniPreduzece/{id}")]
        public IActionResult IzmeniGet(int id)
        {
            var preduzece = lst.Where(p => p.Id == id).Select(p => p);
            return Ok(preduzece.FirstOrDefault());
        }

        [HttpGet("details/{id}")]
        public IActionResult GetById(int id)
        {
            var preduzece = lst.Where(p => p.Id == id).Select(p => p);
            return Ok(preduzece.FirstOrDefault());
        }

        [HttpPost("izmeniPreduzece")]
        public IActionResult IzmeniPost([FromBody]Preduzece pNew)
        {
            Preduzece p = lst.Find(p => p.Id == pNew.Id);
            if (p == null)
            {
                return BadRequest("Nekako ne postoji preduzece sa tim identifikatorom.");
            }
            p.ImeLica = pNew.ImeLica;
            p.PrezimeLica = pNew.PrezimeLica;
            p.Telefon = pNew.Telefon;
            p.Email = pNew.Email;
            p.Naziv= pNew.Naziv;
            p.Adresa= pNew.Adresa;
            p.Pib =pNew.Pib;
            return Ok();
        }

        [HttpDelete("deletePreduzece/{id}")]
        public IActionResult DeletePreduzece(int id)
        {
            lst.RemoveAll(p => p.Id == id);
            return Ok();
        }

        [HttpGet("filter")]
        public IActionResult FiltrirajPoNazivTip(string kriterijum)
        {
            var data = lst.Where(p => p.Naziv.ToLower().Contains(kriterijum.ToLower()) || p.Pib.Contains(kriterijum))
                .OrderBy(k => k.Pib)
                .ThenBy(k => k.Naziv)
                .Select(k => k);
            if (kriterijum == "") return Ok(lst);
            return Ok(data);
        }
    }
}
