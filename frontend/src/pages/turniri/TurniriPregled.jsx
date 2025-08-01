import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import TurnirService from "../../services/TurnirService";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";

export default function TurniriPregled(){

    const navigate = useNavigate();
    const[turniri, setTurniri] = useState([]);
    

    async function dohvatiTurnire(){
       const odgovor = await TurnirService.get()
        if (odgovor.greska) {
            alert(odgovor.poruka)
            return
        }
       setTurniri(odgovor.poruka)
    }


    useEffect(()=>{
        dohvatiTurnire();
    },[])

    function formatirajDatum(datum){
        if (datum==null) {
            return 'Nije definirano'
        }
        return moment.utc(datum).format('DD.MM.YYYY.')
    }

    async function obrisiTurnir(sifra) {
        const odgovor = await TurnirService.obrisi(sifra);
        if (odgovor.greska) {
            alert(odgovor.poruka)
            return
        }
        dohvatiTurnire();
    }
    function obrisi(sifra){
        if (!confirm('Sigurno obrisati?')) {
            return;
        }
        obrisiTurnir(sifra)
    }



    return(
        <>
        <Link 
        className="btn btn-success"
        to={RouteNames.TURNIR_NOVI}>
            Dodavanje novog turnira
        </Link>

        <hr />

        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Naziv</th>
                    <th>Datum početka</th>
                    <th>Datum završetka</th>
                    <th className="sredina">Akcije</th>
                </tr>
            </thead>
            <tbody>
                {turniri && turniri.map((turnir,index)=>(
                    <tr key={index}>
                        <td>
                            {turnir.naziv}
                        </td>
                        <td>
                            {formatirajDatum(turnir.datumPocetka)}
                        </td>
                        <td>
                            {formatirajDatum(turnir.datumZavrsetka)}
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