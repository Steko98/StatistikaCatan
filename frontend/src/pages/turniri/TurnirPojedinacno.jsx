import { Link, useNavigate, useParams } from "react-router-dom";
import TurnirService from "../../services/TurnirService";
import { useEffect, useState } from "react";
import { RouteNames } from "../../constants";
import { Button, Container, Table } from "react-bootstrap";
import moment from "moment";
import IgraService from "../../services/IgraService";
import ZbirBodovaGraf from '../../components/grafovi/ZbirBodovaGraf';
import GrafTabovi from "../../components/grafovi/Tabovi";
import PostotakGraf from "../../components/grafovi/PostotakGraf";
import OdigraneGraf from "../../components/grafovi/OdigraneGraf";

export default function TurnirPojedinacno(){
    const navigate = useNavigate();
    const routeParams = useParams();
    const [turnir, setTurnir] = useState({});
    const [odabraniGraf, setOdabraniGraf] = useState("Postotak")

    async function dohvatiDetaljeTurnira() {
        const odgovor = await TurnirService.getDetaljiTurnir(routeParams.sifra)
        if (odgovor.greska) {
            alert(odgovor.poruka)
            return
        }
        setTurnir(odgovor.poruka)
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

            <div className="container mt-4" style={{width:'50%' }}>
                <h2>Statistika</h2>
                <GrafTabovi onChange={setOdabraniGraf}/>
                <div className="mt-4">
                    {odabraniGraf === "Postotak" && <PostotakGraf/> }
                    {odabraniGraf === "Zbroj bodova" && <ZbirBodovaGraf/>}
                    {odabraniGraf === "Broj odigranih" && <OdigraneGraf/>}
                </div>
            </div>
        </Container>
    )
}