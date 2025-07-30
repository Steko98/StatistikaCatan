import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import TurnirService from "../../services/TurnirService";
import Service from '../../services/IgraService'
import { RouteNames } from "../../constants";
import moment from "moment";
import { Row, Form, Col, Button } from "react-bootstrap";

export default function IgrePromjena(){

    const navigate = useNavigate();
    const routeParams = useParams();

    const [turniri,setTurniri] = useState([]);
    const [turnirSifra, setTurnirSifra] = useState(0);
    const [igra, setIgra] = useState({});

    async function dohvatiTurnire() {
        const odgovor = await TurnirService.get();
        setTurniri(odgovor.poruka);
    }

    async function dohvatiIgru() {
        const odgovor = await Service.getBySifra(routeParams.sifra);
        if (odgovor.greska) {
            alert(odgovor.poruka);
            return;
        }
        let igra = odgovor.poruka;
        igra.datum = moment.utc(igra.datum).format('YYYY-MM-DD')
        setIgra(igra);
        setTurnirSifra(igra.turnirSifra);
    }

    async function dohvatiInicijalnePodatke() {
        await dohvatiTurnire();
        await dohvatiIgru();
    }

    useEffect(()=>{
        dohvatiInicijalnePodatke();
    },[]);

    async function promjeni(igra) {
        const odgovor = await Service.promjeni(routeParams.sifra,igra);
        if (odgovor.greska) {
            alert(odgovor.poruka);
            return;
        }
        navigate(RouteNames.IGRE_PREGLED);
    }

    function obradiSubmit(e) {
        e.preventDefault();

        const podaci = new FormData(e.target);

        promjeni({
            datum: moment.utc(podaci.get('datum')),
            turnirSifra: parseInt(turnirSifra)
        })
    }

    return (
        <>
            <Form onSubmit={obradiSubmit}>
                <Form.Group controlId="datum">
                    <Form.Label>Datum</Form.Label>
                    <Form.Control type="date" name="datum" 
                        required defaultValue={igra.datum}/>
                </Form.Group>
                <Form.Group className='mb-3' controlId="turnir">
                    <Form.Label>Turnir</Form.Label>
                    <Form.Select
                    value={turnirSifra}
                    onChange={(e)=>{setTurnirSifra(e.target.value)}}>
                        {turniri && turniri.map((t, index)=>(
                            <option key={index} value={t.sifra}>
                                {t.naziv}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <hr />

                <Row>
                    <Col xs={6} sm={6} md={3} lg={6} xl={6} xxl={6}>
                    <Link to={RouteNames.IGRE_PREGLED}
                    className="btn btn-danger">
                        Povratak
                    </Link>
                    </Col>
                    <Col xs={6} sm={6} md={9} lg={6} xl={6} xxl={6}>
                        <Button variant="primary" type="submit">
                            Promjeni igru
                        </Button>
                    </Col>
                </Row>

            </Form>
        </>
    );

}