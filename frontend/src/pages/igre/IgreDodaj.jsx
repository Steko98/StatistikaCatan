import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import TurnirService from "../../services/TurnirService";
import moment from "moment";
import { Button, Row, Col, Form, Container, Table } from "react-bootstrap";
import { IoIosAddCircleOutline } from "react-icons/io";
import IgracService from "../../services/IgracService";
import useError from "../../hooks/useError";
import useLoading from "../../hooks/useLoading";
import IgraService from "../../services/IgraService";
import ClanService from "../../services/ClanService";

export default function IgreDodaj() {
  const { sifra, sifraTurnira } = useParams();
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const { prikaziError } = useError();
  const [igraci, setIgraci] = useState([]);
  const [redovi, setRedovi] = useState([]);

  const [sifraNoveIgre, setSifraNoveIgre] = useState(0);

  const [turniri, setTurniri] = useState([]);

  function dodajRed() {
    redovi.push({sifraIgra: 0, sifraIgrac: igraci[0].sifra, brojBodova: 0, pobjeda: false });
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
    const odgovor = await IgraService.dodaj(e);
    hideLoading();
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    redovi.forEach(red => {
    console.log(red);
    dodajClanove(odgovor.poruka.sifra, red.sifraIgrac, red.brojBodova, red.pobjeda);
    })
  }


  async function dodajClanove(sifraIgra,sifraIgrac, brojBodova, pobjeda){
    showLoading();
    const odgovor = ClanService.dodaj({sifraIgra: sifraIgra, sifraIgrac: sifraIgrac, brojBodova: brojBodova, pobjeda: pobjeda });
    hideLoading();
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
  };

  

  function obradiSubmit(e) {
    e.preventDefault();

    const podaci = new FormData(e.target);

    dodajIgru({
      datum: moment.utc(podaci.get("datum")),
      turnirSifra: sifra,
    });

    navigate(`/turnir/${sifra}`);
  }

  return (
    <Container>
      <h2 className="sredina">New game</h2>

      <br />

      <Form onSubmit={obradiSubmit}>
        <Row>
          <Col sm={12} md={4} lg={3}>
            <Form.Group controlId="datum">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="datum"
                defaultValue={moment().format("YYYY-MM-DD")}
                required
              />
            </Form.Group>

            <br />

            <Form.Group className="mb-3" controlId="turnir">
              <Form.Label>Tournament</Form.Label>
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
            <Table striped bordered hover responsive variant="dark">
              <thead>
                <tr>
                  <th>Player</th>
                  <th className="sredina">Points</th>
                  <th className="sredina">Win</th>
                  <th className="sredina"></th>
                </tr>
              </thead>
              <tbody>
                {redovi && redovi.map((r, index) => (
                  <tr key={index}>
                    
                    <td>                
                      <Form.Group controlId="igrac">
                          <Form.Select name="sifraIgrac"
                            onChange={(e) => {
                            r.sifraIgrac = parseInt(e.target.value);
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
                            onChange={(e)=> {
                              r.brojBodova = parseInt(e.target.value)}}
                            />
                        </Form.Group>
                      </td>

                      <td>
                        <Form.Group controlId="pobjeda" className="sredina">
                          <Form.Check name="pobjeda" 
                          value={r.pobjeda}
                          onChange={(e)=> {
                            r.pobjeda = e.target.checked}}
                          />
                        </Form.Group>
                      </td>

                      <td className="sredina">
                        <Button variant="danger" onClick={() => obrisiRed(index)}>
                          Delete
                        </Button>
                      </td>

                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr>
                  <td colSpan={4} className="sredina">
                    <Button variant="success" onClick={dodajRed}>
                      <IoIosAddCircleOutline /> Add player
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
              Return
            </Button>
          </Col>
          <Col xs={6} sm={12} md={9} lg={6} xl={6} xxl={6}>
            <Button variant="success" type="submit" className="siroko">
              <IoIosAddCircleOutline /> Add game
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
