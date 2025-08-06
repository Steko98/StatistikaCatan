import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import TurnirService from "../../services/TurnirService";
import Service from '../../services/IgraService'
import IgracService from '../../services/IgracService';
import { RouteNames } from "../../constants";
import moment from "moment";
import { Row, Form, Col, Button, Table, Container } from "react-bootstrap";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { FaRegTrashAlt } from "react-icons/fa";

export default function IgrePromjena(){

    const navigate = useNavigate();
    const routeParams = useParams();

    const [turniri,setTurniri] = useState([]);
    const [turnirSifra, setTurnirSifra] = useState(0);
    const [igra, setIgra] = useState({});
    const [igraci, setIgraci] = useState([]);
    const [pronadeniIgraci, setPronadeniIgraci] = useState([]);

    const typeaheadRef = useRef(null);

    async function dohvatiTurnire() {
        const odgovor = await TurnirService.get();
        if (odgovor.greska) {
            alert(odgovor.poruka);
            return;
        }
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

    async function dohvatiIgrace() {
        const odgovor = await Service.getIgraci(routeParams.sifra)
        if(odgovor.greska){
            alert(odgovor.poruka);
            return;
        }
        setIgraci(odgovor.poruka);
    }

    async function traziIgraca(uvjet) {
        const odgovor = await IgracService.traziIgrac(uvjet);
        if (odgovor.greska) {
            alert(odgovor.poruka)
            return;
        }
        setPronadeniIgraci(odgovor.poruka);
    }

    async function dodajIgraca(e) {
        const odgovor = await Service.dodajIgraca(routeParams.sifra, e[0].sifra);
        if (odgovor.greska) {
            alert(odgovor.poruka)
            return;
        }
        await dohvatiIgrace();
        typeaheadRef.current.clear();
    }

    async function obrisiIgraca(igrac) {
        const odgovor = await Service.obrisiIgraca(routeParams.sifra, igrac);
        if(odgovor.greska){
            alert(odgovor.poruka);
            return;
        }
            await dohvatiIgrace();
  }

    async function dohvatiInicijalnePodatke() {
        await dohvatiTurnire();
        await dohvatiIgru();
        await dohvatiIgrace();
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
        <Container>
            <Row>
                <Col key='1' sm={12} md={6} lg={6}>
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
                                <Button className="btn btn-danger"
                                onClick={()=>navigate(-1)}>
                                    Povratak
                                </Button>
                            </Col>
                            <Col xs={6} sm={6} md={9} lg={6} xl={6} xxl={6}>
                                <Button variant="primary" type="submit">
                                    Promjeni igru
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <Col key='2' sm={12} md={6} lg={6}>
                    <div style={{overflow: 'auto', maxHeight: '400px'}}>
                        <Form.Group className="mb-3" controlId="uvjet">
                            <Form.Label>Traži igrača</Form.Label>
                            <AsyncTypeahead
                            className="autocomplete"
                            id="uvjet"
                            emptyLabel="Nema rezultata"
                            searchText="Tražim..."
                            labelKey={(igrac) => `${igrac.ime}`}
                            minLength={3}
                            options={pronadeniIgraci}
                            onSearch={traziIgraca}
                            placeholder="ime igrača"
                            renderMenuItemChildren={(igrac)=>(
                                <>
                                <span>
                                    {igrac.ime}
                                </span>
                                </>
                            )}
                            onChange={dodajIgraca}
                            ref={typeaheadRef}
                            />
                        </Form.Group>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Igrači u igri</th>
                                    <th className="sredina">Akcije</th>
                                </tr>
                            </thead>
                            <tbody>
                                {igraci && 
                                igraci.map((igrac, index)=>(
                                    <tr key={index}>
                                    <td>{igrac.imeIgrac}</td>
                                    <td className="sredina">
                                        <Button variant='danger' onClick={() =>
                                        obrisiIgraca(igrac.sifraIgrac)
                                        }>
                                        <FaRegTrashAlt />
                                        </Button>
                                    </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Col>
            </Row>
        </Container>
    )

}