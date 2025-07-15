import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import TurnirService from "../../services/TurnirService";
import moment from "moment";

export default function TurniriPregled(){

    const[turniri, setTurniri] = useState([]);

    async function dohvatiTurnire(){
       const odgovor = await TurnirService.get()
       setTurniri(odgovor)
    }


    useEffect(()=>{
        dohvatiTurnire();
    },[])

    return(
        <>
        Pregled turnira!
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Naziv</th>
                    <th>Datum početka</th>
                    <th>Datum završetka</th>
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
                    </tr>
                ))}
            </tbody>
        </Table>
        </>
    )
}