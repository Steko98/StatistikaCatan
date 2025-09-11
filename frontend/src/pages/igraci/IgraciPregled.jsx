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
import profilna from "../../assets/profilna.svg";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoSearchSharp } from "react-icons/io5";
import { TbArrowBackUp } from "react-icons/tb";

export default function IgraciPregled() {
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const { prikaziError } = useError();

  const [igraci, setIgraci] = useState([]);
  const [stranica, setStranica] = useState(1);
  const [uvjet, setUvjet] = useState("");
  const [inputUvjet, setInputUvjet] = useState("");

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
    if (!confirm("Are you sure? This action CANNOT be undone and will remove this player from all matches and tournaments!")) {
      return;
    }
    obrisiIgraca(sifra);
    dohvatiIgrace()
  }

  function promjeniUvjet(e) {
    if (e.nativeEvent.key == "Enter") {
      console.log("Enter");
      setStranica(1);
      setUvjet(e.nativeEvent.srcElement.value);
      setIgraci([]);
    }
  }

  function trazi(e) {
    setStranica(1);
    setUvjet(e.nativeEvent.srcElement.value);
    setIgraci([]);
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

  function handleInputChange(e) {
    setInputUvjet(e.target.value);
  }

  function searchClick() {
    setStranica(1);
    setUvjet(inputUvjet);
    setIgraci([]);
  }

  async function dodaj(e) {
    showLoading();
    const odgovor = await IgracService.dodaj(e);
    hideLoading();
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }

    dohvatiIgrace();
  }

  function obradiSubmit(e) {
    e.preventDefault();

    const podaci = new FormData(e.target);

    dodaj({
      ime: podaci.get("ime"),
    });
  }

  return (
    <Container>

      <Form onSubmit={obradiSubmit}>
        <Row className="d-flex align-items-center justify-content-center mb-3">
          <h3 className="sredina headers mb-3">Create new player</h3>
          <Col sm={12} md={8} lg={4}>
            <Form.Group controlId="ime">
              <Form.Control
                type="text"
                name="ime"
                placeholder="name"
                required
              />
            </Form.Group>
          </Col>
          <Col sm={12} md={4} lg={3}>
            <Button variant="success" type="submit" className="siroko mt-2 mb-2">
              <IoIosAddCircleOutline /> Add player
            </Button>
          </Col>
        </Row>
      </Form>
      <hr />
      <h2 className="sredina headers">Player list</h2>

      <Row className="d-flex align-items-center">
        <Col key={1} sm={8} md={8} lg={4}>
          <Form.Control
            type="text"
            name="trazilica"
            placeholder="Type something"
            maxLength={255}
            value={inputUvjet}
            onChange={handleInputChange}
            onKeyUp={promjeniUvjet}
          />
        </Col>
        <Col key={2} sm={4} md={4} lg={4}>
          <Button className="btn btn-success mt-2 mb-2" onClick={searchClick}>
            <IoSearchSharp /> Search
          </Button>
        </Col>
      </Row>
      <Row className="d-flex justify-content-center">
        {igraci &&
          igraci.map((i) => (
            <Col key={i.sifra} sm={5} md={4} lg={3} xl={2}>
              <Card style={{ marginTop: "1rem" }} className="dark-card">
                <Card.Img variant="top" src={slika(i)} className="slika" />
                <Card.Body>
                  <Card.Title className="imena sredina">{i.ime}</Card.Title>
                  <Row>
                    <Col key={1} xs={6} className="d-flex justify-content-center">
                      <Button
                        className="btn btn-info"
                        onClick={() => navigate(`/igrac/${i.sifra}`)}
                      >
                        Details
                      </Button>
                    </Col>
                    <Col key={2} xs={6} className="d-flex justify-content-center">
                      <Button variant="danger" onClick={() => obrisi(i.sifra)}>
                        Delete
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>
      <br />

      {igraci && igraci.length > 0 && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Pagination size="lg" className="my-pagination">
            <Pagination.Prev onClick={smanjiStranicu} />
            <Pagination.Item disabled>{stranica}</Pagination.Item>
            <Pagination.Next onClick={povecajStranicu} />
          </Pagination>
        </div>
      )}

      <hr />
      <Row className="d-flex justify-content-center">
      <Col sm={12} md={6} lg={6}>
      <Button
        onClick={() => navigate(-1)}
        className="btn btn-danger siroko mb-3">
        <TbArrowBackUp /> Return
      </Button>
      </Col>
      </Row>
    </Container>
  );
}
