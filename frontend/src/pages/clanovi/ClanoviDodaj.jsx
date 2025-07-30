import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Row, Col, Form } from "react-bootstrap";
import Service from '../../services/ClanService';
import IgracService from "../../services/IgracService";
import IgraService from "../../services/IgraService";
import { RouteNames } from "../../constants";

export default function ClanoviDodaj(){
    const navigate = useNavigate();

    const [igraci, setIgraci] = useState([]);
    const [igracSifra, setIgracSifra] = useState(0);
    const [igre, setIgre] = useState ([]);
    const [sifraIgra, setIgraSifra] = useState(0);

    async function dohvatiIgrace() {
        const odgovor = await IgracService.get()
        setIgraci(odgovor.poruka);
        setIgracSifra(odgovor.poruka[0].sifra)
    }

    async function dohvatiIgre() {
        const odgovor = await IgraService.get()
        setIgre(odgovor.poruka);
        setIgraSifra(odgovor.poruka[0].sifra)
    }

    useEffect(()=>{
        dohvatiIgrace();
        dohvatiIgre();
    },[])

    async function dodaj(e) {
        const odgovor = await Service.dodaj(e);
        if (odgovor.greska) {
            alert(odgovor.poruka)
            return
        }
        navigate(RouteNames.CLAN_PREGLED)
    }

    function obradiSubmit(e) {
        e.preventDefault();

        const podaci = new FormData(e.target);
        
        dodaj({
            brojBodova: parseInt(podaci.get('brojBodova')),
            pobjeda: podaci.get('pobjeda')=='on' ? true : false,
            imeIgraca: podaci.get('imeIgraca'),
            sifraIgrac: parseInt(podaci.get('sifraIgrac')),
            sifraIgra: parseInt(sifraIgra)
        });
    }

    return (
        <>

        <Form onSubmit={obradiSubmit}>

            <Form.Group className="mb-3" controlId="igrac">
                <Form.Label>Igrač</Form.Label>
                <Form.Select name="sifraIgrac" onChange={(e)=>{setIgracSifra(e.target.value)}}>
                    {igraci && igraci.map((i,index)=>(
                        <option key={index} value={i.sifra}>
                            {i.ime}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>

            <Form.Group controlId="igra">
                <Form.Label>Šifra igre</Form.Label>
                <Form.Select onChange={(e)=>{setIgraSifra(e.target.value)}}>
                    {igre && igre.map((i,index)=>(
                        <option key={index} value={i.sifra}>
                            {i.sifra}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>

            <Form.Group controlId="brojBodova">
                <Form.Label>Broj bodova</Form.Label>
                <Form.Control type="number" name="brojBodova" />
            </Form.Group>

            <Form.Group controlId="pobjeda">
                <Form.Check label="Pobjeda" name="pobjeda"/>
            </Form.Group>

            <hr style={{marginTop: '50px'}}/>

            <Row>
                <Col xs={6} sm={12} md={3} lg={6} xl={6} xxl={6}>
                    <Link className="btn btn-danger" to={RouteNames.CLAN_PREGLED}>
                        Povratak
                    </Link>
                </Col>
                <Col xs={6} sm={6} md={9} lg={10} xl={6} xxl={6}>
                    <Button variant="success" type="submit">
                        Dodaj člana
                    </Button>
                </Col>
            </Row>

        </Form>

        </>
    )


}