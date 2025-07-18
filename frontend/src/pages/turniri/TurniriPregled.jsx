import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import TurnirService from "../../services/TurnirService";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";

export default function TurniriPregled(){

    const[turniri, setTurniri] = useState([]);
    const navigate = useNavigate();

    async function dohvatiTurnire(){
       const odgovor = await TurnirService.get()
       setTurniri(odgovor)
    }


    useEffect(()=>{
        dohvatiTurnire();
    },[])

    function obrisi(sifra){
        if (!confirm('Sigurno obrisati?')) {
            return;
        }
        brisanje(sifra)
    }

    async function brisanje(sifra) {
        const odgovor = await TurnirService.obrisi(sifra);
        dohvatiTurnire();
    }


    return(
        <>

        <Link 
        className="btn btn-success"
        to={RouteNames.TURNIR_NOVI}>Dodavanje novog turnira</Link>

        <hr />

        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Naziv</th>
                    <th>Datum početka</th>
                    <th>Datum završetka</th>
                    <th className="sredina">Akcija</th>
                </tr>
            </thead>
            <tbody>
                {turniri && turniri.map((turnir,index)=>(
                    <tr key={index}>
                        <td>{turnir.naziv}</td>
                        <td>
                            {
                            turnir.datumPocetka!=null ?
                            moment.utc(turnir.datumPocetka).format('DD.MM.YYYY')
                            : ''
                            }
                        </td>
                        <td>
                            {
                            turnir.datumPocetka!=null ?
                            moment.utc(turnir.datumZavrsetka).format('DD.MM.YYYY')
                            : ''
                            }
                        </td>

                        <td className="sredina">

                            <Button variant="info" disabled>
                                Detalji
                            </Button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Button variant="warning" 
                            onClick={()=>navigate(`/turniri/${turnir.sifra}`)}>
                                Uredi
                            </Button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Button variant="danger" 
                            onClick={()=>obrisi(turnir.sifra)}>
                                Obriši
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
        </>
    )
}