"use strict";
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
exports.__esModule = true;
// Language: typescript
// Path: app.ts
var express = require("express");
var fs = require("fs");
var app = express();
var axios = require("axios");
var path = require("path");
var response = require("express").response;
var port = 5000;
var alert = require("alert");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
var RadSaPrikazom = /** @class */ (function () {
    function RadSaPrikazom() {
    }
    RadSaPrikazom.procitajPogledZaNaziv = function (naziv) {
        return fs.readFileSync(path.join(__dirname + "/view/" + naziv + ".html"), "utf-8");
    };
    ;
    RadSaPrikazom.getArrayPreduzece = function (preduzeca) {
        var prikaz = "";
        preduzeca.forEach(function (p) {
            prikaz += "\n                <tr>\n                    <td>".concat(p.pib, "</td>\n                    <td>").concat(p.naziv, "</td>\n                    <td>").concat(p.adresa, "</td>\n                    <td><a href=\"/details/").concat(p.id, "\">Detaljnije</a></td>\n                    <td><a href=\"/izmeniPreduzece/").concat(p.id, "\">Izmeni</a></td>\n                    <td><a href=\"/delete/").concat(p.id, "\">Obrisi</a></td>\n                   <!-- <td><a href=\"/getFakturaByPreduzece/").concat(p.pib, "\">Fakture</a></td> -->\n                    <td><a href=\"/getFakturaByPreduzecePage/").concat(p.pib, "/1\">Fakture</a></td>\n                </tr>\n            ");
        });
        return prikaz;
    };
    RadSaPrikazom.getArrayFaktura = function (fakture) {
        var prikaz = "";
        fakture.forEach(function (f) {
            prikaz += "\n                <tr>\n                    <td>".concat(f.pibStart, "</td>\n                    <td>").concat(f.pibEnd, "</td>\n                    <td>").concat(f.tip, "</td>\n                    <td><a href=\"/detailsFaktura/").concat(f.id, "\">Detaljnije</a></td>\n                    <td><a href=\"/izmeniFakturu/").concat(f.id, "\">Izmeni</a></td>\n                    <td><a href=\"/deleteFaktura/").concat(f.id, "\">Obrisi</a></td>\n                </tr>\n            ");
        });
        return prikaz;
    };
    RadSaPrikazom.getPageFaktura = function (fakture, page) {
        var prikaz = "";
        var stavkePrikaz = "";
        fakture[page - 1].stavke.forEach(function (s) {
            stavkePrikaz += "<p>Naziv: ".concat(s.naziv, " Cena po ").concat(s.jedinicaMere, ": ").concat(s.cenaPoJedinici, " Kolicina: ").concat(s.kolicina, "</p><hr>");
        });
        prikaz += "\n                <tr>\n                    <td>".concat(fakture[page - 1].pibStart, "</td>\n                    <td>").concat(fakture[page - 1].pibEnd, "</td>\n                    <td>").concat(new Date(fakture[page - 1].datumGen).toISOString().split('T')[0], "</td>\n                    <td>").concat(new Date(fakture[page - 1].datumRok).toISOString().split('T')[0], "</td>\n                    <td>").concat(stavkePrikaz, "</td>\n                    <td>").concat(fakture[page - 1].cena, "</td>\n                    <td>").concat(fakture[page - 1].tip, "</td>\n                    <td><a href=\"/izmeniFakturu/").concat(fakture[page - 1].id, "\">Izmeni</a></td>\n                    <td><a href=\"/deleteFaktura/").concat(fakture[page - 1].id, "\">Obrisi</a></td>\n                </tr>\n            ");
        return prikaz;
    };
    RadSaPrikazom.getDetails = function (p) {
        var prikaz = "";
        prikaz += "\n                <tr>\n                    <td>".concat(p.pib, "</td>\n                    <td>").concat(p.naziv, "</td>\n                    <td>").concat(p.adresa, "</td>\n                    <td>").concat(p.telefon, "</td>\n                    <td>").concat(p.email, "</td>\n                    <td>").concat(p.imeLica, "</td>\n                    <td>").concat(p.prezimeLica, "</td>\n                    <td><a href=\"/izmeniPreduzece/").concat(p.id, "\">Izmeni</a></td>\n                    <td><a href=\"/delete/").concat(p.id, "\">Obrisi</a></td>\n                    <td><a href=\"/getFakturaByPreduzece/").concat(p.pib, "\">Fakture</a></td>\n                </tr>\n            ");
        return prikaz;
    };
    RadSaPrikazom.getDetailsFaktura = function (f) {
        var prikaz = "";
        var stavkePrikaz = "";
        f.stavke.forEach(function (s) {
            stavkePrikaz += "<p>\u2022 Naziv: ".concat(s.naziv, " \u2022 Cena po ").concat(s.jedinicaMere, ": ").concat(s.cenaPoJedinici, " \u2022 Kolicina: ").concat(s.kolicina, "</p><hr>");
        });
        prikaz += "\n                <tr>\n                    <td>".concat(f.pibStart, "</td>\n                    <td>").concat(f.pibEnd, "</td>\n                    <td>").concat(new Date(f.datumGen).toISOString().split('T')[0], "</td>\n                    <td>").concat(new Date(f.datumRok).toISOString().split('T')[0], "</td>\n                    <td>").concat(stavkePrikaz, "</td>\n                    <td>").concat(f.cena, "</td>\n                    <td>").concat(f.tip, "</td>\n                    <td><a href=\"/izmeniFakturu/").concat(f.id, "\">Izmeni</a></td>\n                    <td><a href=\"/deleteFaktura/").concat(f.id, "\">Obrisi</a></td>\n                </tr>\n            ");
        return prikaz;
    };
    return RadSaPrikazom;
}());
app.get("/", function (req, res) {
    res.send(RadSaPrikazom.procitajPogledZaNaziv("home"));
});
app.get("/svaPreduzeca", function (req, res) {
    axios.get("http://localhost:5134/api/Preduzece").then(function (response) {
        var td = "\n        <td>PIB</td>\n        <td>Naziv</td>\n        <td>Adresa</td>\n        ";
        res.send(RadSaPrikazom.procitajPogledZaNaziv("index").replace("#{data}", RadSaPrikazom.getArrayPreduzece(response.data)).replace("##td", td));
    })["catch"](function (error) {
        console.log(error);
    });
});
app.get("/details/:id", function (req, res) {
    axios.get("http://localhost:5134/api/Preduzece/details/".concat(req.params["id"])).then(function (response) {
        var td = "\n        <td>PIB</td>\n        <td>Naziv</td>\n        <td>Adresa</td>\n        <td>Telefon</td>\n        <td>Email</td>\n        <td>Ime lica</td>\n        <td>Prezime lica</td>\n        ";
        res.send(RadSaPrikazom.procitajPogledZaNaziv("index").replace("#{data}", RadSaPrikazom.getDetails(response.data)).replace("##td", td));
    })["catch"](function (error) {
        console.log(error);
    });
});
app.get("/delete/:id", function (req, res) {
    axios["delete"]("http://localhost:5134/api/Preduzece/deletePreduzece/".concat(req.params["id"])).then(function (response) { res.redirect("/svaPreduzeca"); });
    //setTimeout(() => {  res.redirect("/svaPreduzeca"); }, 500);
});
app.get("/addPreduzece", function (req, res) {
    res.send(RadSaPrikazom.procitajPogledZaNaziv("addPreduzece"));
});
app.post("/addPreduzece", function (req, res) {
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
app.get("/izmeniPreduzece/:id", function (req, res) {
    axios.get("http://localhost:5134/api/Preduzece/izmeniPreduzece/".concat(req.params["id"]))
        .then(function (response) {
        var id = response.data.id;
        var ime = response.data.imeLica;
        var prezime = response.data.prezimeLica;
        var telefon = response.data.telefon;
        var email = response.data.email;
        var naziv = response.data.naziv;
        var adresa = response.data.adresa;
        var pib = response.data.pib;
        var view = RadSaPrikazom.procitajPogledZaNaziv("updatePreduzece");
        view = view.replace("##{ID}", id);
        view = view.replace("##{ime}", ime);
        view = view.replace("##{prezime}", prezime);
        view = view.replace("##{telefon}", telefon);
        view = view.replace("##{email}", email);
        view = view.replace("##{naziv}", naziv);
        view = view.replace("##{adresa}", adresa);
        view = view.replace("##{pib}", pib);
        res.send(view);
    })["catch"](function (error) {
        console.log(error);
    });
});
app.post("/izmeniPreduzece", function (req, res) {
    axios.post("http://localhost:5134/api/Preduzece/izmeniPreduzece", {
        id: req.body.id,
        imeLica: req.body.ime,
        prezimeLica: req.body.prezime,
        telefon: req.body.telefon,
        email: req.body.email,
        naziv: req.body.naziv,
        adresa: req.body.adresa,
        pib: req.body.pib
    });
    res.redirect("/svaPreduzeca");
});
app.post("/filter", function (req, res) {
    axios.get("http://localhost:5134/api/Preduzece/filter?kriterijum=".concat(req.body.kriterijum)).then(function (response) {
        var td = "\n        <td>PIB</td>\n        <td>Naziv</td>\n        <td>Adresa</td>\n        ";
        res.send(RadSaPrikazom.procitajPogledZaNaziv("index").replace("#{data}", RadSaPrikazom.getArrayPreduzece(response.data)).replace("##td", td));
    })["catch"](function (error) {
        console.log(error);
    });
});
app.get("/getFakturaByPreduzece/:id", function (req, res) {
    axios.get("http://localhost:5134/api/Faktura/filter/".concat(req.params.id)).then(function (response) {
        var td = "\n        <td>PIB Start</td>\n        <td>PIB End</td>\n        <td>Tip</td>\n        ";
        res.send(RadSaPrikazom.procitajPogledZaNaziv("index").replace("#{data}", RadSaPrikazom.getArrayFaktura(response.data)).replace("##td", td));
    })["catch"](function (error) {
        console.log(error);
    });
});
app.get("/getFakturaByPreduzecePage/:id/:page", function (req, res) {
    axios.get("http://localhost:5134/api/Faktura/filter/".concat(req.params.id)).then(function (response) {
        var td = "\n        <td>PIB Start</td>\n        <td>PIB End</td>\n        <td>Tip</td>\n        ";
        var count = response.data.length;
        var buttons = "";
        for (var i = 0; i < count; i++) {
            buttons += "<a href=\"/getFakturaByPreduzecePage/".concat(req.params.id, "/").concat(i + 1, "\" class=\"btn btn-primary m-1\">").concat(i + 1, "</a>");
        }
        res.send(RadSaPrikazom.procitajPogledZaNaziv("indexPage").replace("#{data}", RadSaPrikazom.getPageFaktura(response.data, req.params.page)).replace("##td", td).replace("##btn", buttons).replace("##{pib}", req.params.id));
    })["catch"](function (error) {
        alert("Ne postoje fakture za ovo preduzece.");
        res.redirect("/svaPreduzeca");
    });
});
//FAKTURE
app.get("/sveFakture", function (req, res) {
    axios.get("http://localhost:5134/api/Faktura").then(function (response) {
        var td = "\n        <td>PIB Start</td>\n        <td>PIB End</td>\n        <td>Tip</td>\n        ";
        res.send(RadSaPrikazom.procitajPogledZaNaziv("indexPage").replace("#{data}", RadSaPrikazom.getArrayFaktura(response.data)).replace("##td", td).replace("##btn", ""));
    })["catch"](function (error) {
        console.log(error);
    });
});
app.get("/detailsFaktura/:id", function (req, res) {
    axios.get("http://localhost:5134/api/Faktura/details/".concat(req.params["id"])).then(function (response) {
        var td = "\n        <td>PIB Start</td>\n        <td>PIB End</td>\n        <td>Datum generisanja</td>\n        <td>Datum roka</td>\n        <td>Stavke</td>\n        <td>Cena</td>\n        <td>Tip</td>\n        ";
        res.send(RadSaPrikazom.procitajPogledZaNaziv("indexPage").replace("#{data}", RadSaPrikazom.getDetailsFaktura(response.data)).replace("##td", td).replace("##btn", ""));
    })["catch"](function (error) {
        console.log(error);
    });
});
app.get("/addFaktura", function (req, res) {
    var select = "";
    axios.get("http://localhost:5134/api/Preduzece").then(function (response) {
        response.data.forEach(function (element) {
            select += "<option value=\"".concat(element.pib, "\">").concat(element.naziv, "</option>");
        });
        res.send(RadSaPrikazom.procitajPogledZaNaziv("addFaktura").replace("##sel1", select).replace("##sel2", select));
    });
});
app.post("/addFaktura", function (req, res) {
    console.log(req.body);
    axios.post("http://localhost:5134/api/Faktura/dodajFakturu", {
        pibStart: req.body.pibStart,
        pibEnd: req.body.pibEnd,
        datumGen: new Date(),
        datumRok: new Date(req.body.datumRok),
        stavke: req.body.stavka,
        tip: req.body.tip
    })["catch"](function (error) {
        console.log("Faktura nije dodata");
    }).then(function (response) { res.redirect("/sveFakture"); });
});
//filterIznosStavka/{pib}/{kriterijum}/{value}
app.post("/filterFaktura", function (req, res) {
    axios.get("http://localhost:5134/api/Faktura/filterIznosStavka/".concat(req.body.pib, "/").concat(req.body.kriterijum, "/").concat(req.body.vrednost)).then(function (response) {
        var td = "\n        <td>PIB Start</td>\n        <td>PIB End</td>\n        <td>Tip</td>\n        ";
        res.send(RadSaPrikazom.procitajPogledZaNaziv("indexPage").replace("#{data}", RadSaPrikazom.getArrayFaktura(response.data)).replace("##td", td));
    })["catch"](function (error) {
        console.log(error);
    });
});
app.get("/deleteFaktura/:id", function (req, res) {
    axios["delete"]("http://localhost:5134/api/Faktura/deleteFaktura/".concat(req.params["id"])).then(function (response) { res.redirect("/sveFakture"); });
    //setTimeout(() => {  res.redirect("/svaPreduzeca"); }, 500);
});
app.get("/izmeniFakturu/:id", function (req, res) {
    var select = "";
    var view = RadSaPrikazom.procitajPogledZaNaziv("updateFaktura");
    axios.get("http://localhost:5134/api/Preduzece").then(function (response) {
        response.data.forEach(function (element) {
            select += "<option value=\"".concat(element.pib, "\">").concat(element.naziv, "</option>");
        });
        view = view.replace("##sel1", select).replace("##sel2", select);
    }).then(function () {
        axios.get("http://localhost:5134/api/Faktura/izmeniFakturu/".concat(req.params["id"]))
            .then(function (response) {
            var stavke = response.data.stavke;
            var num = 0;
            var stavkePrikaz = "";
            stavke.forEach(function (s) {
                stavkePrikaz += "<div class=\"row m-3\" id=\"stavkaRow\">\n                    <input type=\"text\" class=\"form-control col\" placeholder=\"naziv\" id=\"stavka\" name=\"stavka[".concat(num, "][naziv]\" value=\"").concat(s.naziv, "\"/>\n                    <input type=\"text\" class=\"form-control col\" id=\"stavka\" placeholder=\"cenaPoJedinici\" name=\"stavka[").concat(num, "][cenaPoJedinici]\" value=\"").concat(s.cenaPoJedinici, "\"/>\n                    <input type=\"text\" class=\"form-control col\" id=\"stavka\" placeholder=\"jedinicaMere\" name=\"stavka[").concat(num, "][jedinicaMere]\" value=\"").concat(s.jedinicaMere, "\"/>\n                    <input type=\"text\" class=\"form-control col\" id=\"stavka\" placeholder=\"kolicina\" name=\"stavka[").concat(num, "][kolicina]\" value=\"").concat(s.kolicina, "\"/>\n              </div>");
                num += 1;
            });
            var id = response.data.id;
            var datumRok = new Date(response.data.datumRok);
            var tip = response.data.tip;
            view = view.replace("##{ID}", id);
            view = view.replace("##datumRok", datumRok);
            view = view.replace("##stavke", stavkePrikaz);
            view = view.replace("##tip", tip);
            res.send(view);
        })["catch"](function (error) {
            console.log(error);
        });
    });
});
app.post("/updateFaktura", function (req, res) {
    console.log(req.body);
    axios.post("http://localhost:5134/api/Faktura/izmeniFakturu", {
        id: req.body.id,
        pibStart: req.body.pibStart,
        pibEnd: req.body.pibEnd,
        datumGen: new Date(),
        datumRok: new Date(req.body.datumRok),
        stavke: req.body.stavka,
        tip: req.body.tip
    })["catch"](function (error) {
        console.log("Faktura nije izmenjena");
    }).then(function (response) { res.redirect("/sveFakture"); });
});
app.get("/balans", function (req, res) {
    var select = "";
    axios.get("http://localhost:5134/api/Preduzece").then(function (response) {
        response.data.forEach(function (element) {
            select += "<option value=\"".concat(element.pib, "\">").concat(element.naziv, "</option>");
        });
        res.send(RadSaPrikazom.procitajPogledZaNaziv("balans").replace("##sel1", select));
    });
});
app.post("/balans", function (req, res) {
    var select = "";
    axios.post("http://localhost:5134/api/Faktura/balans?pibStart=".concat(req.body.pibStart, "&dateStart=").concat(req.body.dateStart, "&dateEnd=").concat(req.body.dateEnd)).then(function (response) {
        console.log("Datumstart: ".concat(req.body.dateStart));
        console.log("Datumend: ".concat(req.body.dateEnd));
        alert("Balans za: ".concat(req.body.pibStart, " u periodu od ").concat(req.body.dateStart, " do ").concat(req.body.dateEnd, " je: ").concat(response.data));
        res.redirect("/balans");
    });
});
app.listen(port, function () {
    console.log("klijent na portu ".concat(port));
});
