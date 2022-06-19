/* {
    "id": 2,
    "imeLica": "Dva",
    "prezimeLica": "Dva",
    "telefon": "0000000000",
    "email": "bogdannrt1519@gs.viser.edu.rs",
    "naziv": "Dva1519",
    "adresa": "Beograd",
    "pib": "299999999"
  },*/


// Language: typescript

// Path: app.ts
const express = require("express");
const fs = require("fs");
const app = express();
const axios = require("axios");
const path = require("path");
const { response } = require("express");
const port = 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

interface Preduzece {
    id: number;
    imeLica: string;
    prezimeLica: string;
    telefon: string;
    email: string;
    naziv: string;
    adresa: string;
    pib: string;
}

interface Faktura {
    id: number;
    pibStart: string;
    pibEnd: string;
    datumGen: Date;
    datumRok: Date;
    stavke: Array<Stavka>;
    cena: number;
    tip: string;
}

interface Stavka {
    naziv: string;
    cenaPoJedinici: number;
    jedinicaMere: string;
    kolicina: number;
}


interface preduzeceResponse {
    data: Array<Preduzece>;
}
interface preduzeceSingle {
    data: Preduzece;
}
interface fakturaResponse {
    data: Array<Faktura>;
}
interface fakturaSingle {
    data: Faktura;
}





class RadSaPrikazom {
    static procitajPogledZaNaziv(naziv: string) {
        return fs.readFileSync(
            path.join(__dirname + "/view/" + naziv + ".html"),
            "utf-8"
        );
    };
    static getArrayPreduzece(preduzeca: Array<Preduzece>) {
        let prikaz = "";
        preduzeca.forEach(p => {
            prikaz += `
                <tr>
                    <td>${p.pib}</td>
                    <td>${p.naziv}</td>
                    <td>${p.adresa}</td>
                    <td><a href="/details/${p.id}">Detaljnije</a></td>
                    <td><a href="/izmeniPreduzece/${p.id}">Izmeni</a></td>
                    <td><a href="/delete/${p.id}">Obrisi</a></td>
                   <!-- <td><a href="/getFakturaByPreduzece/${p.pib}">Fakture</a></td> -->
                    <td><a href="/getFakturaByPreduzecePage/${p.pib}/1">Fakture</a></td>
                </tr>
            `;
        })
        return prikaz
    }

    static getArrayFaktura(fakture: Array<Faktura>) {
        let prikaz = "";
        fakture.forEach(f => {
            prikaz += `
                <tr>
                    <td>${f.pibStart}</td>
                    <td>${f.pibEnd}</td>
                    <td>${f.tip}</td>
                    <td><a href="/detailsFaktura/${f.id}">Detaljnije</a></td>
                    <td><a href="/izmeniFakturu/${f.id}">Izmeni</a></td>
                    <td><a href="/deleteFaktura/${f.id}">Obrisi</a></td>
                </tr>
            `;
        })
        return prikaz
    }

    static getPageFaktura(fakture: Array<Faktura>,page:number) {
        let prikaz = "";
        let stavkePrikaz = "";
        fakture[page-1].stavke.forEach(s => {
            stavkePrikaz += `<p>Naziv: ${s.naziv} Cena po ${s.jedinicaMere}: ${s.cenaPoJedinici} Kolicina: ${s.kolicina}</p><hr>`
        })
        prikaz += `
                <tr>
                    <td>${fakture[page-1].pibStart}</td>
                    <td>${fakture[page-1].pibEnd}</td>
                    <td>${new Date(fakture[page-1].datumGen).toISOString().split('T')[0]}</td>
                    <td>${new Date(fakture[page-1].datumRok).toISOString().split('T')[0]}</td>
                    <td>${stavkePrikaz}</td>
                    <td>${fakture[page-1].cena}</td>
                    <td>${fakture[page-1].tip}</td>
                    <td><a href="/izmeniPreduzece/${fakture[page-1].id}">Izmeni</a></td>
                    <td><a href="/delete/${fakture[page-1].id}">Obrisi</a></td>
                </tr>
            `;
        return prikaz
    }

    static getDetails(p: Preduzece) {
        let prikaz = "";
        prikaz += `
                <tr>
                    <td>${p.pib}</td>
                    <td>${p.naziv}</td>
                    <td>${p.adresa}</td>
                    <td>${p.telefon}</td>
                    <td>${p.email}</td>
                    <td>${p.imeLica}</td>
                    <td>${p.prezimeLica}</td>
                    <td><a href="/izmeniPreduzece/${p.id}">Izmeni</a></td>
                    <td><a href="/delete/${p.id}">Obrisi</a></td>
                    <td><a href="/getFakturaByPreduzece/${p.pib}">Fakture</a></td>
                </tr>
            `;
        return prikaz
    }

