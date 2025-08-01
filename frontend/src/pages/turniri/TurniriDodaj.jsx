import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Col, Form, Row } from "react-bootstrap";
import TurnirService from "../../services/TurnirService";
import moment from "moment";

export default function TurniriDodaj(){

    const navigate = useNavigate();

    async function dodaj(turnir){
        const odgovor = await TurnirService.dodaj(turnir);
        if (odgovor.greska) {
            alert(odgovor.poruka)
            return
        }
        navigate(RouteNames.TURNIR_PREGLED);
    }



    function odradiSubmit(e){
        e.preventDefault();

        let podaci = new FormData(e.target);

        dodaj(
            {
                naziv: podaci.get('naziv'),
                datumPocetka: moment.utc(podaci.get('datumPocetka')),
                datumZavrsetka: moment.utc(podaci.get('datumZavrsetka'))
            }
        )
    }



    return (
        <>

        <Form onSubmit={odradiSubmit}>

            <Form.Group controlId="naziv">
                <Form.Label>Naziv</Form.Label>
                <Form.Control type="text" name="naziv" required/>
            </Form.Group>

            <Form.Group controlId="datumPocetka">
                <Form.Label>Datum početka</Form.Label>
                <Form.Control type="date" name="datumPocetka" />
            </Form.Group>

            <Form.Group controlId="datumZavrsetka">
                <Form.Label>Datum završetka</Form.Label>
                <Form.Control type="date" name="datumZavrsetka" />
            </Form.Group>

            <hr style={{marginTop: '50px'}}/>

            <Row>
                <Col xs={6} sm={12} md={3} lg={6} xl={6} xxl={6}>
                    <Link className="btn btn-danger" to={RouteNames.TURNIR_PREGLED}>
                        Povratak
                    </Link>
                </Col>
                <Col xs={6} sm={6} md={9} lg={10} xl={6} xxl={6}>
                    <Button variant="success" type="submit">
                        Dodaj turnir
                    </Button>
                </Col>
            </Row>

        </Form>

        </>
    )
}