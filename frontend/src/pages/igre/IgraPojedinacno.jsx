import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import IgraService from "../../services/IgraService";
import { RouteNames } from "../../constants";
import { Button, Container, Table } from "react-bootstrap";
import { GiPodiumWinner } from "react-icons/gi";
import { FaSadTear } from "react-icons/fa";
import ClanService from "../../services/ClanService";
import moment from "moment";

export default function IgraPojedinacno() {
  const navigate = useNavigate();
  const routeParams = useParams();
  const [clanovi, setClanovi] = useState([]);
  const [igra, setIgra] = useState({});

  async function dohvatiDetaljeIgre() {
    const odgovor = await IgraService.getIgraci(routeParams.sifra);
    if (odgovor.greska) {
      alert(odgovor.poruka);
      return;
    }
    setClanovi(odgovor.poruka);
  }

  async function dohvatiIgru() {
    const odgovor = await IgraService.getBySifra(routeParams.sifra);
    if (odgovor.greska) {
      alert(odgovor.poruka);
      return;
    }
    console.log("odgovor", odgovor);
    setIgra(odgovor.poruka);
  }

  useEffect(() => {
    dohvatiDetaljeIgre();
    dohvatiIgru();
  }, []);

  async function obrisiClana(sifra) {
    const odgovor = await ClanService.obrisi(sifra);
    if (odgovor.greska) {
      alert(odgovor.poruka);
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
      <Link className="btn btn-success" to={RouteNames.CLAN_NOVI}>
        Dodaj igrača
      </Link>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <Button className="btn btn-danger" onClick={() => navigate(-1)}>
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
              <td className="sredina" colSpan={2}>{formatirajDatum(igra.datum)}</td>
              <td className="sredina">
                <Button className="btn btn-warning"
                  onClick={() => navigate(`/igre/${igra.sifra}`)}>
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
