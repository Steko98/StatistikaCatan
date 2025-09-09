import { Link, useNavigate, useParams } from "react-router-dom";
import TurnirService from "../../services/TurnirService";
import { useEffect, useState } from "react";
import { RouteNames } from "../../constants";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { IoIosAddCircleOutline } from "react-icons/io";
import moment from "moment";
import IgraService from "../../services/IgraService";
import ZbirBodovaGraf from "../../components/grafovi/ZbirBodovaGraf";
import GrafTabovi from "../../components/grafovi/Tabovi";
import PostotakGraf from "../../components/grafovi/PostotakGraf";
import OdigraneGraf from "../../components/grafovi/OdigraneGraf";
import TablicaRekordi from "../../components/grafovi/TablicaRekordi";
import useLoading from "../../hooks/useLoading";
import useError from "../../hooks/useError";

export default function TurnirPojedinacno() {
  const navigate = useNavigate();
  const { showLoading, hideLoading} = useLoading();
  const {prikaziError} = useError();


  const routeParams = useParams();
  const [turnir, setTurnir] = useState({});
  const [odabraniGraf, setOdabraniGraf] = useState("Percentage");

  async function dohvatiDetaljeTurnira() {
    showLoading();
    const odgovor = await TurnirService.getDetaljiTurnir(routeParams.sifra);
    hideLoading();
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    setTurnir(odgovor.poruka);
  }

  useEffect(() => {
    dohvatiDetaljeTurnira();
  }, []);

  function formatirajDatum(datum) {
    if (datum == null) {
      return "Nije definirano";
    }
    return moment.utc(datum).format("DD.MM.YYYY.");
  }

  async function obrisiIgru(sifra) {
    showLoading();
    const odgovor = await IgraService.obrisi(sifra);
    hideLoading();
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    dohvatiDetaljeTurnira();
  }
  function obrisi(sifra) {
    if (!confirm("Sigurno obrisati?")) {
      return;
    }
    obrisiIgru(sifra);
  }

  return (
    <Container>
      <h2 className="sredina">{turnir.naziv}</h2>
      <Link className="btn btn-success" to={`/igre/dodaj/${turnir.sifra}`}>
        <IoIosAddCircleOutline /> Add game
      </Link>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <Link className="btn btn-danger" to={RouteNames.TURNIR_PREGLED}>
        Return
      </Link>
      <hr />
      <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
        <h2>Games</h2>
        <br />
        <Table striped hover responsive bordered variant="dark">
          <thead>
            <tr>
              <th>#</th>
              <th>Winner</th>
              <th>Players</th>
              <th>Date</th>
              <th className="sredina akcije"></th>
            </tr>
          </thead>
          <tbody>
            {turnir &&
              turnir.igre &&
              turnir.igre.map((igra, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    {igra.clanovi &&
                      igra.clanovi.find((c) => c.pobjeda)?.imeIgrac}
                  </td>
                  <td>
                    {igra.clanovi &&
                      igra.clanovi.map((c) => c.imeIgrac).join(", ")}
                  </td>
                  <td>{formatirajDatum(igra.datum)}</td>
                  <td className="sredina akcije">
                    <Button
                      variant="info"
                      onClick={() => navigate(`/igra/${igra.sifra}`)}
                    >
                      Details
                    </Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button variant="danger" onClick={() => obrisi(igra.sifra)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
      <hr />
      <h2 className="sredina">Stats</h2>
      <br />
      <Row>
        <Col key="1" sm={12} md={6} lg={6}>
          <div className="d-flex justify-content-center">
            <GrafTabovi onChange={setOdabraniGraf}/>            
          </div>
          <div className="mt-4 d-flex align-items-center">
            {odabraniGraf === "Percentage" && <PostotakGraf igre={turnir.igre}/>}
            {odabraniGraf === "Total points" && <ZbirBodovaGraf igre={turnir.igre}/>}
            {odabraniGraf === "Games played" && <OdigraneGraf igre={turnir.igre}/>}
          </div>
        </Col>

        <Col key="2" sm={12} md={6} lg={6} className="d-flex align-items-center justify-content-center">
          {turnir.igre && <TablicaRekordi igre={turnir.igre}/>}
        </Col>
      </Row>
    </Container>
  );
}
