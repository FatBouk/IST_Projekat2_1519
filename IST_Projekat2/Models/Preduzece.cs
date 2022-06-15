namespace IST_Projekat2.Models
{
    public class Preduzece
    {
        public int Id { get; set; }
        public string ImeLica { get; set; }
        public string PrezimeLica { get; set; }
        public string Telefon { get; set; }
        public string Email { get; set; }
        public string Naziv { get; set; }
        public string Adresa { get; set; }
        public string Pib { get; set; }

        public Preduzece(int id, string imeLica, string prezimeLica, string telefon, string email, string naziv, string adresa, string pib)
        {
            Id = id;
            ImeLica = imeLica;
            PrezimeLica = prezimeLica;
            Telefon = telefon;
            Email = email;
            Naziv = naziv;
            Adresa = adresa;
            Pib = pib;
        }

        public Preduzece()
        {
        }
    }
}
