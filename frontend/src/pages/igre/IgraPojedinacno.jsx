import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import IgraService from "../../services/IgraService";
import { RouteNames } from "../../constants";
import { Button, Table } from "react-bootstrap";
import { GiPodiumWinner } from "react-icons/gi";
import { FaSadTear } from "react-icons/fa";

export default function IgraPojedinacno(){
    const navigate = useNavigate();
    const routeParams = useParams();
    const [clanovi, setClanovi] = useState([]);

    async function dohvatiDetaljeIgre() {
        const odgovor = await IgraService.getIgraci(routeParams.sifra)
        if (odgovor.greska) {
            alert(odgovor.poruka)
            return
        }
        setClanovi(odgovor.poruka)
    }

    useEffect(()=>{
        dohvatiDetaljeIgre();
    },[])

    return (
        <>
            <Button className="btn btn-success" disabled>
                Dodaj igrača
            </Button>

            &nbsp;&nbsp;&nbsp;&nbsp;

            <Button className="btn btn-danger"
            to={RouteNames.TURNIR_DETALJI}
            disabled>
                Povratak
            </Button>

            <hr />

            <Table striped bordered responsive hover>
                <thead>
                    <tr>
                        <th>Igrač</th>
                        <th className="sredina">Broj bodova</th>
                        <th className="sredina">Pobjeda</th>
                        <th className="sredina">Akcije</th>
                    </tr>
                </thead>
                <tbody>
                    {clanovi && clanovi.map((clan, index)=>(
                        <tr key={index}>
                            <td>{clan.imeIgrac}</td>
                            <td className="sredina">{clan.brojBodova}</td>
                            <td className="sredina">
                                {clan.pobjeda ? (
                                    <GiPodiumWinner size={35} color="green" />
                                ) : (
                                    <FaSadTear size={25} color="red"/>
                                )}
                            </td>
                            <td className="sredina">
                                <Button variant="warning" 
                                onClick={()=>navigate(`/clanovi/${clan.sifra}`)}>
                                    Uredi
                                </Button>

                                &nbsp;&nbsp;&nbsp;&nbsp;
                                
                                <Button variant="danger" 
                                onClick={()=>obrisi(clan.sifra)}>
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