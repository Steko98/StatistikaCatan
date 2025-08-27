import { Link, useNavigate } from "react-router-dom";
import IgracService from "../../services/IgracService";
import { RouteNames } from "../../constants";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import useError from "../../hooks/useError";
import useLoading from "../../hooks/useLoading";
import { useEffect } from "react";

export default function IgraciDodaj() {
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const { prikaziError } = useError();

  async function dodaj(e) {
    showLoading()
    const odgovor = await IgracService.dodaj(e);
    hideLoading()
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    navigate(RouteNames.IGRACI_PREGLED);
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
        <Form.Group controlId="ime">
          <Form.Label>Ime</Form.Label>
          <Form.Control type="text" name="ime" required />
        </Form.Group>

        <hr style={{ marginTop: "50px" }} />

        <Row>
          <Col xs={6} sm={6} md={3} lg={6} xl={6} xxl={6}>
            <Button onClick={() => navigate(-1)} className="btn btn-danger siroko">
              Povratak
            </Button>
          </Col>
          <Col xs={6} sm={6} md={9} lg={6} xl={6} xxl={6}>
            <Button variant="primary" type="submit" className="siroko">
              Dodaj igrača
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
