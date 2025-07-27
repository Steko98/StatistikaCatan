import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import IgracService from "../../services/IgracService"
import { RouteNames } from "../../constants";
import { Col, Row } from "react-bootstrap";

export default function IgraciPromjena() {
    
    const navigate = useNavigate();
    const routeParams = useParams();
    const [igrac, setIgrac] = useState({});

    async function dohvatiIgrac(){
        const odgovor = await IgracService.getBySifra(routeParams.sifra);
        if(odgovor.greska){
            alert(odgovor.poruka);
            return;
        }
        setIgrac(odgovor.poruka);
    }

    useEffect(()=>{
        dohvatiIgrac();
    },[]);

    async function promjeni(e) {
        const odgovor = await IgracService.promjeni(routeParams.sifra,e);
        if (odgovor.greska) {
            alert(odgovor.poruka);
            return;
        }
        navigate(RouteNames.IGRACI_PREGLED)
    }

    function obradiSubmit(e) {
        e.preventDefault();

        const podaci = new FormData(e.target);

        promjeni({
            ime: podaci.get('ime')
        })
    }

    return (
        <>
            <Form onSubmit={obradiSubmit}>
                <Form.Group controlId="ime">
                    <Form.Label>Ime</Form.Label>
                    <Form.Control type="text" name="ime" required defaultValue={polaznik.ime}/>
                </Form.Group>

                <hr />

                <Row>
                    <Col xs={6} sm={6} md={3} lg={6} xl={6} xxl={6}>
                    <Link to={RouteNames.IGRACI_PREGLED}
                    className="btn btn-danger">
                        Povratak
                    </Link>
                    </Col>
                    <Col xs={6} sm={6} md={9} lg={6} xl={6} xxl={6}>
                    <Button variant="primary" type="submit">
                        Promjeni igrača
                    </Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}