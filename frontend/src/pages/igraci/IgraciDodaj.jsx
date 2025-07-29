import { Link, useNavigate } from "react-router-dom"
import IgracService from "../../services/IgracService";
import { RouteNames } from "../../constants";
import { Button, Col, Form, Row } from "react-bootstrap";

export default function IgraciDodaj(){

    const navigate = useNavigate();

    async function dodaj(e) {
        const odgovor = await IgracService.dodaj(e);
        if(odgovor.greska){
            alert(odgovor.poruka);
            return;
        }
        navigate(RouteNames.IGRACI_PREGLED)
    }

    function obradiSubmit(e){
        e.preventDefault();

        const podaci = new FormData(e.target);

        dodaj({
            ime: podaci.get('ime')
        })
    }

    return (
        <>
            <Form onSubmit={obradiSubmit}>
                <Form.Group controlId="ime">
                    <Form.Label>Ime</Form.Label>
                    <Form.Control type="text" name="ime" required />
                </Form.Group>

                <hr />

                <Row>
                    <Col xs={6} sm={6} md={3} lg={6} xl={6} xxl={6}>
                        <Link to={RouteNames.IGRACI_PREGLEDž}
                        className="btn btn-danger">
                            Povratak
                        </Link>
                    </Col>
                    <Col xs={6} sm={6} md={9} lg={6} xl={6} xxl={6}>
                        <Button variant="primary" type="submit">
                            Dodaj igrača
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}