import { HttpService } from "./HttpService";

async function get() {
  return await HttpService.get("/Igra")
    .then((odgovor) => {
      return { greska: false, poruka: odgovor.data };
    })
    .catch((e) => {
      return { greska: true, poruka: "Problem kod dohvaćanja igre" };
    });
}

async function getBySifra(sifra) {
  return await HttpService.get("/Igra/" + sifra)
    .then((odgovor) => {
      return { greska: false, poruka: odgovor.data };
    })
    .catch((e) => {
      return { greska: true, poruka: "Igra nije pronađena" };
    });
}

async function obrisi(sifra) {
  return await HttpService.delete("/Igra/" + sifra)
    .then((odgovor) => {
      return { greska: false, poruka: odgovor.data };
    })
    .catch(() => {
      return { greska: true, poruka: "Greška kod brisanja igre" };
    });
}

async function dodaj(igra) {
  return await HttpService.post("/Igra", igra)
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
          return { greska: true, poruka: "Igra se ne može dodati" };
      }
    });
}

async function promjeni(sifra, igra) {
  return await HttpService.put("/Igra/" + sifra, igra)
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
          return { greska: true, poruka: "Igra se ne može promjeniti" };
      }
    });
}

async function promjeniDatum(sifra, datum) {
  return await HttpService.patch(`/Igra/${sifra}?datum=${datum}`)
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
          return { greska: true, poruka: "Datum se ne može promjeniti" };
      }
    });
}

async function getIgraci(sifra) {
  return await HttpService.get("/Igra/Igraci/" + sifra)
    .then((odgovor) => {
      return { greska: false, poruka: odgovor.data };
    })
    .catch(() => {
      return { greska: true, poruka: "Problem kod dohvaćanja igrača" };
    });
}

async function dodajIgraca(igra, igrac) {
  return await HttpService.post("/Igra/" + igra + "/dodaj/" + igrac)
    .then((odgovor) => {
      return { greska: false, poruka: odgovor.data };
    })
    .catch(() => {
      return { greska: true, poruka: "Problem kod dodavanja igrača" };
    });
}

async function obrisiIgraca(igra, igrac) {
  return await HttpService.delete("/Igra/" + igra + "/obrisi/" + igrac)
    .then((odgovor) => {
      return { greska: false, poruka: odgovor.data };
    })
    .catch(() => {
      return { greska: true, poruka: "Problem kod brisanja igrača" };
    });
}

// async function traziIgra(uvjetPocetak, uvjetKraj) {
//     const uvjeti = new uvjeti;
//     return await HttpService.get(`Igra/trazi?${uvjeti}`)
//     .then ((odgovor)=>{
//         return {greska: false, poruka: odgovor.data}
//     })
//     .catch ((e)=>{return {greska: true, poruka: "Problem kod traženja igre"}})
// }

async function ukupnoIgara() {
  return await HttpService.get("/Pocetna/UkupnoIgara")
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
  getIgraci,
  dodajIgraca,
  obrisiIgraca,
  promjeniDatum,
  ukupnoIgara
  // traziIgra
};
