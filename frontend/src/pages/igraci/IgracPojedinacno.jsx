import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import IgracService from "../../services/IgracService";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import { BACKEND_URL, RouteNames } from "../../constants";
import { FaFaceSmileWink } from "react-icons/fa6";
import { FaSadTear } from "react-icons/fa";
import { FaUserEdit } from "react-icons/fa";
import { TbArrowBackUp } from "react-icons/tb";
import ClanService from "../../services/ClanService";
import useError from "../../hooks/useError";
import useLoading from "../../hooks/useLoading";
import profilna from "../../assets/profilna.svg";

export default function IgracPojedinacno() {
  const navigate = useNavigate();
  const routeParams = useParams();
  const { showLoading, hideLoading } = useLoading();
  const { prikaziError } = useError();
  const [clanovi, setClanovi] = useState([]);
  const [igrac, setIgrac] = useState({});
  const [podaci, setPodaci] = useState([]); 

  async function dohvatiIgreIgraca() {
    showLoading();
    const odgovor = await IgracService.getIgre(routeParams.sifra);
    hideLoading();
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    setClanovi(odgovor.poruka);
    pripremiPodatke(odgovor.poruka);
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
    if (!confirm("Are you sure? This action CANNOT be undone!")) {
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

  function pripremiPodatke(igre) {
    const statistika = {
      odigrano:0,
      pobjede: 0,
      postotak: 0,
      bodovi: 0,
      prosjekBodova: 0,
      winStreak: 0,
      longestWinStreak: 0,
      loseStreak: 0,
      longestLoseStreak: 0
      };

    igre.forEach(igra => {
      statistika.odigrano += 1;
      if(igra.pobjeda == true){
        statistika.pobjede += 1;
        statistika.winStreak += 1;
        statistika.longestWinStreak = Math.max(statistika.longestWinStreak,statistika.winStreak)
        statistika.loseStreak = 0;        
      } else {
        statistika.loseStreak += 1;
        statistika.longestLoseStreak = Math.max(statistika.longestLoseStreak,statistika.loseStreak)       
        statistika.winStreak = 0;         
      }
      statistika.bodovi += igra.brojBodova
    });

    statistika.postotak = statistika.odigrano > 0 ? ((statistika.pobjede / statistika.odigrano) * 100).toFixed(2) : "0.00";
    statistika.prosjekBodova = statistika.odigrano > 0 ? (statistika.bodovi / statistika.odigrano).toFixed(2) : "0.00";

    setPodaci(statistika);
  }

  return (
    <Container>
      <h2 className="sredina headers">Player profile - {igrac.ime}</h2>

      <hr />
      <Row className="d-flex align-items-center justify-content-center">
        <Col key="1" xs={6} sm={5} md={4} lg={3} xl={2}>
          <Card style={{ marginTop: "1rem" }} className="dark-card profil">
            <Card.Img variant="top" src={slika(igrac)} className="slika" />
            <Card.Body className="text-center">
              <Card.Title className="sredina imena">{igrac.ime}</Card.Title>
              <Link
                className="btn btn-warning"
                to={`/igraci/${routeParams.sifra}`}
              >
                Edit <FaUserEdit />
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col key={2} md={8} lg={4}>
          <Table bordered hover striped variant="dark">
            <tbody>
              <tr>
                <th>Matches played</th>
                <td className="sredina">{podaci.odigrano}</td>
              </tr>
              <tr>
                <th>Matches won</th>
                <td className="sredina">{podaci.pobjede}</td>
              </tr>
              <tr>
                <th>Win %</th>
                <td className="sredina">{podaci.postotak}</td>
              </tr>
              <tr>
                <th>Total points</th>
                <td className="sredina">{podaci.bodovi}</td>
              </tr>
              <tr>
                <th>Match point avg.</th>
                <td className="sredina">{podaci.prosjekBodova}</td>
              </tr>
              <tr>
                <th>Longest win streak</th>
                <td className="sredina">{podaci.longestWinStreak}</td>
              </tr>
              <tr>
                <th>Longest losing streak</th>
                <td className="sredina">{podaci.longestLoseStreak}</td>
              </tr>
            </tbody>
          </Table>
        </Col>

        <Col key={3} sm={12} md={12} lg={5}>
          <div
            style={{ maxHeight: "50vh", overflowY: "auto" }}
            className="scrollable"
          >
            <Table bordered hover responsive striped variant="dark">
              <thead>
                <tr>
                  <th className="sredina">Game ID</th>
                  <th className="sredina">Points</th>
                  <th className="sredina">Win</th>
                  <th className="sredina akcije"></th>
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
                          <FaFaceSmileWink size={25} color="green" />
                        ) : (
                          <FaSadTear size={25} color="red" />
                        )}
                      </td>
                      <td className="sredina akcije">
                        <Button
                          className="btn btn-info"
                          onClick={() => navigate(`/igra/${clan.sifraIgra}`)}
                        >
                          Details
                        </Button>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button
                          className="btn btn-danger"
                          onClick={() => obrisiClana(clan.sifra)}
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
      </Row>
      <hr />
      <Link className="btn btn-danger siroko mb-3" to={-1}>
        <TbArrowBackUp /> Return
      </Link>
    </Container>
  );
}
