import { HttpService } from "./HttpService";

async function get() {
  return await HttpService.get("/Clan")
    .then((odgovor) => {
      return { greska: false, poruka: odgovor.data };
    })
    .catch((e) => {
      return { greska: true, poruka: "Problem kod dohvaćanja" };
    });
}

async function getBySifra(sifra) {
  return await HttpService.get("/Clan/" + sifra)
    .then((odgovor) => {
      return { greska: false, poruka: odgovor.data };
    })
    .catch((e) => {
      return { greska: true, poruka: "Član nije pronađen" };
    });
}

async function obrisi(sifra) {
  return await HttpService.delete("/Clan/" + sifra)
    .then((odgovor) => {
      return { greska: false, poruka: odgovor.data };
    })
    .catch(() => {
      return { greska: true, poruka: "Član nije pronađen" };
    });
}

async function dodaj(clan) {
  return await HttpService.post("/Clan", clan)
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
          return { greska: true, poruka: "Član se ne može dodati" };
      }
    });
}

async function promjeni(sifra, clan) {
  return await HttpService.put("/Clan/" + sifra, clan)
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
          return { greska: true, poruka: "Član se ne može promjeniti" };
      }
    });
}

async function promjeniBodove(sifraIgra, sifraIgrac, bodovi) 
{
  return await HttpService.patch(`/Clan/clan?sifraIgrac=${sifraIgrac}&sifraIgra=${sifraIgra}&bodovi=${bodovi}`)
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
          return { greska: true, poruka: "Bodovi se ne mogu promjeniti" };
      }
    });
}

export default {
  get,
  getBySifra,
  obrisi,
  dodaj,
  promjeni,
};
