import { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { IoIosAddCircleOutline } from "react-icons/io";
import TurnirService from "../../services/TurnirService";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import useLoading from "../../hooks/useLoading";
import useError from "../../hooks/useError";

export default function TurniriPregled() {
  const navigate = useNavigate();
  const {showLoading, hideLoading} = useLoading();
  const {prikaziError} = useError();




  const [turniri, setTurniri] = useState([]);

  async function dohvatiTurnire() {
    showLoading();
    const odgovor = await TurnirService.get();
    hideLoading();
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    setTurniri(odgovor.poruka);
  }

  useEffect(() => {
    dohvatiTurnire();
  }, []);

  function formatirajDatum(datum) {
    if (datum == null) {
      return "Nije definirano";
    }
    return moment.utc(datum).format("DD.MM.YYYY.");
  }

  async function obrisiTurnir(sifra) {
    showLoading();
    const odgovor = await TurnirService.obrisi(sifra);
    hideLoading();
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    dohvatiTurnire();
  }
  function obrisi(sifra) {
    if (!confirm("Sigurno obrisati?")) {
      return;
    }
    obrisiTurnir(sifra);
  }

  return (
    <Container>
      <h2 className="sredina">My tournaments</h2>

      <Link className="btn btn-success" to={RouteNames.TURNIR_NOVI}>
        <IoIosAddCircleOutline /> Create new tournament
      </Link>

      <hr />
      <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
        <Table striped bordered hover responsive variant="dark">
          <thead>
            <tr>
              <th>Tournament</th>
              <th className="sredina">Start date</th>
              <th className="sredina">End date</th>
              <th className="sredina akcije"></th>
            </tr>
          </thead>
          <tbody>
            {turniri &&
              turniri.map((turnir, index) => (
                <tr key={index}>
                  <td>{turnir.naziv}</td>
                  <td className="sredina">{formatirajDatum(turnir.datumPocetka)}</td>
                  <td className="sredina">{formatirajDatum(turnir.datumZavrsetka)}</td>

                  <td className="sredina akcije">
                    <Button
                      variant="info"
                      onClick={() => navigate(`/turnir/${turnir.sifra}`)}
                    >
                      Details
                    </Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button
                      variant="warning"
                      onClick={() => navigate(`/turniri/${turnir.sifra}`)}
                    >
                      Edit
                    </Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button
                      variant="danger"
                      onClick={() => obrisi(turnir.sifra)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
}
