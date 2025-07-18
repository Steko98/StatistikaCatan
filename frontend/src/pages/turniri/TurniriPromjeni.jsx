import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Col, Form, Row } from "react-bootstrap";
import TurnirService from "../../services/TurnirService";
import moment from "moment";
import { useEffect, useState } from "react";

export default function TurniriPromjeni(){

    const navigate = useNavigate();
    const params = useParams();
    const[turnir, setTurnir] = useState({}) 

    async function ucitajTurnir() {
        const odgovor = await TurnirService.getBySifra(params.sifra)
        odgovor.datumPocetka = moment.utc(odgovor.datumPocetka).format('yyyy-MM-DD')
        odgovor.datumZavrsetka = moment.utc(odgovor.datumZavrsetka).format('yyyy-MM-DD')
        setTurnir(odgovor)
    }


    useEffect(()=>{
        ucitajTurnir()
    },[])

    async function promjeni(sifra, turnir){
        const odgovor = await TurnirService.promjeni(sifra,turnir);
        navigate(RouteNames.TURNIR_PREGLED);
    }



    function odradiSubmit(e){
        e.preventDefault();

        let podaci = new FormData(e.target);

        promjeni(
            params.sifra,
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
                <Form.Control type="text" name="naziv" 
                defaultValue={turnir.naziv}/>
            </Form.Group>

            <Form.Group controlId="datumPocetka">
                <Form.Label>Datum početka</Form.Label>
                <Form.Control type="date" name="datumPocetka" 
                defaultValue={turnir.datumPocetka}/>
            </Form.Group>

            <Form.Group controlId="datumZavrsetka">
                <Form.Label>Datum završetka</Form.Label>
                <Form.Control type="date" name="datumZavrsetka" 
                defaultValue={turnir.datumZavrsetka}/>
            </Form.Group>

            <hr style={{marginTop: '50px'}}/>

            <Row>
                <Col xs={6} sm={6} md={3} lg={2} xl={6} xxl={6}>
                    <Link className="btn btn-danger" to={RouteNames.TURNIR_PREGLED}>Povratak</Link>
                </Col>
                <Col xs={6} sm={6} md={9} lg={10} xl={6} xxl={6}>
                    <Button variant="success" type="submit">
                        Spremi promjene
                    </Button>
                </Col>
            </Row>

        </Form>

        </>
    )
}