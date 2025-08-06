import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Service from '../../services/IgraService';
import TurnirService from "../../services/TurnirService";
import { RouteNames } from "../../constants";
import moment from "moment";
import { Button, Row, Col, Form, Container } from "react-bootstrap";

export default function IgreDodaj(){
    const navigate = useNavigate();

    const [turniri, setTurniri] = useState([]);
    const [turnirSifra, setTurnirSifra] = useState(0);

    async function dohvatiTurnire() {
        const odgovor = await TurnirService.get();
        setTurniri(odgovor.poruka);
        setTurnirSifra(odgovor.poruka[0].sifra);
    }

    useEffect(()=>{
        dohvatiTurnire();
    },[]);

    async function dodaj(e) {
        const odgovor = await Service.dodaj(e);
        if(odgovor.greska){
            alert(odgovor.poruka);
            return;
        }
        navigate(-1);
    }

    function obradiSubmit(e){
        e.preventDefault();

        const podaci = new FormData(e.target);

        dodaj({
            datum: moment.utc(podaci.get('datum')),
            turnirSifra: parseInt(turnirSifra)
        });
    }

    return (
        <Container>

            <Form onSubmit={obradiSubmit}>
                <Form.Group controlId="datum">
                    <Form.Label>Datum</Form.Label>
                    <Form.Control type="date" name="datum" required/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="turnir">
                    <Form.Label>Turnir</Form.Label>
                    <Form.Select onChange={(e)=>{setTurnirSifra(e.target.value)}}>
                        {turniri && turniri.map((t,index)=>(
                            <option key={index} value={t.sifra}>
                                {t.naziv}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <hr style={{marginTop: '50px'}}/>


                <Row className="akcije">
                    <Col xs={6} sm={12} md={3} lg={6} xl={6} xxl={6}>
                        <Link to={RouteNames.IGRE_PREGLED}
                        className="btn btn-danger">
                            Povratak
                        </Link>
                    </Col>
                    <Col xs={6} sm={12} md={9} lg={6} xl={6} xxl={6}>
                        <Button variant="success"
                        type="submit">
                            Dodaj igru
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    )

}