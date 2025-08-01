import { useEffect, useState } from "react";
import IgracService from '../../services/IgracService';
import { Button, Table } from "react-bootstrap";
import { Link ,useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";

export default function IgraciPregled(){

    const navigate = useNavigate();  
    const[igraci, setIgraci] = useState([]);


    async function dohvatiIgrace(){
       const odgovor = await IgracService.get()
        if (odgovor.greska) {
            alert(odgovor.poruka)
            return
        }
        setIgraci(odgovor.poruka)
    }

    useEffect(()=>{
        dohvatiIgrace();
    },[])

    async function obrisiIgraca(sifra) {
        const odgovor = await IgracService.obrisi(sifra)
        if (odgovor.greska) {
            alert(odgovor.poruka)
            return;
        }
        dohvatiIgrace();
    }
    function obrisi(sifra){
        if (!confirm('Sigurno obrisati?')) {
            return;
        }
        obrisiIgraca(sifra);
    }

    return(
        <>
        <Link className="btn btn-success"
        to={RouteNames.IGRAC_NOVI}>
            Dodaj igrača
        </Link>

        <hr />

        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Ime</th>
                    <th className="sredina">Akcije</th>
                </tr>
            </thead>
            <tbody>
                {igraci && igraci.map((igrac,index)=>(
                    <tr key={index}>
                        <td>{igrac.ime}</td>
                        <td className="sredina">
                            <Button variant="info" disabled>
                                Detalji
                            </Button>

                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Button variant="warning"
                            onClick={()=>navigate(`/igraci/${igrac.sifra}`)}>
                                Uredi
                            </Button>
                            
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Button variant="danger"
                            onClick={()=>obrisi(igrac.sifra)}>
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

