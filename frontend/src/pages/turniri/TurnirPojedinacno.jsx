import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { RouteNames } from "../../constants";

import { Button, Col, Container, Row, Table, Form } from "react-bootstrap";
import { IoIosAddCircleOutline } from "react-icons/io";
import { TbArrowBackUp } from "react-icons/tb";

import moment from "moment";

import ZbirBodovaGraf from "../../components/grafovi/ZbirBodovaGraf";
import GrafTabovi from "../../components/grafovi/Tabovi";
import PostotakGraf from "../../components/grafovi/PostotakGraf";
import OdigraneGraf from "../../components/grafovi/OdigraneGraf";
import TablicaRekordi from "../../components/grafovi/TablicaRekordi";
import useLoading from "../../hooks/useLoading";
import useError from "../../hooks/useError";

import TurnirService from "../../services/TurnirService";
import IgraService from "../../services/IgraService";
import ClanService from "../../services/ClanService";
import IgracService from "../../services/IgracService";

export default function TurnirPojedinacno() {
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const { prikaziError } = useError();

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
    dohvatiIgrace();
  }, []);

  function formatirajDatum(datum) {
    if (datum == null) {
      return "Not defined";
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
    if (!confirm("Are you sure? This action CANNOT be undone!")) {
      return;
    }
    obrisiIgru(sifra);
  }

  const [igraci, setIgraci] = useState([]);
  const [redovi, setRedovi] = useState([]);

  function dodajRed() {
    redovi.push({
      sifraIgra: 0,
      sifraIgrac: igraci[0].sifra,
      brojBodova: 0,
      pobjeda: false,
    });
    setRedovi([...redovi]);
  }

  function obrisiRed(index) {
    redovi.splice(index, 1);
    setRedovi([...redovi]);
  }

  async function dohvatiIgrace() {
    showLoading();
    const odgovor = await IgracService.get();
    hideLoading();
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    setIgraci(odgovor.poruka);
  }

  async function dodajIgru(e) {
    showLoading();
    const odgovor = await IgraService.dodaj(e);
    hideLoading();
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    redovi.forEach((red) => {
      console.log(red);
      dodajClanove(
        odgovor.poruka.sifra,
        red.sifraIgrac,
        red.brojBodova,
        red.pobjeda
      );
    });
  }

  async function dodajClanove(sifraIgra, sifraIgrac, brojBodova, pobjeda) {
    showLoading();
    const odgovor = ClanService.dodaj({
      sifraIgra: sifraIgra,
      sifraIgrac: sifraIgrac,
      brojBodova: brojBodova,
      pobjeda: pobjeda,
    });
    hideLoading();
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
  }

  async function obradiSubmit(e) {
    e.preventDefault();

    const podaci = new FormData(e.target);

    await dodajIgru({
      datum: moment.utc(podaci.get("datum")),
      turnirSifra: parseInt(routeParams.sifra),
    });

    await dohvatiDetaljeTurnira();
    setRedovi([]);
  }

  return (
    <Container>
      <h2 className="sredina headers">{turnir.naziv}</h2>
      <hr />
      <h3 className="sredina headers">Stats</h3>
      <br />
      <Row className="d-flex align-items-center justify-content-center">
        {turnir.igre && <TablicaRekordi igre={turnir.igre} />}
      </Row>
      <br />
      <Row className="justify-content-center">
        <Col sm={12} md={12} lg={8}>
          <hr />
          <h3 className="sredina headers">Graphs</h3>
          <br />
          <div className="d-flex justify-content-center">
            <GrafTabovi onChange={setOdabraniGraf} />
          </div>
          <div className="mt-4 d-flex align-items-center">
            {odabraniGraf === "Percentage" && (
              <PostotakGraf igre={turnir.igre} />
            )}
            {odabraniGraf === "Total points" && (
              <ZbirBodovaGraf igre={turnir.igre} />
            )}
            {odabraniGraf === "Games played" && (
              <OdigraneGraf igre={turnir.igre} />
            )}
          </div>
        </Col>
      </Row>
      <br />
      <Row>
        <Col sm={12} md={12} lg={6} className="mb-3">
        <hr />
          <h3 className="sredina headers">Matches</h3>
          <br />
          <div
            style={{ maxHeight: "60vh", overflowY: "auto" }}
            className="scrollable"
          >
            <Table striped hover responsive bordered variant="dark">
              <thead>
                <tr>
                  <th className="sredina">#</th>
                  <th>Winner</th>
                  <th>Players</th>
                  <th className="sredina">Date</th>
                  <th className="sredina akcije"></th>
                </tr>
              </thead>
              <tbody>
                {turnir &&
                  turnir.igre &&
                  turnir.igre.map((igra, index) => (
                    <tr key={index}>
                      <td className="sredina">{index + 1}</td>
                      <td>
                        {igra.clanovi &&
                          igra.clanovi.find((c) => c.pobjeda)?.imeIgrac}
                      </td>
                      <td>
                        {igra.clanovi &&
                          igra.clanovi.map((c) => c.imeIgrac).join(", ")}
                      </td>
                      <td className="sredina">{formatirajDatum(igra.datum)}</td>
                      <td className="sredina akcije">
                        <Button
                          variant="info"
                          onClick={() =>
                            navigate(`/igra/${igra.sifra}`, {
                              state: { brojIgre: index + 1 },
                            })
                          }
                        >
                          Details
                        </Button>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button
                          variant="danger"
                          onClick={() => obrisi(igra.sifra)}
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
        <Col sm={12} md={12} lg={6}>
        <hr />
          <h3 className="sredina headers">Add match</h3>
          <br />
          <Form onSubmit={obradiSubmit}>
            <Row>
              <Form.Group controlId="datum">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  name="datum"
                  defaultValue={moment().format("YYYY-MM-DD")}
                  required
                />
              </Form.Group>
            </Row>

            <br />

            <Row>
              <Col sm={12} md={12} lg={12}>
                <Table striped bordered hover variant="dark">
                  <thead>
                    <tr>
                      <th>Player</th>
                      <th className="sredina">Points</th>
                      <th className="sredina">Win</th>
                      <th className="sredina"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {redovi &&
                      redovi.map((r, index) => (
                        <tr key={index}>
                          <td>
                            <Form.Group controlId="igrac">
                              <Form.Select
                                name="sifraIgrac"
                                onChange={(e) => {
                                  r.sifraIgrac = parseInt(e.target.value);
                                }}
                              >
                                {igraci &&
                                  igraci.map((i, index) => (
                                    <option key={index} value={i.sifra}>
                                      {i.ime}
                                    </option>
                                  ))}
                              </Form.Select>
                            </Form.Group>
                          </td>

                          <td
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <Form.Group controlId="brojBodova">
                              <Form.Control
                                type="number"
                                name="brojBodova"
                                style={{ width: "fit-content" }}
                                className="sredina"
                                onChange={(e) => {
                                  r.brojBodova = parseInt(e.target.value);
                                }}
                              />
                            </Form.Group>
                          </td>

                          <td>
                            <Form.Group controlId="pobjeda" className="sredina">
                              <Form.Check
                                name="pobjeda"
                                value={r.pobjeda}
                                onChange={(e) => {
                                  r.pobjeda = e.target.checked;
                                }}
                              />
                            </Form.Group>
                          </td>

                          <td className="sredina">
                            <Button
                              variant="danger"
                              onClick={() => obrisiRed(index)}
                            >
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

          

            <Button variant="success" type="submit" className="siroko">
              <IoIosAddCircleOutline /> Add game
            </Button>
          </Form>
        </Col>
      </Row>
      <hr />

      <Link className="btn btn-danger siroko mb-4" to={RouteNames.TURNIR_PREGLED}>
        <TbArrowBackUp /> Return
      </Link>

    </Container>
  );
}
