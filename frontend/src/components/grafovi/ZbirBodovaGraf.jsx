import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TurnirService from "../../services/TurnirService";
import useError from "../../hooks/useError"
import useLoading from "../../hooks/useLoading"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ZbirBodovaGraf() {
  const routeParams = useParams();
  const [grafPodaci, setGrafPodaci] = useState([]);
  const { showLoading, hideLoading } = useLoading();
  const { prikaziError } = useError();

  const [igraci, setIgraci] = useState([]);
  const [turnir, setTurnir] = useState({});

  async function dohvatiDetaljeTurnira() {
    showLoading();
    const odgovor = await TurnirService.getDetaljiTurnir(routeParams.sifra);
    hideLoading();
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    setTurnir(odgovor.poruka);

    const igre = odgovor.poruka.igre || [];
    const { podaci, igraci } = pripremiPodatke(igre);
    setGrafPodaci(podaci);
    setIgraci(igraci);
  }

  useEffect(() => {
    dohvatiDetaljeTurnira();
  }, []);

  function pripremiPodatke(igre) {
    const igraciSet = new Set();
    igre.forEach((igra) => {
      igra.clanovi.forEach((clan) => {
        igraciSet.add(clan.imeIgrac);
      });
    });

    const igraci = Array.from(igraciSet);
    const zbirBodova = {};
    igraci.forEach((igrac) => {
      zbirBodova[igrac] = 0;
    });

    const podaci = igre.map((igra, index) => {
      const brojIgre = index + 1;
      igra.clanovi.forEach((clan) => {
        const igracIme = clan.imeIgrac;
        const bodovi = clan.brojBodova || 0;
        zbirBodova[igracIme] += bodovi;
      });

      const igraPodaci = { igra: brojIgre };
      igraci.forEach((igrac) => {
        igraPodaci[igrac] = zbirBodova[igrac];
      });

      return igraPodaci;
    });

    return { podaci, igraci };
  }

  return (
    <>
      {grafPodaci.length > 0 && (
        <>
          <div style={{ width: "100%", height: 400 }}>
            <ResponsiveContainer>
              <LineChart
                data={grafPodaci}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="igra"
                  label={{
                    value: "Broj igre",
                    position: "insideBottom",
                    offset: -5,
                  }}
                />
                <YAxis
                  label={{
                    value: "Bodovi",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Legend />
                {igraci.map((ime, i) => (
                  <Line
                    key={ime}
                    type="monotone"
                    dataKey={ime}
                    stroke={`hsl(${i * 60}, 70%, 50%)`}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </>
  );
}
