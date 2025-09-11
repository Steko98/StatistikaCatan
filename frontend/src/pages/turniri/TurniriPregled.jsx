import { useEffect, useState } from "react";
import { Button, Container, Table, Form, Row, Col } from "react-bootstrap";
import { IoIosAddCircleOutline } from "react-icons/io";
import TurnirService from "../../services/TurnirService";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import useLoading from "../../hooks/useLoading";
import useError from "../../hooks/useError";

export default function TurniriPregled() {
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const { prikaziError } = useError();

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
      return "Not defined";
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
    if (!confirm("Are you sure? This action CANNOT be undone and will permanently delete all the games inside the tournament!")) {
      return;
    }
    obrisiTurnir(sifra);
  }

  async function dodaj(turnir) {
    showLoading();
    const odgovor = await TurnirService.dodaj(turnir);
    hideLoading();
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    dohvatiTurnire();
  }

  function odradiSubmit(e) {
    e.preventDefault();

    let podaci = new FormData(e.target);

    dodaj({
      naziv: podaci.get("naziv"),
      datumPocetka: moment.utc(podaci.get("datumPocetka")),
      datumZavrsetka: moment.utc(podaci.get("datumZavrsetka")),
    });

    dohvatiTurnire();
  }

  return (
    <Container>
      <Row>
        <Col sm={12} md={6} lg={6} className="mb-3">
          <hr />        
          <h2 className="sredina headers">My tournaments</h2>
          <br />
          <div style={{ maxHeight: "60vh", overflowY: "auto" }} className="scrollable">
            <Table striped bordered responsive hover variant="dark">
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
                      <td className="sredina">
                        {formatirajDatum(turnir.datumPocetka)}
                      </td>
                      <td className="sredina">
                        {formatirajDatum(turnir.datumZavrsetka)}
                      </td>

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
        </Col>

        <Col sm={12} md={6} lg={6}>
          <hr />        
          <h2 className="sredina headers">Create new tournament</h2>
          <br />
          <Form onSubmit={odradiSubmit}>
            <Form.Group controlId="naziv">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="naziv" required />
            </Form.Group>
            <br />
            <Form.Group controlId="datumPocetka">
              <Form.Label>Start date</Form.Label>
              <Form.Control type="date" name="datumPocetka" />
            </Form.Group>
            <br />
            <Form.Group controlId="datumZavrsetka">
              <Form.Label>End date</Form.Label>
              <Form.Control type="date" name="datumZavrsetka" />
            </Form.Group>
            <br />
            <Button className="btn btn-success siroko" type="submit">
              <IoIosAddCircleOutline /> Create new tournament
            </Button>
          </Form>
        </Col>
      </Row>
      <br />
    </Container>
  );
}