    static getDetailsFaktura(f: Faktura) {
        let prikaz = "";
        let stavkePrikaz = "";
        f.stavke.forEach(s => {
            stavkePrikaz += `<p>Naziv: ${s.naziv} Cena po ${s.jedinicaMere}: ${s.cenaPoJedinici} Kolicina: ${s.kolicina}</p><hr>`
        })
        prikaz += `
                <tr>
                    <td>${f.pibStart}</td>
                    <td>${f.pibEnd}</td>
                    <td>${new Date(f.datumGen).toISOString().split('T')[0]}</td>
                    <td>${new Date(f.datumRok).toISOString().split('T')[0]}</td>
                    <td>${stavkePrikaz}</td>
                    <td>${f.cena}</td>
                    <td>${f.tip}</td>
                    <td><a href="/izmeniPreduzece/${f.id}">Izmeni</a></td>
                    <td><a href="/delete/${f.id}">Obrisi</a></td>
                </tr>
            `;
        return prikaz
    }
}

app.get("/", (req, res) => {
    res.send(RadSaPrikazom.procitajPogledZaNaziv("home"));
});

app.get("/svaPreduzeca", (req, res) => {
    axios.get("http://localhost:5134/api/Preduzece").then((response: preduzeceResponse) => {
        let td = `
        <td>PIB</td>
        <td>Naziv</td>
        <td>Adresa</td>
        `;
        res.send(RadSaPrikazom.procitajPogledZaNaziv("index").replace("#{data}", RadSaPrikazom.getArrayPreduzece(response.data)).replace("##td", td));
    })
        .catch((error) => {
            console.log(error);
        });
});

app.get("/details/:id", (req, res) => {
    axios.get(`http://localhost:5134/api/Preduzece/details/${req.params["id"]}`).then((response) => {
        let td = `
        <td>PIB</td>
        <td>Naziv</td>
        <td>Adresa</td>
        <td>Telefon</td>
        <td>Email</td>
        <td>Ime lica</td>
        <td>Prezime lica</td>
        `;
        res.send(RadSaPrikazom.procitajPogledZaNaziv("index").replace("#{data}", RadSaPrikazom.getDetails(response.data)).replace("##td", td));
    })
        .catch((error) => {
            console.log(error);
        });
});

app.get("/delete/:id", (req, res) => {
    axios.delete(`http://localhost:5134/api/Preduzece/deletePreduzece/${req.params["id"]}`).then((response) => { res.redirect("/svaPreduzeca") });
    //setTimeout(() => {  res.redirect("/svaPreduzeca"); }, 500);

});

app.get("/addPreduzece", (req, res) => {
    res.send(RadSaPrikazom.procitajPogledZaNaziv("addPreduzece"));
});

app.post("/addPreduzece", (req, res) => {
    axios.post("http://localhost:5134/api/Preduzece/dodajPreduzece", {
        imeLica: req.body.ime,
        prezimeLica: req.body.prezime,
        telefon: req.body.telefon,
        email: req.body.email,
        naziv: req.body.naziv,
        adresa: req.body.adresa,
        pib: req.body.pib
    }).then(res.redirect("/svaPreduzeca"));

});

app.get("/izmeniPreduzece/:id", (req, res) => {
    axios.get(`http://localhost:5134/api/Preduzece/izmeniPreduzece/${req.params["id"]}`)
        .then((response: preduzeceSingle) => {
            let id = response.data.id
            let ime = response.data.imeLica
            let prezime = response.data.prezimeLica
            let telefon = response.data.telefon
            let email = response.data.email
            let naziv = response.data.naziv
            let adresa = response.data.adresa
            let pib = response.data.pib
            let view = RadSaPrikazom.procitajPogledZaNaziv("updatePreduzece")
            view = view.replace("##{ID}", id)
            view = view.replace("##{ime}", ime)
            view = view.replace("##{prezime}", prezime)
            view = view.replace("##{telefon}", telefon)
            view = view.replace("##{email}", email)
            view = view.replace("##{naziv}", naziv)
            view = view.replace("##{adresa}", adresa)
            view = view.replace("##{pib}", pib)
            res.send(view)
        })
        .catch((error) => {
            console.log(error);
        });
});

