import { useEffect, useState } from "react";
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

export default function ZbirBodovaGraf({igre}) {

  const [grafPodaci, setGrafPodaci] = useState([]);
  const [igraci, setIgraci] = useState([]);

  useEffect(() => {
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
                    value: "Games",
                    position: "insideBottom",
                    offset: -20,
                    style: {fontFamily: "Amatic SC, sans-serif", fontSize: "1.5rem", fill: "#D6E0F0"}
                  }}
                />
                <YAxis
                  label={{
                    value: "Points",
                    angle: -90,
                    position: "insideLeft",
                    style: {fontFamily: "Amatic SC, sans-serif", fontSize: "1.5rem", fill: "#D6E0F0"}
                  }}
                />
                <Tooltip />
                <Legend 
                wrapperStyle={{paddingTop: "25px"}}/>
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
