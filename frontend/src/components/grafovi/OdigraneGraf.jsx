import { useParams } from "react-router-dom";
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
import TurnirService from "../../services/TurnirService";
import { useEffect, useState } from "react";
import useError from "../../hooks/useError";
import useLoading from "../../hooks/useLoading";

export default function OdigraneGraf() {
  const routeParams = useParams();
  const [grafPodaci, setGrafPodaci] = useState([]);
  const { showLoading, hideLoading } = useLoading();
  const { prikaziError } = useError();
  const [turnir, setTurnir] = useState({});

  async function dohvatiDetaljeTurnira() {
    showLoading();
    const odgovor = await TurnirService.getDetaljiTurnir(routeParams.sifra);
    hideLoading();
    if (odgovor.greska) {
      prikazi(odgovor.poruka);
      return;
    }
    setTurnir(odgovor.poruka);

    const igre = odgovor.poruka.igre || [];
    const podaci = pripremiPodatke(igre);
    setGrafPodaci(podaci);
  }

  useEffect(() => {
    dohvatiDetaljeTurnira();
  }, []);

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
              <Bar dataKey="odigrano" stackId="a" fill="#8884d8" />
              <Bar dataKey="pobjede" stackId="a" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
}
