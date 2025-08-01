import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ClanService from "../../services/ClanService"
import IgraService from "../../services/IgraService"
import IgracService from "../../services/IgracService"
import { RouteNames } from "../../constants";
import { Form, Button, Col, Row } from "react-bootstrap";

export default function ClanoviPromjeni(){
    const navigate = useNavigate();
    const routeParams = useParams();

    const [clan, setClan] = useState({});
    const [pobjeda, setPobjeda] = useState(false);

    const [igraci, setIgraci] = useState([]);
    const [igracSifra, setIgracSifra] = useState(0);
    const [igre, setIgre] = useState ([]);
    const [sifraIgra, setIgraSifra] = useState(0);
    
    async function dohvatiIgre() {
        const odgovor = await IgraService.get()
        setIgre(odgovor.poruka)
    }

    async function dohvatiIgrace() {
        const odgovor = await IgracService.get()
        setIgraci(odgovor.poruka)
    }

    async function ucitajClan() {
        const odgovor = await ClanService.getBySifra(routeParams.sifra)
        if (odgovor.greska) {
            alert(odgovor.poruka)
            return
        }
        let s = odgovor.poruka
        setClan(s)
        setPobjeda(s.pobjeda)
        setIgracSifra(s.sifraIgrac)
        setIgraSifra(s.sifraIgra)
    }

    async function dohvatiInicijalnePodatke() {
        await dohvatiIgrace();
        await dohvatiIgre();
        await ucitajClan();
    }

    
    useEffect(()=>{
        dohvatiInicijalnePodatke()
    },[])

    async function promjeni(clan) {
        const odgovor = await ClanService.promjeni(routeParams.sifra, clan);
        if (odgovor.greska) {
            alert(odgovor.poruka)
            return
        }
        navigate(RouteNames.CLAN_PREGLED)
    }

    function obradiSubmit(e) {
        e.preventDefault();

        const podaci = new FormData(e.target);
        
        promjeni({
            brojBodova: parseInt(podaci.get('brojBodova')),
            pobjeda: podaci.get('pobjeda')=='on' ? true : false,
            imeIgraca: podaci.get('imeIgraca'),
            sifraIgrac: parseInt(podaci.get('sifraIgrac')),
            sifraIgra: parseInt(sifraIgra)
        });
    }

    return(
        <>
            <Form onSubmit={obradiSubmit}>
                    
                <Form.Group className="mb-3" controlId="igrac">
                    <Form.Label>Igrač</Form.Label>
                    <Form.Select name="sifraIgrac"
                    value={igracSifra}
                    onChange={(e)=>{setIgracSifra(parseInt(e.target.value))}}>
                        {igraci && igraci.map((i,index)=>(
                            <option key={index} value={i.sifra}>
                                {i.ime}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group controlId="igra">
                    <Form.Label>Šifra igre</Form.Label>
                    <Form.Select name="sifraIgra"
                    value={sifraIgra}
                    onChange={(e)=>{setIgraSifra(e.target.value)}}>
                        {igre && igre.map((i,index)=>(
                            <option key={index} value={i.sifra}>
                                {i.sifra}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group controlId="brojBodova">
                    <Form.Label>Broj bodova</Form.Label>
                    <Form.Control type="number" name="brojBodova" 
                    step={1} defaultValue={clan.brojBodova}/>
                </Form.Group>

                <Form.Group controlId="pobjeda">
                    <Form.Check label="Pobjeda" name="pobjeda"
                    onChange={(e)=>setPobjeda(e.target.checked)}
                    checked={pobjeda}/>
                </Form.Group>

                <hr style={{marginTop: '50px'}}/>

                    <Row>
                        <Col xs={6} sm={12} md={3} lg={6} xl={6} xxl={6}>
                            <Link className="btn btn-danger" to={RouteNames.CLAN_PREGLED}>
                                Povratak
                            </Link>
                        </Col>
                        <Col xs={6} sm={12} md={9} lg={6} xl={6} xxl={6}>
                            <Button variant="success" type="submit">
                                Spremi promjene
                            </Button>
                        </Col>
                    </Row>
            </Form>
        </>
    )
}