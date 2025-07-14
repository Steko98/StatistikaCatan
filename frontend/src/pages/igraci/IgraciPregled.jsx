import { useEffect, useState } from "react";
import IgracService from '../../services/IgracService';
import { Table } from "react-bootstrap";

export default function IgraciPregled(){

    const[igraci, setIgraci] = useState([]);

    async function dohvatiIgrace(){
        const odgovor = await IgracService.get()
        setIgraci(odgovor)
    }

    useEffect(()=>{
        dohvatiIgrace();
    },[])

    return(
        <>
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Ime</th>
                </tr>
            </thead>
            <tbody>
                {igraci && igraci.map((igrac,index)=>(
                    <tr key={index}>
                        <td>{igrac.ime}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
        </>
    )
}

