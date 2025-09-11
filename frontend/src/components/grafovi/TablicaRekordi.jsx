import { Col, Row, Table } from "react-bootstrap";
import { useEffect, useState } from "react";

export default function TablicaRekordi({ igre }) {
  const [rekordi, setRekordi] = useState(null);
  const [podaciTablice, setPodaci] = useState(null);

  useEffect(() => {
    if (!igre || igre.length === 0) {
      setRekordi([]);
      return;
    }
    const podaci = pripremiPodatke(igre);
    const sviRekordi = izvuciRekorde(podaci);
    setPodaci(Object.values(podaci));
    setRekordi(sviRekordi);
  }, [igre]);

  function pripremiPodatke(igre) {
    const podaci = {};

    igre.forEach((igra) => {
      igra.clanovi.forEach((clan) => {
        const sifra = clan.sifraIgrac;
        if (!podaci[sifra]) {
          podaci[sifra] = {
            sifra,
            ime: clan.imeIgrac,
            odigrano: 0,
            pobjeda: 0,
            bodovi: 0,
            postotakPobjeda: 0,
            prosjekBodova: 0,
            niz: 0,
            najduziNiz: 0,
          };
        }

        podaci[sifra].odigrano += 1;
        podaci[sifra].bodovi += clan.brojBodova;

        if (clan.pobjeda) {
          podaci[sifra].pobjeda += 1;
          podaci[sifra].niz += 1;
          podaci[sifra].najduziNiz = Math.max(
            podaci[sifra].najduziNiz,
            podaci[sifra].niz
          );
        } else {
          podaci[sifra].niz = 0;
        }
      });
    });

    Object.values(podaci).forEach((igrac) => {
      igrac.postotakPobjeda =
        Math.round((igrac.pobjeda / igrac.odigrano) * 10000) / 100;
      igrac.prosjekBodova =
        Math.round((igrac.bodovi / igrac.odigrano) * 100) / 100;
    });

    return podaci;
  }

  function izvuciRekorde(podaci) {
    const igraci = Object.values(podaci);

    if (igraci.length === 0) {
    return {
      najviseOdigranih: null,
      najvisePobjeda: null,
      najboljiPostotak: null,
      najduziNizPobjeda: null,
      najviseBodova: null,
      najveciProsjek: null,
    };
  }

    return {
      najviseOdigranih: igraci.reduce((a, b) =>
        a.odigrano > b.odigrano ? a : b
      ),
      najvisePobjeda: igraci.reduce((a, b) => (a.pobjeda > b.pobjeda ? a : b)),
      najboljiPostotak: igraci.reduce((a, b) =>
        a.postotakPobjeda > b.postotakPobjeda ? a : b
      ),
      najduziNizPobjeda: igraci.reduce((a, b) =>
        a.najduziNiz > b.najduziNiz ? a : b
      ),
      najviseBodova: igraci.reduce((a, b) => (a.bodovi > b.bodovi ? a : b)),
      najveciProsjek: igraci.reduce((a, b) =>
        a.prosjekBodova > b.prosjekBodova ? a : b
      ),
    };
  }

  return (
    <Row>
      <Col sm={12} md={6} lg={6}>
        <h4 className="headers">Leaderboard</h4>
        <div style={{ overflow: "visible"}}>
        <Table bordered hover striped variant="dark">
          <thead>
            <tr>
              <th>Player</th>
              <th className="sredina">Played</th>
              <th className="sredina">Wins</th>
              <th className="sredina">Percentage %</th>
            </tr>
          </thead>
          <tbody>
            {podaciTablice &&
              podaciTablice.map((igrac, index) => (
                <tr key={index}>
                  <td>{igrac.ime}</td>
                  <td className="sredina">{igrac.odigrano}</td>
                  <td className="sredina">{igrac.pobjeda}</td>
                  <td className="sredina">{igrac.postotakPobjeda}</td>
                </tr>
              ))}
          </tbody>
        </Table>
        </div>
      </Col>
      
      <Col sm={12} md={6} lg={6}>
        <h4 className="headers">Records</h4>
        <div style={{ overflow: "visible"}}>
        <Table striped hover bordered variant="dark">
          <thead>
            <tr>
              <th></th>
              <th className="sredina">Score</th>
              <th className="desno">Player</th>
            </tr>
          </thead>
          <tbody>
            {rekordi ? (
              <>
                <tr>
                  <th>Most games</th>
                  <td className="sredina">
                    {rekordi.najviseOdigranih?.odigrano ?? "-"}
                  </td>
                  <td className="desno">{rekordi.najviseOdigranih?.ime ?? "-"}</td>
                </tr>
                <tr>
                  <th>Most wins</th>
                  <td className="sredina">{rekordi.najvisePobjeda?.pobjeda ?? "-"}</td>
                  <td className="desno">{rekordi.najvisePobjeda?.ime ?? "-"}</td>
                </tr>
                <tr>
                  <th>Highest win percentage</th>
                  <td className="sredina">
                    {rekordi.najboljiPostotak?.postotakPobjeda ?? "-"}
                  </td>
                  <td className="desno">{rekordi.najboljiPostotak?.ime ?? "-"}</td>
                </tr>
                <tr>
                  <th>Longest win streak</th>
                  <td className="sredina">
                    {rekordi.najduziNizPobjeda?.najduziNiz ?? "-"}
                  </td>
                  <td className="desno">{rekordi.najduziNizPobjeda?.ime ?? "-"}</td>
                </tr>
                <tr>
                  <th>Most points</th>
                  <td className="sredina">{rekordi.najviseBodova?.bodovi ?? "-"}</td>
                  <td className="desno">{rekordi.najviseBodova?.ime ?? "-"}</td>
                </tr>
                <tr>
                  <th>Highest point average</th>
                  <td className="sredina">
                    {rekordi.najveciProsjek?.prosjekBodova ?? "-"}
                  </td>
                  <td className="desno">{rekordi.najveciProsjek?.ime ?? "-"}</td>
                </tr>
              </>
            ) : (
              <tr>
                <td className="sredina" colSpan={3}>
                  Nema rezultata
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        </div>
      </Col>
    </Row>
  );
}
