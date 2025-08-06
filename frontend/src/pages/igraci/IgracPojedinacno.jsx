import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import IgracService from '../../services/IgracService'
import { Button, Container, Table } from "react-bootstrap";
import { RouteNames } from "../../constants";
import { GiPodiumWinner } from "react-icons/gi";
import { FaSadTear } from "react-icons/fa";
import ClanService from "../../services/ClanService";

export default function IgracPojedinacno(){
    const navigate = useNavigate();
    const routeParams = useParams();
    const [clanovi, setClanovi] = useState([]);

    async function dohvatiIgreIgraca() {
        const odgovor = await IgracService.getIgre(routeParams.sifra)
        if (odgovor.greska) {
            alert(odgovor.poruka)
            return
        }
        setClanovi(odgovor.poruka)
    }

    useEffect(()=>{
        dohvatiIgreIgraca();
    },[])

    async function obrisiClana(sifra) {
        const odgovor = await ClanService.obrisi(sifra);
        if (odgovor.greska) {
            alert(odgovor.poruka)
            return
        }
        dohvatiIgreIgraca();
    }
    function obrisi(sifra){
        if (!confirm('Sigurno obrisati?')) {
            return
        }
        obrisiClana(sifra)
    }

    return (
        <Container >

            <Link className="btn btn-danger"
            to={RouteNames.IGRACI_PREGLED}>
                Povratak
            </Link>

            <hr />

            <div style={{maxHeight:'60vh', overflowY:'auto'}}>
                <Table bordered hover responsive striped>
                    <thead>
                        <td className="sredina">Šifra igre</td>
                        <td className="sredina">Broj bodova</td>
                        <td className="sredina">Pobjeda</td>
                        <td className="sredina akcije">Akcije</td>
                    </thead>
                    <tbody>
                        {clanovi && clanovi.map((clan, index)=>(
                            <tr key={index}>
                                <td className="sredina">{clan.sifraIgra}</td>
                                <td className="sredina">{clan.brojBodova}</td>
                                <td className="sredina">
                                    {clan.pobjeda ? (
                                    <GiPodiumWinner size={35} color="green" />
                                    ) : (
                                    <FaSadTear size={25} color="red"/>
                                    )}
                                </td>
                                <td className="sredina akcije">
                                    <Button className="btn btn-warning"
                                    onClick={()=>navigate(`/clanovi/${clan.sifra}`)}>
                                        Uredi
                                    </Button>

                                    &nbsp;&nbsp;&nbsp;&nbsp;

                                    <Button className="btn btn-danger"
                                    onClick={()=>obrisi(clan.sifra)}>
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
