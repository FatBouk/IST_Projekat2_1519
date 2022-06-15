namespace IST_Projekat2.Models
{
    public class Faktura
    {

        public int Id { get; set; }
        public string pibStart { get; set; }
        public string pibEnd { get; set; }
        public DateTime datumGen { get; set; }
        public DateTime datumRok { get; set; }
        public List<Stavka> stavke { get; set;}
        public double cena { get; set; }
        public string tip { get; set; }

        public Faktura(int id, string pibStart, string pibEnd, DateTime datumGen, DateTime datumRok, List<Stavka> stavke, string tip)
        {
            Id = id;
            this.pibStart = pibStart;
            this.pibEnd = pibEnd;
            this.datumGen = datumGen;
            this.datumRok = datumRok;
            this.stavke = stavke;
            this.tip = tip;

            double sumCena = 0;

            foreach(Stavka s in stavke)
            {
                sumCena += s.kolicina * s.cenaPoJedinici;
            }
            this.cena = sumCena;
        }

        public Faktura()
        {
        }

        public void calcCena()
        {
            double sumCena = 0;

            foreach (Stavka s in stavke)
            {
                sumCena += s.kolicina * s.cenaPoJedinici;
            }
            this.cena = sumCena;
        }

        public override string ToString()
        {
            String strSt = "";
            foreach(Stavka s in stavke)
            {
                strSt+=s.ToString() + Environment.NewLine;
            }

            return this.Id + " " + this.pibStart +" " + this.datumRok + "" + strSt ;
        }
    }
}
