import { HttpService } from "./HttpService";

async function get() {
  return await HttpService.get("/Igrac")
    .then((odgovor) => {
      return { greska: false, poruka: odgovor.data };
    })
    .catch((e) => {
      return { greska: true, poruka: "Problem kod dohvaćanja igrača" };
    });
}

async function getIgraciZaIgru(sifra) {
  return await HttpService.get("/Igrac/IgraciZaIgru/" + sifra)
    .then((odgovor) => {
      return { greska: false, poruka: odgovor.data };
    })
    .catch((e) => {
      return { greska: true, poruka: "Problem kod dohvaćanja igrača" };
    });
}

async function getBySifra(sifra) {
  return await HttpService.get("/Igrac/" + sifra)
    .then((odgovor) => {
      return { greska: false, poruka: odgovor.data };
    })
    .catch(() => {
      return { greska: true, poruka: "Igrač nije pronađen" };
    });
}

async function obrisi(sifra) {
  return await HttpService.delete("/Igrac/" + sifra)
    .then((odgovor) => {
      return { greska: false, poruka: odgovor.data };
    })
    .catch(() => {
      return { greska: true, poruka: "Greška kod brisanja igrača" };
    });
}

async function dodaj(igrac) {
  return await HttpService.post("/Igrac", igrac)
    .then((odgovor) => {
      return { greska: false, poruka: odgovor.data };
    })
    .catch((e) => {
      switch (e.status) {
        case 400:
          let poruke = "";
          for (const kljuc in e.response.data.errors) {
            poruke += kljuc + ": " + e.response.data.errors[kljuc][0] + "\n";
          }
          console.log(poruke);
          return { greska: true, poruka: poruke };
        default:
          return { greska: true, poruka: "Igrač se ne može dodati" };
      }
    });
}

async function promjeni(sifra, igrac) {
  return await HttpService.put("/Igrac/" + sifra, igrac)
    .then((odgovor) => {
      return { greska: false, poruka: odgovor.data };
    })
    .catch((e) => {
      switch (e.status) {
        case 400:
          let poruke = "";
          for (const kljuc in e.response.data.errors) {
            poruke += kljuc + ": " + e.response.data.errors[kljuc][0] + "\n";
          }
          console.log(poruke);
          return { greska: true, poruka: poruke };
        default:
          return { greska: true, poruka: "Igrač se ne može promjeniti" };
      }
    });
}

async function getIgre(sifra) {
  return await HttpService.get("/Igrac/Igre/" + sifra)
    .then((odgovor) => {
      return { greska: false, poruka: odgovor.data };
    })
    .catch(() => {
      return { greska: true, poruka: "Problem kod dohvaćanja igara" };
    });
}

async function dodajIgru(igrac, clan) {
  return await HttpService.post("/Igrac/" + igrac + "/dodaj/" + clan)
    .then((odgovor) => {
      return { greska: false, poruka: odgovor.data };
    })
    .catch(() => {
      return { greska: true, poruka: "Problem kod dodavanja igre" };
    });
}

async function obrisiIgru(igrac, igra) {
  return await HttpService.delete("/Igrac/" + igrac + "/Igra/" + igra)
    .then((odgovor) => {
      return { greska: false, poruka: odgovor.data };
    })
    .catch(() => {
      return { greska: true, poruka: "Problem kod brisanja igre" };
    });
}

async function traziIgrac(uvjet) {
  return await HttpService.get("Igrac/trazi/" + uvjet)
    .then((odgovor) => {
      return { greska: false, poruka: odgovor.data };
    })
    .catch((e) => {
      return { greska: true, poruka: "Problem kod traženja igrača" };
    });
}

async function getStranicenje(stranica, uvjet) {
  return await HttpService.get('Igrac/traziStranicenje/'+stranica+'?uvjet='+uvjet)
  .then((odgovor)=>{return{greska:false, poruka: odgovor.data}})
  .catch((e)=>{return {greska:true, poruka: 'Problem kod traženja igrača'}})
}

async function postaviSliku(sifra, slika) {
  return await HttpService.put('/Igrac/postaviSliku/' + sifra, slika)
  .then((odgovor)=>{return {greska: false, poruka: odgovor.data};})
  .catch((e)=>{return {greska:true, poruka:'Problem kod postavljanja slike'}})
}

async function ukupnoIgraca() {
  return await HttpService.get("/Pocetna/UkupnoIgraca")
  .then((odgovor)=>{
    return odgovor.data
  })
  .catch((e)=>{console.error(e)})
}

export default {
  get,
  getBySifra,
  obrisi,
  dodaj,
  promjeni,
  getIgre,
  dodajIgru,
  obrisiIgru,
  traziIgrac,
  getIgraciZaIgru,
  postaviSliku,
  getStranicenje,
  ukupnoIgraca
};
