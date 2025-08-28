import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import TurnirService from "../../services/TurnirService";
import moment from "moment";
import { useEffect, useState } from "react";
import useError from "../../hooks/useError";
import useLoading from "../../hooks/useLoading";

export default function TurniriPromjeni() {
  const navigate = useNavigate();
  const routeParams = useParams();
  const { showLoading, hideLoading } = useLoading();
  const { prikaziError } = useError();

  const [turnir, setTurnir] = useState({});

  async function ucitajTurnir() {
    showLoading();
    const odgovor = await TurnirService.getBySifra(routeParams.sifra);
    hideLoading();
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    let s = odgovor.poruka;
    s.datumPocetka = moment.utc(s.datumPocetka).format("YYYY-MM-DD");
    s.datumZavrsetka = moment.utc(s.datumZavrsetka).format("YYYY-MM-DD");
    setTurnir(s);
  }

  useEffect(() => {
    ucitajTurnir();
  }, []);

  async function promjeni(turnir) {
    showLoading();
    const odgovor = await TurnirService.promjeni(routeParams.sifra, turnir);
    hideLoading();
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    navigate(RouteNames.TURNIR_PREGLED);
  }

  function odradiSubmit(e) {
    e.preventDefault();

    let podaci = new FormData(e.target);

    promjeni({
      naziv: podaci.get("naziv"),
      datumPocetka: moment.utc(podaci.get("datumPocetka")),
      datumZavrsetka: moment.utc(podaci.get("datumZavrsetka")),
    });
  }

  return (
    <Container>
      <Form onSubmit={odradiSubmit}>
        <Form.Group controlId="naziv">
          <Form.Label>Naziv</Form.Label>
          <Form.Control
            type="text"
            name="naziv"
            required
            defaultValue={turnir.naziv}
          />
        </Form.Group>

        <Form.Group controlId="datumPocetka">
          <Form.Label>Datum početka</Form.Label>
          <Form.Control
            type="date"
            name="datumPocetka"
            defaultValue={turnir.datumPocetka}
          />
        </Form.Group>

        <Form.Group controlId="datumZavrsetka">
          <Form.Label>Datum završetka</Form.Label>
          <Form.Control
            type="date"
            name="datumZavrsetka"
            defaultValue={turnir.datumZavrsetka}
          />
        </Form.Group>

        <hr style={{ marginTop: "50px" }} />

        <Row>
          <Col xs={6} sm={12} md={3} lg={6} xl={6} xxl={6}>
            <Link className="btn btn-danger siroko" to={RouteNames.TURNIR_PREGLED}>
              Povratak
            </Link>
          </Col>
          <Col xs={6} sm={12} md={9} lg={6} xl={6} xxl={6}>
            <Button variant="success" type="submit" className="siroko">
              Spremi promjene
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
