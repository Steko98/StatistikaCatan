import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Service from "../../services/IgraService";
import TurnirService from "../../services/TurnirService";
import { RouteNames } from "../../constants";
import moment from "moment";
import { Button, Row, Col, Form, Container, Table } from "react-bootstrap";
import IgracService from "../../services/IgracService";
import useError from "../../hooks/useError";
import useLoading from "../../hooks/useLoading";

export default function IgreDodaj() {
  const { sifra, sifraTurnira } = useParams();
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const { prikaziError } = useError();

  const [turniri, setTurniri] = useState([]);
  // const [igraci, setIgraci] = useState([]);
  // const [sudionici, setSudionici] = useState([]);

  async function dohvatiTurnire() {
    showLoading();
    const odgovor = await TurnirService.get();
    hideLoading();
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    const ucitaniTurniri = odgovor.poruka;
    setTurniri(ucitaniTurniri);
  }

  // async function dohvatiIgrace() {
  //   const odgovor = await IgracService.get();
  //   if (odgovor.greska) {
  //     alert(odgovor.poruka);
  //     return;
  //   }
  //   setIgraci(odgovor.poruka);
  // }

  useEffect(() => {
    dohvatiTurnire();
    // dohvatiIgrace();
  }, []);

  async function dodajIgru(e) {
    showLoading();
    const odgovor = await Service.dodaj(e);
    hideLoading();
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
  }

  function obradiSubmit(e) {
    e.preventDefault();

    const podaci = new FormData(e.target);

    dodajIgru({
      datum: moment.utc(podaci.get("datum")),
      turnirSifra: parseInt(sifra),
    });

    navigate(`/turnir/${sifra}`);
  }

  return (
    <Container>
      <Form onSubmit={obradiSubmit}>
        <Row>
          <Col sm={12} md={4} lg={3}>
            <Form.Group controlId="datum">
              <Form.Label>Datum</Form.Label>
              <Form.Control
                type="date"
                name="datum"
                defaultValue={moment().format("YYYY-MM-DD")}
                required
              />
            </Form.Group>

            <br />

            <Form.Group className="mb-3" controlId="turnir">
              <Form.Label>Turnir</Form.Label>
              <Form.Select
                value={sifra}
                onChange={(e) => {
                  setTurnirSifra(e.target.value);
                }}
              >
                {turniri &&
                  turniri.map((t, index) => (
                    <option key={index} value={t.sifra}>
                      {t.naziv}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
          </Col>
          {/* <Col sm={12} md={8} lg={9}>
            <Table bordered responsive striped hover>
              <thead>
                <tr>
                  <th>Igrač</th>
                  <th className="sredina">Bodovi</th>
                  <th className="sredina">Pobjeda</th>
                  <th className="sredina">Akcije</th>
                </tr>
              </thead>
              <tbody>
                  {sudionici.map(s => (
                    <tr key={s.sifra}>
                      <td><Form.Control type="text" name="ime" required /></td>
                      <td><Form.Control type="number" name="brojBodova" /></td>
                      <td><Form.Check label="Pobjeda" name="pobjeda" /></td>
                      <td>
                        <Button className="btn btn-danger">Obriši</Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4" className="sredina">
                    <Button >Dodaj igrača</Button>
                  </td>
                </tr>
              </tfoot>
            </Table>
          </Col> */}
        </Row>

        <hr style={{ marginTop: "50px" }} />

        <Row className="akcije">
          <Col xs={6} sm={12} md={3} lg={6} xl={6} xxl={6}>
            <Button
              onClick={() => navigate(`/turnir/${sifra}`)}
              className="btn btn-danger"
            >
              Povratak
            </Button>
          </Col>
          <Col xs={6} sm={12} md={9} lg={6} xl={6} xxl={6}>
            <Button variant="success" type="submit">
              Dodaj igru
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