app.post("/izmeniPreduzece", (req, res) => {
    axios.post("http://localhost:5134/api/Preduzece/izmeniPreduzece", {
        id: req.body.id,
        imeLica: req.body.ime,
        prezimeLica: req.body.prezime,
        telefon: req.body.telefon,
        email: req.body.email,
        naziv: req.body.naziv,
        adresa: req.body.adresa,
        pib: req.body.pib
    })
    res.redirect("/svaPreduzeca");
});

app.post("/filter", (req, res) => {
    axios.get(`http://localhost:5134/api/Preduzece/filter?kriterijum=${req.body.kriterijum}`).then((response: preduzeceResponse) => {
        let td = `
        <td>PIB</td>
        <td>Naziv</td>
        <td>Adresa</td>
        `;
        res.send(RadSaPrikazom.procitajPogledZaNaziv("index").replace("#{data}", RadSaPrikazom.getArrayPreduzece(response.data)).replace("##td", td));
    })
        .catch((error) => {
            console.log(error);
        });
});

app.get("/getFakturaByPreduzece/:id", (req, res) => {
    axios.get(`http://localhost:5134/api/Faktura/filter/${req.params.id}`).then((response: fakturaResponse) => {
        let td = `
        <td>PIB Start</td>
        <td>PIB End</td>
        <td>Tip</td>
        `;
        res.send(RadSaPrikazom.procitajPogledZaNaziv("index").replace("#{data}", RadSaPrikazom.getArrayFaktura(response.data)).replace("##td", td));
    })
        .catch((error) => {
            console.log(error);
        });
});

app.get("/getFakturaByPreduzecePage/:id/:page", (req, res) => {
    axios.get(`http://localhost:5134/api/Faktura/filter/${req.params.id}`).then((response: fakturaResponse) => {
        let td = `
        <td>PIB Start</td>
        <td>PIB End</td>
        <td>Tip</td>
        `;
        let count=response.data.length;
        let buttons=``;
        for(let i=0;i<count;i++){
            buttons+=`<a href="/getFakturaByPreduzecePage/${req.params.id}/${i+1}" class="btn btn-primary m-1">${i+1}</a>`;
        }
        res.send(RadSaPrikazom.procitajPogledZaNaziv("indexPage").replace("#{data}", RadSaPrikazom.getPageFaktura(response.data, req.params.page)).replace("##td", td).replace("##btn",buttons).replace("##{pib}",req.params.id));
    })
        .catch((error) => {
            console.log(error);
        });
});


//FAKTURE

app.get("/sveFakture", (req, res) => {
    axios.get("http://localhost:5134/api/Faktura").then((response: fakturaResponse) => {
        let td = `
        <td>PIB Start</td>
        <td>PIB End</td>
        <td>Tip</td>
        `;
        res.send(RadSaPrikazom.procitajPogledZaNaziv("indexPage").replace("#{data}", RadSaPrikazom.getArrayFaktura(response.data)).replace("##td", td).replace("##btn",``));
    })
        .catch((error) => {
            console.log(error);
        });
});

app.get("/detailsFaktura/:id", (req, res) => {
    axios.get(`http://localhost:5134/api/Faktura/details/${req.params["id"]}`).then((response: fakturaSingle) => {
        let td = `
        <td>PIB Start</td>
        <td>PIB End</td>
        <td>Datum generisanja</td>
        <td>Datum roka</td>
        <td>Stavke</td>
        <td>Cena</td>
        <td>Tip</td>
        `;
        res.send(RadSaPrikazom.procitajPogledZaNaziv("indexPage").replace("#{data}", RadSaPrikazom.getDetailsFaktura(response.data)).replace("##td", td).replace("##btn",``));
    })
        .catch((error) => {
            console.log(error);
        });
});

//filterIznosStavka/{pib}/{kriterijum}/{value}

app.post("/filterFaktura", (req, res) => {
    axios.get(`http://localhost:5134/api/Faktura/filterIznosStavka/${req.body.pib}/${req.body.kriterijum}/${req.body.vrednost}`).then((response: fakturaResponse) => {
        let td = `
        <td>PIB Start</td>
        <td>PIB End</td>
        <td>Tip</td>
        `;
        res.send(RadSaPrikazom.procitajPogledZaNaziv("indexPage").replace("#{data}", RadSaPrikazom.getArrayFaktura(response.data)).replace("##td", td));
    })
        .catch((error) => {
            console.log(error);
        });
});

app.listen(port, () => {
    console.log(`klijent na portu ${port}`);
});