import { Table } from "react-bootstrap";
import { useParams } from "react-router-dom";

export default function tablicaRekordi() {
  const routeParams = useParams();
  const [turnir, setTurnir] = useState({});

  async function dohvatiDetaljeTurnira() {
    const odgovor = await TurnirService.getDetaljiTurnir(routeParams.sifra);
    if (odgovor.greska) {
      alert(odgovor.poruka);
      return;
    }
    setTurnir(odgovor.poruka);
  }

  useEffect(() => {
    dohvatiDetaljeTurnira();
  }, []);

  function pripremiPodatke(igre) {
    const podaci = {};

    igre.forEach((igra) => {
      igra.clanovi.forEach((clan) => {
        const sifra = clan.sifraIgrac;
        if (!podaci[sifra]) {
          podaci[sifra] = {
            sifra,
            ime: clan.imeIgrac,
            odigrano: 0,
            pobjeda: 0,
            bodovi: 0,
            postotakPobjeda: 0,
            prosjekBodova: 0,
            niz: 0,
            najduziNiz: 0,
          };
        }

        podaci[sifra].odigrano += 1;
        podaci[sifra].bodovi += clan.brojBodova;

        if (clan.pobjeda) {
          podaci[sifra].pobjeda += 1;
          podaci[sifra].niz += 1;
          podaci[sifra].najduziNiz = Math.max(
            podaci[sifra].najduziNiz,
            podaci[sifra].niz
          );
        } else {
          podaci[sifra].niz = 0;
        }
      });
    });

    Object.values(podaci).forEach((igrac) => {
      igrac.postotakPobjeda = igrac.pobjeda / igrac.odigrano;
      igrac.prosjekBodova = igrac.bodovi / igrac.odigrano;
    });

    return podaci;
  }

  return (
    <Table striped hover responsive bordered>
      <thead>
        <tr>
          <td>Rekord</td>
          <td>Rezultat</td>
          <td>Igrač</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Najviše odigranih</td>
          <td></td>
          <td>{najviseOdigranih}</td>
        </tr>
        <tr>
          <td>Najviše pobjeda</td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>Najbolji postotak</td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>Najduži niz pobjeda</td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>Najviše bodova</td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>Najveći prosjek bodova po igri</td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </Table>
  );
}
