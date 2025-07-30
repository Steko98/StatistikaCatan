import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ClanService from "../../services/ClanService";
import { Button, Container, Table } from "react-bootstrap";
import { RouteNames } from "../../constants";

export default function ClanoviPregled(){

    const navigate = useNavigate();
    const [clanovi, setClanovi] = useState([]);

    async function dohvatiClanove() {
        const odgovor = await ClanService.get()
        if (odgovor.greska) {
            alert(odgovor.poruka)
            return
        }
        setClanovi(odgovor.poruka)
    }

    useEffect(()=>{
        dohvatiClanove();
    },[])

    async function obrisiClana(sifra) {
        const odgovor = await ClanService.obrisi(sifra);
        if (odgovor.greska) {
            alert(odgovor.poruka)
            return
        }
        dohvatiClanove();
    }
    function obrisi(sifra){
        if (!confirm('Sigurno obrisati?')) {
            return;
        }
        obrisiClana(sifra)
    } 



    return (
        <Container>
            <Link to={RouteNames.CLAN_NOVI}
            className="btn btn-success">
            Dodaj Člana
            </Link>

            <hr />

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Igrač</th>
                        <th>Šifra Igre</th>
                        <th>Broj Bodova</th>
                        <th>Pobjeda</th>
                        <th className="sredina">Akcije</th>
                    </tr>
                </thead>
                <tbody>
                    {clanovi && clanovi.map((clan, index)=>(
                        <tr key={index}>
                            <td>{clan.imeIgrac}</td>
                            <td>{clan.sifraIgra}</td>
                            <td>{clan.brojBodova}</td>
                            <td>{clan.pobjeda}</td>
                            <td className="sredina">

                                <Button variant="info" disabled>
                                    Detalji
                                </Button>

                                &nbsp;&nbsp;&nbsp;&nbsp;

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
        </Container>
    );
}