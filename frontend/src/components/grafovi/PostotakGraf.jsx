import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function PostotakGraf({igre}) {
  const [grafPodaci, setGrafPodaci] = useState([]);
  const [igraci, setIgraci] = useState([]);


  useEffect(() => {
    if (!igre || igre.length === 0) {
      setGrafPodaci([]);
      setIgraci([]);
      return;
    }
    const { podaci, igraci } = pripremiPodatke(igre);
    setGrafPodaci(podaci);
    setIgraci(igraci);
  }, [igre]);

  function pripremiPodatke(igre) {
    const igraciSet = new Set();
    igre.forEach((igra) => {
      igra.clanovi.forEach((clan) => {
        igraciSet.add(clan.imeIgrac);
      });
    });

    const igraci = Array.from(igraciSet);
    const brojIgara = {};
    const brojPobjeda = {};
    igraci.forEach((igrac) => {
      brojIgara[igrac] = 0;
      brojPobjeda[igrac] = 0;
    });

    const podaci = igre.map((igra, index) => {
      const brojIgre = index + 1;
      igra.clanovi.forEach((clan) => {
        const igracIme = clan.imeIgrac;
        brojIgara[igracIme] += 1;
        if (clan.pobjeda) {
          brojPobjeda[igracIme] += 1;
        }
      });

      const igraPodaci = { igra: brojIgre };
      igraci.forEach((igrac) => {
        const pobjede = brojPobjeda[igrac];
        const odigrano = brojIgara[igrac];
        const postotakPobjede = odigrano > 0 ? (pobjede / odigrano) * 100 : 0;
        igraPodaci[igrac] = Math.round(postotakPobjede);
      });

      return igraPodaci;
    });

    return { podaci, igraci };
  }

  return (
    <>
      {grafPodaci.length > 0 && (
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
                  value: "Games",
                  position: "insideBottom",
                  offset: -5,
                }}
              />
              <YAxis
                label={{
                  value: "Win percentage",
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
      )}
    </>
  );
}
