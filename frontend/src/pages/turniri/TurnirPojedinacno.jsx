import { Link, useNavigate, useParams } from "react-router-dom";
import TurnirService from "../../services/TurnirService";
import { useEffect, useState } from "react";
import { RouteNames } from "../../constants";
import { Button, Container, Table } from "react-bootstrap";
import moment from "moment";
import IgraService from "../../services/IgraService";

export default function TurnirPojedinacno(){
    const navigate = useNavigate();
    const routeParams = useParams();
    const [igre, setIgre] = useState([]);

    async function dohvatiIgreTurnira() {
        const odgovor = await TurnirService.getIgre(routeParams.sifra)
        if (odgovor.greska) {
                alert(odgovor.poruka)
                return
        }
        setIgre(odgovor.poruka)
    }

    useEffect(()=>{
        dohvatiIgreTurnira();
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
        dohvatiIgreTurnira();
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
                            <th>Datum</th>
                            <th className="sredina akcije">Akcije</th>
                        </tr>
                    </thead>
                    <tbody>
                        {igre && igre.map((igra,index)=>(
                            <tr key={index}>
                                <td>{formatirajDatum(igra.datum)}</td>
                                <td className="sredina akcije">
                                    <Button variant="info" onClick={()=>navigate(`/igra/${igra.sifra}`)}>
                                        Detalji
                                    </Button>

                                    &nbsp;&nbsp;&nbsp;&nbsp;

                                    <Button variant="warning" 
                                    onClick={()=>navigate(`/igre/${igra.sifra}`)}>
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
        </Container>
    )
}