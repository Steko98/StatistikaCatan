import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import IgracService from "../../services/IgracService";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import { BACKEND_URL, RouteNames } from "../../constants";
import { GiPodiumWinner } from "react-icons/gi";
import { FaSadTear } from "react-icons/fa";
import { FaUserEdit } from "react-icons/fa";
import ClanService from "../../services/ClanService";
import useError from "../../hooks/useError";
import useLoading from "../../hooks/useLoading";
import profilna from "../../assets/profilna.png";

export default function IgracPojedinacno() {
  const navigate = useNavigate();
  const routeParams = useParams();
  const { showLoading, hideLoading } = useLoading();
  const { prikaziError } = useError();
  const [clanovi, setClanovi] = useState([]);
  const [igrac, setIgrac] = useState({});

  async function dohvatiIgreIgraca() {
    showLoading();
    const odgovor = await IgracService.getIgre(routeParams.sifra);
    hideLoading();
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    setClanovi(odgovor.poruka);
  }

  async function dohvatiIgraca() {
    showLoading();
    const odgovor = await IgracService.getBySifra(routeParams.sifra);
    hideLoading();
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    setIgrac(odgovor.poruka);
  }

  useEffect(() => {
    dohvatiIgreIgraca();
    dohvatiIgraca();
  }, []);

  async function asyncObrisiClana(sifra) {
    showLoading();
    const odgovor = await ClanService.obrisi(sifra);
    hideLoading();
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    dohvatiIgreIgraca();
  }
  function obrisiClana(sifra) {
    if (!confirm("Sigurno obrisati?")) {
      return;
    }
    asyncObrisiClana(sifra);
  }

  function slika(igrac) {
    if (igrac.slika != null) {
      return BACKEND_URL + igrac.slika + `?${Date.now()}`;
    }
    return profilna;
  }

  return (
    <Container>
      <h2 className="sredina">Pregled igrača - {igrac.ime}</h2>

      <hr />
      <Row>
        <Col key="1" sm={12} lg={3} md={3}>
          <Card style={{ marginTop: "1rem" }} >
            <Card.Img variant="top" src={slika(igrac)} className="slika" />
            <Card.Body className="text-center">
              <Card.Title className="sredina">{igrac.ime}</Card.Title>
              <Link
                className="btn btn-warning"
                to={`/igraci/${routeParams.sifra}`}
              >
                Uredi <FaUserEdit />
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col key="2" sm={12} lg={9} md={9}>
          <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
            <Table bordered hover responsive striped>
              <thead>
                <tr>
                  <td className="sredina">Šifra igre</td>
                  <td className="sredina">Broj bodova</td>
                  <td className="sredina">Pobjeda</td>
                  <td className="sredina akcije">Akcije</td>
                </tr>
              </thead>
              <tbody>
                {clanovi &&
                  clanovi.map((clan, index) => (
                    <tr key={index}>
                      <td className="sredina">{clan.sifraIgra}</td>
                      <td className="sredina">{clan.brojBodova}</td>
                      <td className="sredina">
                        {clan.pobjeda ? (
                          <GiPodiumWinner size={35} color="green" />
                        ) : (
                          <FaSadTear size={25} color="red" />
                        )}
                      </td>
                      <td className="sredina akcije">
                        <Button
                          className="btn btn-info"
                          onClick={() => navigate(`/igra/${clan.sifraIgra}`)}
                        >
                          Detalji igre
                        </Button>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button
                          className="btn btn-danger"
                          onClick={() => obrisiClana(clan.sifra)}
                        >
                          Obriši
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
      <hr />
            <Link className="btn btn-danger siroko" to={-1}>
        Povratak
      </Link>
    </Container>
  );
}
