import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Button, Container, Table, Form } from "react-bootstrap";
import { GiPodiumWinner } from "react-icons/gi";
import { FaSadTear } from "react-icons/fa";
import IgraService from "../../services/IgraService";
import ClanService from "../../services/ClanService";
import TurnirService from "../../services/TurnirService";
import { RouteNames } from "../../constants";
import moment from "moment";
import useError from "../../hooks/useError";
import useLoading from "../../hooks/useLoading";

export default function IgraPojedinacno() {
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const { prikaziError } = useError();
  const routeParams = useParams();

  const [clanovi, setClanovi] = useState([]);
  const [igra, setIgra] = useState({});
  const [datum, setDatum] = useState("");
  // const [turniri, setTurniri] = useState([]);
  const [bodovi, setBodovi] = useState(0)

  async function dohvatiDetaljeIgre() {
    showLoading();
    const odgovor = await IgraService.getIgraci(routeParams.sifra);
    hideLoading();
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    setClanovi(odgovor.poruka);
  }

  async function dohvatiIgru() {
    showLoading();
    const odgovor = await IgraService.getBySifra(routeParams.sifra);
    hideLoading();
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    let igra = odgovor.poruka;
    igra.datum = moment.utc(igra.datum).format("YYYY-MM-DD");
    setDatum(igra.datum)
    setIgra(igra);
  }

  // async function dohvatiTurnire() {
  //   showLoading();
  //   const odgovor = await TurnirService.get();
  //   hideLoading();
  //   if (odgovor.greska) {
  //     prikaziError(odgovor.poruka);
  //     return;
  //   }
  //   setTurniri(odgovor.poruka);
  //   console.log(turniri);
  // }

  useEffect(() => {
    dohvatiDetaljeIgre();
    dohvatiIgru();
    // dohvatiTurnire();
  }, []);

  async function obrisiClana(sifra) {
    showLoading();
    const odgovor = await ClanService.obrisi(sifra);
    hideLoading();
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    dohvatiDetaljeIgre();
  }
  function obrisi(sifra) {
    if (!confirm("Sigurno obrisati?")) {
      return;
    }
    obrisiClana(sifra);
  }

  async function promjenaDatuma() {
    showLoading();
    const odgovor = await IgraService.promjeniDatum(routeParams.sifra, datum);
    hideLoading();
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
  }

  // async function promjenaBodova(igrSifra) {
  //   showLoading();
  //   const odgovor = await ClanService.promjeniBodove(igrSifra, routeParams.sifra, bodovi);
  //   hideLoading();
  //   if (odgovor.greska) {
  //     prikaziError(odgovor.poruka);
  //     return;
  //   }
  // }

  function spremiPromjene() {
    // promjenaBodova();
    promjenaDatuma();
  }

  return (
    <Container>
      {/* <h2 className="sredina">{turnir.naziv}Neki tekst</h2> */}
      <Link className="btn btn-success" to={`/clan/dodaj/${routeParams.sifra}`}>
        Dodaj igrača
      </Link>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <Button
        className="btn btn-danger"
        onClick={() => navigate(`/turnir/${igra.turnirSifra}`)}
      >
        Povratak
      </Button>
      <hr />
      <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
        <Table striped bordered responsive hover>
          <thead>
            <tr>
              <th>Igrač</th>
              <th className="sredina">Broj bodova</th>
              <th className="sredina">Pobjeda</th>
              <th className="sredina akcije">Akcije</th>
            </tr>
          </thead>
          <tbody>
            {clanovi &&
              clanovi.map((clan, index) => (
                <tr key={index}>
                  <td>{clan.imeIgrac}</td>
                  <td className="sredina">
                    <Form.Group controlId="bodovi">
                      <Form.Control
                        type="number"
                        name="bodovi"
                        defaultValue={clan.brojBodova}
                        required
                        // onChange={() => promjenaBodova(clan.sifraIgrac)}
                        step={1}
                      />
                    </Form.Group>
                  </td>
                  <td className="sredina">
                    {clan.pobjeda ? (
                      <GiPodiumWinner size={35} color="green" />
                    ) : (
                      <FaSadTear size={25} color="red" />
                    )}
                  </td>
                  <td className="sredina akcije">
                    <Button
                      variant="warning"
                      onClick={() => navigate(`/clanovi/${clan.sifra}`)}
                    >
                      Uredi
                    </Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button variant="danger" onClick={() => obrisi(clan.sifra)}>
                      Obriši
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>

          <tfoot>
            <tr>
              <td>Datum</td>
              <td className="sredina" colSpan={2}>
                <Form.Group controlId="datum">
                  <Form.Control
                    type="date"
                    name="datum"
                    value={datum}
                    required
                    onChange={(e) => setDatum(e.target.value)}
                  />
                </Form.Group>
              </td>
              <td className="sredina">
                <Button
                  className="btn btn-warning"
                  onClick={() => spremiPromjene()}
                >
                  Promjeni
                </Button>
              </td>
            </tr>
          </tfoot>
        </Table>
      </div>
    </Container>
  );
}
