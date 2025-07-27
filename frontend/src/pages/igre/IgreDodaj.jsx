import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TurnirService from "../../services/TurnirService";
import { RouteNames } from "../../constants";
import moment from "moment";
import { Button, Row, Col, Form } from "react-bootstrap";

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
        navigate(RouteNames.IGRE_PREGLED);
    }

    function obradiSubmit(e){
        e.preventDefault();

        const podaci = new FormData(e.target);

        dodaj({
            datum: moment.utc(podaci.get('datum'))
        });
    }

    return (
        <>

            <Form>
                <Form.Group controlId="datum">
                    <Form.Label>Datum</Form.Label>
                    <Form.Control type="date" name="datum" required/>
                </Form.Group>
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
        </>
    )

}