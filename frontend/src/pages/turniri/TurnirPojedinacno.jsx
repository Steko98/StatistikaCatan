import { Link, useNavigate, useParams } from "react-router-dom";
import TurnirService from "../../services/TurnirService";
import { useEffect, useState } from "react";
import { RouteNames } from "../../constants";
import { Button, Container, Table } from "react-bootstrap";
import moment from "moment";
import IgraService from "../../services/IgraService";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function TurnirPojedinacno(){
    const navigate = useNavigate();
    const routeParams = useParams();
    const [turnir, setTurnir] = useState({});
    const [grafPodaci, setGrafPodaci] = useState([]);
    const [igraci, setIgraci] = useState([]);

    async function dohvatiDetaljeTurnira() {
        const odgovor = await TurnirService.getDetaljiTurnir(routeParams.sifra)
        if (odgovor.greska) {
            alert(odgovor.poruka)
            return
        }
        setTurnir(odgovor.poruka)

        const igre = odgovor.poruka.igre || [];
        const {podaci, igraci} = pripremiPodatke(igre);
        setGrafPodaci(podaci)
        setIgraci(igraci)
    }


    useEffect(()=>{
        dohvatiDetaljeTurnira();
    },[])

    function formatirajDatum(datum){
        if (datum==null) {
            return 'Nije definirano'
        }
        return moment.utc(datum).format('DD.MM.YYYY.')
    }

    async function obrisiIgru(sifra) {
        const odgovor = await IgraService.obrisi(sifra);
        if (odgovor.greska) {
            alert(odgovor.poruka)
            return
        }
        dohvatiDetaljeTurnira();
    }
    function obrisi(sifra) {
        if (!confirm('Sigurno obrisati?')) {
            return
        }
        obrisiIgru(sifra)
    }

    function pripremiPodatke(igre){
        const igraciSet = new Set();
        igre.forEach(igra => {
            igra.clanovi.forEach(clan => {
                igraciSet.add(clan.imeIgrac)
            })
        });

        const igraci = Array.from(igraciSet)
        const zbirBodova = {}
        igraci.forEach(igrac => {
            zbirBodova[igrac] = 0;
        })

        const podaci = igre.map((igra, index) => {
            const brojIgre = index + 1;
            igra.clanovi.forEach((clan)=>{
                const igracIme = clan.imeIgrac;
                const bodovi = clan.brojBodova || 0;
                zbirBodova[igracIme] += bodovi;
            })

            const igraPodaci = {igra: brojIgre};
            igraci.forEach((igrac)=>{
                igraPodaci[igrac] = zbirBodova[igrac]
            })

            return igraPodaci
        })

        return {podaci, igraci}
    }

    return (
        <Container>
            <Link className="btn btn-success"
            to={RouteNames.IGRE_NOVI}>
                Dodaj igru
            </Link>

            &nbsp;&nbsp;&nbsp;&nbsp;
            
            <Link className="btn btn-danger"
            to={RouteNames.TURNIR_PREGLED}>
                Povratak
            </Link>

            <hr />

            <div style={{maxHeight:'60vh', overflowY:'auto'}}>
                <Table striped hover responsive bordered>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Pobjednik</th>
                            <th>Igrači</th>
                            <th>Datum</th>
                            <th className="sredina akcije">Akcije</th>
                        </tr>
                    </thead>
                    <tbody>
                        {turnir && turnir.igre && turnir.igre.map((igra, index) =>(
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{igra.clanovi && igra.clanovi.find(c => c.pobjeda)?.imeIgrac}</td>
                                <td>{igra.clanovi && igra.clanovi.map(c => c.imeIgrac).join(', ')}</td>
                                <td>{formatirajDatum(igra.datum)}</td>
                                <td className="sredina akcije">
                                    <Button variant="warning" onClick={()=>navigate(`/igra/${igra.sifra}`)}>
                                        Uredi
                                    </Button>

                                    &nbsp;&nbsp;&nbsp;&nbsp;

                                    <Button variant="danger" 
                                    onClick={()=>obrisi(igra.sifra)}>
                                        Obriši
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                
                </Table>
            </div>

            <hr />
            
            {grafPodaci.length > 0 && (
                <>
                <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                    <LineChart data={grafPodaci}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="igra" label={{ value: 'Broj igre', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Bodovi', angle: -90, position: 'insideLeft' }} />
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
            

        </Container>
    )
}