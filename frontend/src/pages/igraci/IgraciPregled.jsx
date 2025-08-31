import { useEffect, useState } from "react";
import IgracService from "../../services/IgracService";
import {
  Button,
  Col,
  Container,
  Pagination,
  Row,
  Table,
  Form,
  Card,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL, RouteNames } from "../../constants";
import useError from "../../hooks/useError";
import useLoading from "../../hooks/useLoading";
import profilna from "../../assets/profilna.png";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function IgraciPregled() {
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const { prikaziError } = useError();

  const [igraci, setIgraci] = useState([]);
  const [stranica, setStranica] = useState(1);
  const [uvjet, setUvjet] = useState("");

  async function dohvatiIgrace() {
    showLoading();
    if (stranica < 1) {
      hideLoading();
      setUvjet("");
      return;
    }
    const odgovor = await IgracService.getStranicenje(stranica, uvjet);
    hideLoading();
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    if (odgovor.poruka.length == 0) {
      setStranica(stranica - 1);
      return;
    }
    setIgraci(odgovor.poruka);
  }

  useEffect(() => {
    dohvatiIgrace();
  }, [stranica, uvjet]);

  async function obrisiIgraca(sifra) {
    showLoading();
    const odgovor = await IgracService.obrisi(sifra);
    hideLoading();
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    dohvatiIgrace();
  }
  function obrisi(sifra) {
    if (!confirm("Sigurno obrisati?")) {
      return;
    }
    obrisiIgraca(sifra);
  }

  function promjeniUvjet(e) {
    if (e.nativeEvent.key == "Enter") {
      console.log("Enter");
      setStranica(1);
      setUvjet(e.nativeEvent.srcElement.value);
      setIgraci([]);
    }
  }

  function slika(igrac) {
    if (igrac.slika != null) {
      return BACKEND_URL + igrac.slika + `?${Date.now()}`;
    }
    return profilna;
  }

  function povecajStranicu() {
    setStranica(stranica + 1);
  }

  function smanjiStranicu() {
    if (stranica == 1) {
      return;
    }
    setStranica(stranica - 1);
  }

  return (
    <Container>
      <Row>
        <Col key={1} sm={12} md={4} lg={4}>
          <Form.Control
            type="text"
            name="trazilica"
            placeholder="Dio imena igrača [Enter]"
            maxLength={255}
            defaultValue=""
            onKeyUp={promjeniUvjet}
          />
        </Col>
        <Col key={2} sm={12} md={4} lg={4}>
          <Link to={RouteNames.IGRAC_NOVI} className="btn btn-success">
            + Dodaj
          </Link>
        </Col>
      </Row>

      <Row>
        {igraci &&
          igraci.map((i) => (
            <Col key={i.sifra} sm={12} md={2} lg={2}>
              <Card style={{ marginTop: "1rem" }}>
                <Card.Img variant="top" src={slika(i)} className="slika" />
                <Card.Body>
                  <Card.Title>{i.ime}</Card.Title>
                  <Row>
                    <Col key={1} xs={6}>
                      <Button
                        className="btn btn-info"
                        onClick={() => navigate(`/igrac/${i.sifra}`)}
                      >
                        Detalji
                      </Button>
                    </Col>
                    <Col key={2} xs={6}>
                      <Button variant="danger" onClick={() => obrisi(i.sifra)}>
                        Obriši
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>
      <hr />

      {igraci && igraci.length > 0 && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Pagination size="lg">
            <Pagination.Prev onClick={smanjiStranicu} />
            <Pagination.Item disabled>{stranica}</Pagination.Item>
            <Pagination.Next onClick={povecajStranicu} />
          </Pagination>
        </div>
      )}

      {/* <h2 className="sredina">Popis igrača</h2>
      <Link className="btn btn-success" to={RouteNames.IGRAC_NOVI}>
        + Dodaj igrača
      </Link>

      <hr />

      <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Ime</th>
              <th className="sredina akcije">Akcije</th>
            </tr>
          </thead>
          <tbody>
            {igraci &&
              igraci.map((igrac, index) => (
                <tr key={index}>
                  <td>{igrac.ime}</td>
                  <td className="sredina akcije">
                    <Button
                      variant="info"
                      onClick={() => navigate(`/igrac/${igrac.sifra}`)}
                    >
                      Detalji
                    </Button>

                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button
                      variant="danger"
                      onClick={() => obrisi(igrac.sifra)}
                    >
                      Obriši
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div> */}
    </Container>
  );
}
