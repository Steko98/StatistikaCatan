import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import TurnirService from "../../services/TurnirService";
import moment from "moment";
import useError from "../../hooks/useError";
import useLoading from "../../hooks/useLoading";

export default function TurniriDodaj() {
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const { prikaziError } = useError();

  async function dodaj(turnir) {
    showLoading();
    const odgovor = await TurnirService.dodaj(turnir);
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

    dodaj({
      naziv: podaci.get("naziv"),
      datumPocetka: moment.utc(podaci.get("datumPocetka")),
      datumZavrsetka: moment.utc(podaci.get("datumZavrsetka")),
    });
  }

  return (
    <Container>
      <h2 className="sredina">Dodavanje turnira</h2>
      <Form onSubmit={odradiSubmit}>
        <Form.Group controlId="naziv">
          <Form.Label>Naziv</Form.Label>
          <Form.Control type="text" name="naziv" required />
        </Form.Group>

        <Form.Group controlId="datumPocetka">
          <Form.Label>Datum početka</Form.Label>
          <Form.Control type="date" name="datumPocetka" />
        </Form.Group>

        <Form.Group controlId="datumZavrsetka">
          <Form.Label>Datum završetka</Form.Label>
          <Form.Control type="date" name="datumZavrsetka" />
        </Form.Group>

        <hr style={{ marginTop: "50px" }} />

        <Row>
          <Col xs={6} sm={12} md={3} lg={6} xl={6} xxl={6}>
            <Link className="btn btn-danger siroko" to={RouteNames.TURNIR_PREGLED}>
              Povratak
            </Link>
          </Col>
          <Col xs={6} sm={6} md={9} lg={10} xl={6} xxl={6}>
            <Button variant="success" type="submit" className="siroko">
              Dodaj turnir
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
