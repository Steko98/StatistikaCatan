import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Container,
  Table,
  Form,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import { FaFaceSmileWink } from "react-icons/fa6";
import { FaSadTear } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
import { TbArrowBackUp } from "react-icons/tb";
import { TfiSave } from "react-icons/tfi";
import IgraService from "../../services/IgraService";
import ClanService from "../../services/ClanService";
import TurnirService from "../../services/TurnirService";
import { RouteNames } from "../../constants";
import moment from "moment";
import useError from "../../hooks/useError";
import useLoading from "../../hooks/useLoading";
import IgracService from "../../services/IgracService";

export default function IgraPojedinacno() {
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const { prikaziError } = useError();
  const routeParams = useParams();
  const location = useLocation();

  const [clanovi, setClanovi] = useState([]);
  const [igra, setIgra] = useState({});
  const [datum, setDatum] = useState("");
  const [turnir, setTurnir] = useState({});
  const [show, setShow] = useState(false);
  const [igraciZaIgru, setIgraciZaIgru] = useState([]);
  const [igracSifra, setIgracSifra] = useState(0);
  const brojIgre = location.state?.brojIgre;

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
    setDatum(igra.datum);
    setIgra(igra);
    dohvatiTurnir(igra.turnirSifra);
  }

  async function dohvatiTurnir(sifraTurnira) {
    showLoading();
    const odgovor = await TurnirService.getBySifra(sifraTurnira);
    hideLoading();
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    setTurnir(odgovor.poruka);
  }

  async function dohvatiIgrace() {
    showLoading();
    const odgovor = await IgracService.getIgraciZaIgru(routeParams.sifra);
    hideLoading();
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    setIgraciZaIgru(odgovor.poruka);
    setIgracSifra(odgovor.poruka[0].sifra);
  }

  useEffect(() => {
    dohvatiIgru();
    dohvatiDetaljeIgre();
    dohvatiIgrace();
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
    dohvatiIgrace();
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
    setShow(true);
  }

  async function promjenaBodova(idIgra, idIgrac, bodovi) {
    const odgovor = await ClanService.promjeniBodove(idIgra, idIgrac, bodovi);
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
  }

  async function promjenaPobjede(idIgra, idIgrac, pobjeda) {
    const odgovor = await ClanService.promjeniPobjeda(idIgra, idIgrac, pobjeda);
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    dohvatiDetaljeIgre();
  }

  async function dodajIgraca(e) {
    showLoading();
    const odgovor = await ClanService.dodaj(e);
    hideLoading();
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }

    dohvatiDetaljeIgre();
    dohvatiIgrace();
  }

  function obradiSubmit(e) {
    e.preventDefault();

    const podaci = new FormData(e.target);

    dodajIgraca({
      brojBodova: parseInt(podaci.get("brojBodova")),
      pobjeda: podaci.get("pobjeda") == "on" ? true : false,
      sifraIgrac: igracSifra,
      sifraIgra: routeParams.sifra,
    });
  }

  function popupAlert() {
    if (show) {
      return (
        <Alert variant="success" onClose={() => setShow(false)} dismissible>
          <Alert.Heading>Date change successful!</Alert.Heading>
        </Alert>
      );
    }
  }

  return (
    <Container>
      <h2 className="sredina headers">
        {turnir.naziv} - Game #{brojIgre ?? routeParams.sifra}
      </h2>
      <hr />
      <div
        style={{ maxHeight: "60vh", overflowY: "auto" }}
        className="scrollable"
      >
        <Table striped bordered responsive hover variant="dark">
          <thead>
            <tr>
              <th>Player</th>
              <th className="sredina">Points</th>
              <th className="sredina">Win</th>
              <th className="sredina akcije"></th>
            </tr>
          </thead>
          <tbody>
            {clanovi &&
              clanovi.map((clan, index) => (
                <tr key={index}>
                  <td>{clan.imeIgrac}</td>

                  <td style={{ textAlign: "center" }}>
                    <Form.Group controlId="bodovi">
                      <Form.Control
                        type="number"
                        name="bodovi"
                        defaultValue={clan.brojBodova}
                        onChange={(e) =>
                          promjenaBodova(
                            clan.sifraIgra,
                            clan.sifraIgrac,
                            e.target.value
                          )
                        }
                        required
                        step={1}
                        className="sredina"
                        style={{ display: "inline-block", width: "auto" }}
                      />
                    </Form.Group>
                  </td>

                  <td className="sredina">
                    <span
                      style={{ display: "inline-block", marginRight: "5px" }}
                    >
                      <FaSadTear color="red" />
                    </span>
                    <span
                      style={{ display: "inline-block", marginRight: "5px" }}
                    >
                      <Form.Check
                        type="switch"
                        checked={clan.pobjeda}
                        onChange={(e) =>
                          promjenaPobjede(
                            clan.sifraIgra,
                            clan.sifraIgrac,
                            e.target.checked
                          )
                        }
                      />
                    </span>
                    <span>
                      <FaFaceSmileWink color="green" />
                    </span>
                  </td>

                  <td className="sredina akcije">
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button variant="danger" onClick={() => obrisi(clan.sifra)}>
                      Delete player
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>

          <tfoot>
            <tr>
              <th>Date</th>
              <td className="sredina" colSpan={2}>
                <Form.Group controlId="datum">
                  <Form.Control
                    className="sredina"
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
                  className="btn btn-warning siroko"
                  onClick={() => promjenaDatuma()}
                >
                  <TfiSave /> Save date change
                </Button>
              </td>
            </tr>
          </tfoot>
        </Table>
        {show && (
          <Alert variant="success" onClose={() => setShow(false)} dismissible>
            <p>Date change successful!</p>
          </Alert>
        )}
      </div>
      <br />
      <h5 className="sredina headers">Add player</h5>
      <br />
      <Form onSubmit={obradiSubmit}>
        <Row className="align-items-end">
          <Col key={1} sm={12} md={4} lg={4}>
            <Form.Group controlId="igrac">
              <Form.Label>Player</Form.Label>
              <Form.Select
                name="sifraIgrac"
                onChange={(e) => {
                  setIgracSifra(e.target.value);
                }}
              >
                {igraciZaIgru &&
                  igraciZaIgru.map((i, index) => (
                    <option key={index} value={i.sifra}>
                      {i.ime}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col key={2} sm={12} md={4} lg={4}>
            <Form.Group controlId="brojBodova">
              <Form.Label>Points</Form.Label>
              <Form.Control
                type="number"
                name="brojBodova"
                required
                step={1}
                className="sredina"
              />
            </Form.Group>
          </Col>
          <Col key={3} sm={12} md={2} lg={1}>
            <Form.Group className="mb-2" controlId="pobjeda">
              <Form.Check label="Win" name="pobjeda" />
            </Form.Group>
          </Col>
          <Col key={4} sm={12} md={2} lg={3}>
            <Button variant="success" type="submit" className="siroko">
              <IoIosAddCircleOutline /> Add player
            </Button>
          </Col>
        </Row>
      </Form>
      <hr />
      <Button
        className="btn btn-danger siroko"
        onClick={() => navigate(-1)}
        style={{ marginBottom: "20px" }}
      >
        <TbArrowBackUp /> Return
      </Button>
    </Container>
  );
}
