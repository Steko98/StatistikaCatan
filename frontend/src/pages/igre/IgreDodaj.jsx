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
  const [igraci, setIgraci] = useState([]);
  const [redovi, setRedovi] = useState([]);
  const [sudionici, setSudionici] = useState([]);
  const [sifraIgrac, setIgracSifra] = useState(0);

  const [turniri, setTurniri] = useState([]);

  function dodajRed() {
    redovi.push({ igrac: "", brojBodova: 0, pobjeda: false });
    setRedovi([...redovi]);
  }

  function obrisiRed(index) {
    redovi.splice(index, 1);
    setRedovi([...redovi]);
  }

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

  async function dohvatiIgrace() {
    showLoading();
    const odgovor = await IgracService.get();
    hideLoading();
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    } setIgraci(odgovor.poruka);
  }

  useEffect(() => {
    dohvatiTurnire();
    dohvatiIgrace();
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

  // //funkcija za dodat clanovu u igru
  // async function dodajClanove(){
  //   showLoading();
  //   redovi.forEach(red => {
  //     const odgovor = Service.dodajClan(red);
  //     if (odgovor.greska) {
  //       prikaziError(odgovor.poruka);
  //       return;
  //     }
  //   });

  // }

  function obradiSubmit(e) {
    e.preventDefault();

    const podaci = new FormData(e.target);
    console.log(podaci)

    dodajIgru({
      datum: moment.utc(podaci.get("datum")),
      turnirSifra: parseInt(sifra),
    });

    // navigate(`/turnir/${sifra}`);
  }

  return (
    <Container>
      <h2 className="sredina">Dodavanje igre</h2>

      <br />

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
          <Col sm={12} md={8} lg={9}>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Igrač</th>
                  <th className="sredina">Broj bodova</th>
                  <th className="sredina">Pobjeda</th>
                  <th className="sredina">Akcije</th>
                </tr>
              </thead>
              <tbody>
                {redovi && redovi.map((r, index) => (
                  <tr key={index}>
                    
                    <td>                
                      <Form.Group controlId="igrac">
                          <Form.Select name="sifraIgrac"
                            onChange={(e) => {
                            setIgracSifra(e.target.value);
                            }}>
                              {igraci &&
                                igraci.map((i, index) => (
                                  <option key={index} value={i.sifra}>
                                    {i.ime}
                                  </option>
                                ))}
                          </Form.Select>
                        </Form.Group>
                      </td>

                      <td style={{ display: 'flex', justifyContent: 'center' }}>
                        <Form.Group controlId="brojBodova" >
                          <Form.Control 
                            type="number" 
                            name="brojBodova" 
                            style={{width:'fit-content'}}
                            className="sredina"
                            />
                        </Form.Group>
                      </td>

                      <td>
                        <Form.Group controlId="pobjeda" className="sredina">
                          <Form.Check name="pobjeda" 
                          value={r.pobjeda}/>
                        </Form.Group>
                      </td>

                      <td className="sredina">
                        <Button variant="danger" onClick={() => obrisiRed(index)}>
                          Obriši
                        </Button>
                      </td>

                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr>
                  <td colSpan={4} className="sredina">
                    <Button variant="success" onClick={dodajRed}>
                      Dodaj sudionika
                    </Button>
                  </td>
                </tr>
              </tfoot>
            </Table>
          </Col>
        </Row>

        <hr style={{ marginTop: "50px" }} />

        <Row>
          <Col xs={6} sm={12} md={3} lg={6} xl={6} xxl={6}>
            <Button
              onClick={() => navigate(`/turnir/${sifra}`)}
              className="btn btn-danger siroko"
            >
              Povratak
            </Button>
          </Col>
          <Col xs={6} sm={12} md={9} lg={6} xl={6} xxl={6}>
            <Button variant="success" type="submit" className="siroko">
              Dodaj igru
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
