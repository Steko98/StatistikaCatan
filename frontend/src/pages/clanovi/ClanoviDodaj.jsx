import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Row, Col, Form } from "react-bootstrap";
import Service from "../../services/ClanService";
import IgracService from "../../services/IgracService";
import IgraService from "../../services/IgraService";
import { RouteNames } from "../../constants";
import useError from "../../hooks/useError";
import useLoading from "../../hooks/useLoading";

export default function ClanoviDodaj() {
  const routeParams = useParams();
  const sifra = parseInt(routeParams.sifra);
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const { prikaziError } = useError();


  const [igraci, setIgraci] = useState([]);
  const [igracSifra, setIgracSifra] = useState(0);
  const [igre, setIgre] = useState([]);
  const [sifraIgra, setIgraSifra] = useState(sifra);

  async function dohvatiIgrace() {
    showLoading();
    const odgovor = await IgracService.getIgraciZaIgru(sifra);
    hideLoading();
        if (odgovor.greska) {
      prikaziError(odgovor.poruka)
      return
    }
    setIgraci(odgovor.poruka);
    setIgracSifra(odgovor.poruka[0].sifra);
  }

  

  useEffect(() => {
    dohvatiIgrace();
  }, []);

  async function dodaj(e) {
    showLoading();
    const odgovor = await Service.dodaj(e);
    hideLoading();
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    navigate(`/igra/${sifra}`);
  }

  function obradiSubmit(e) {
    e.preventDefault();

    const podaci = new FormData(e.target);

    dodaj({
      brojBodova: parseInt(podaci.get("brojBodova")),
      pobjeda: podaci.get("pobjeda") == "on" ? true : false,
      sifraIgrac: igracSifra,
      sifraIgra: sifra,
    });
  }

  return (
    <>
      <h2 className="sredina">Dodavanje igrača</h2>
      <Form onSubmit={obradiSubmit}>
        <Form.Group className="mb-3" controlId="igrac">
          <Form.Label>Igrač</Form.Label>
          <Form.Select
            name="sifraIgrac"
            onChange={(e) => {
              setIgracSifra(e.target.value);
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


        <Form.Group controlId="brojBodova">
          <Form.Label>Broj bodova</Form.Label>
          <Form.Control type="number" name="brojBodova" />
        </Form.Group>

        <Form.Group controlId="pobjeda">
          <Form.Check label="Pobjeda" name="pobjeda" />
        </Form.Group>

        <hr style={{ marginTop: "50px" }} />

        <Row>
          <Col xs={6} sm={12} md={3} lg={6} xl={6} xxl={6}>
            <Button
              className="btn btn-danger"
              onClick={() => navigate(`/igra/${sifra}`)}
            >
              Povratak
            </Button>
          </Col>
          <Col xs={6} sm={6} md={9} lg={10} xl={6} xxl={6}>
            <Button variant="success" type="submit">
              Dodaj člana
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
