import { useState, useEffect } from "react";
import IgraService from "../../services/IgraService"
import { Button, Container, Table } from "react-bootstrap";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";

export default function IgrePregled(){

    const navigate = useNavigate();
    const[igre, setIgre] = useState([]);
    


    async function dohvatiIgre() {
        const odgovor = await IgraService.get()
        if (odgovor.greska) {
            alert(odgovor.poruka)
            return
        }
        setIgre(odgovor.poruka)
    }

    useEffect(()=>{
        dohvatiIgre();
    },[])

    function formatirajDatum(datum){
        if (datum==null) {
            return 'Nije definirano'
        }
        return moment.utc(datum).format('DD.MM.YYYY.')
    }

    async function obrisiIgru(sifra) {
        const odgovor = await IgraService.obrisi(sifra);
        if (odgovor.greska) {
            alert(odgovor.poruka)
            return
        }
        dohvatiIgre();
    }
    function obrisi(sifra){
        if (!confirm('Sigurno obrisati?')) {
            return;
        }
        obrisiIgru(sifra)
    }    

    return (

        <Container>
            <Link 
            to={RouteNames.IGRE_NOVI} 
            className="btn btn-success">
                Dodaj novu igru
            </Link>

            <hr />

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        {/* <th>Redni broj</th> */}
                        <th>Turnir</th>
                        <th>Datum</th>
                        {/* <th>Pobjednik</th> */}
                        <th className="sredina">Akcije</th>
                    </tr>
                </thead>
                <tbody>
                    {igre && igre.map((igra, index)=>(
                        <tr key={index}>
                            <td>{igra.turnirNaziv}</td>
                            <td>{formatirajDatum(igra.datum)}</td>
                            <td className="sredina">
                                <Button variant="info" disabled>
                                    Detalji
                                </Button>
                                
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <Button variant="warning" 
                                    onClick={()=>navigate(`/igre/${igra.sifra}`)}>
                                    Uredi
                                </Button>

                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <Button variant="danger"
                                    onClick={()=>obrisi(igra.sifra)}>
                                    Obriši
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>

    );
}