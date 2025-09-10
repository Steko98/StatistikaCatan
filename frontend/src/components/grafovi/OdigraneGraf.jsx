import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useState } from "react";

export default function OdigraneGraf({igre}) {

  const [grafPodaci, setGrafPodaci] = useState([]);

  useEffect(() => {
    const podaci = pripremiPodatke(igre);
    setGrafPodaci(podaci);
  }, [igre]);

  function pripremiPodatke(igre) {
    const podaci = {};

    igre.forEach((igra) => {
      igra.clanovi.forEach((clan) => {
        const ime = clan.imeIgrac;
        if (!podaci[ime]) {
          podaci[ime] = { ime, odigrano: 0, pobjede: 0 };
        }

        if (!clan.pobjeda) {
          podaci[ime].odigrano += 1;
        }

        if (clan.pobjeda) {
          podaci[ime].pobjede += 1;
        }
      });
    });

    return Object.values(podaci);
  }

  return (
    <>
      {grafPodaci.length > 0 && (
        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <BarChart
              data={grafPodaci}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ime" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="odigrano" stackId="a" fill="#FFC107" name="Lost "/>
              <Bar dataKey="pobjede" stackId="a" fill="#347433" name="Won"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
}
