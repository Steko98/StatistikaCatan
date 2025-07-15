import { useEffect, useState } from "react";
import RekordService from "../../services/RekordService";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { RouteNames } from "../../constants";

export default function RekordiPregled(){

    const[rekordi, setRekordi] = useState([]);

    async function dohvatiRekorde() {
        const odgovor = await RekordService.get()
        setRekordi(odgovor)
    }

    useEffect(()=>{
        dohvatiRekorde();
    },[])

    return(
        <>

            <Link className="btn btn-success" to={RouteNames.REKORD_NOVI}>Dodaj rekord</Link>

            <hr />

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Naziv</th>
                    </tr>
                </thead>
                <tbody>
                    {rekordi && rekordi.map((rekord, index)=>(
                        <tr key={index}>
                            <td>{rekord.naziv}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )

}