namespace IST_Projekat2.Models
{
    public class Stavka
    {
        public string naziv { get; set; }
        public double cenaPoJedinici { get; set; }
        public string jedinicaMere { get; set; }
        public int kolicina { get; set; }

        public Stavka(string naziv, double cenaPoJedinici, string jedinicaMere, int kolicina)
        {
            this.naziv = naziv;
            this.cenaPoJedinici = cenaPoJedinici;
            this.jedinicaMere = jedinicaMere;
            this.kolicina = kolicina;
        }

        public Stavka()
        {
        }

        public override string ToString()
        {
            return this.naziv;
        }
    }
}

