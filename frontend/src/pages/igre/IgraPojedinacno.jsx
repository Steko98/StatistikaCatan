import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import IgraService from "../../services/IgraService";
import { RouteNames } from "../../constants";
import { Button, Container, Table } from "react-bootstrap";
import { GiPodiumWinner } from "react-icons/gi";
import { FaSadTear } from "react-icons/fa";
import ClanService from "../../services/ClanService";
import moment from "moment";
import useError from "../../hooks/useError";
import useLoading from "../../hooks/useLoading";

export default function IgraPojedinacno() {
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const { prikaziError } = useError();
  const routeParams = useParams();

  const location = useLocation();
  const turnirSifra = location.state?.sifra;

  const [clanovi, setClanovi] = useState([]);
  const [igra, setIgra] = useState({});

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
    setIgra(odgovor.poruka);
  }

  useEffect(() => {
    dohvatiDetaljeIgre();
    dohvatiIgru();
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

  function formatirajDatum(datum) {
    if (datum == null) {
      return "Nije definirano";
    }
    return moment.utc(datum).format("DD.MM.YYYY.");
  }

  return (
    <Container>
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
                  <td className="sredina">{clan.brojBodova}</td>
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
                {formatirajDatum(igra.datum)}
              </td>
              <td className="sredina">
                <Button
                  className="btn btn-warning"
                  onClick={() => navigate(`/igre/${routeParams.sifra}`)}
                >
                  Promijeni datum
                </Button>
              </td>
            </tr>
          </tfoot>
        </Table>
      </div>
    </Container>
  );
}
