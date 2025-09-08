import { useEffect, useState } from "react";
import useLoading from "../hooks/useLoading"
import TurnirService from '../services/TurnirService';
import IgracService from "../services/IgracService";
import IgraService from "../services/IgraService";
import { Col, Row } from "react-bootstrap";
import CountUp from "react-countup";



export default function Pocetna(){

    const {showLoading, hideLoading} = useLoading();
    const [turnira, setTurnira] = useState(0);
    const [igraca, setIgraca] = useState(0);
    const [igara, setIgara] = useState(0);

    async function dohvatiBrojTurnira() {
        await TurnirService.ukupnoTurnira()
        .then((odgovor)=>{
            setTurnira(odgovor.poruka);
        })
        .catch((e)=>{console.log(e)})
    }

        async function dohvatiBrojIgraca() {
        await IgracService.ukupnoIgraca()
        .then((odgovor)=>{
            setIgraca(odgovor.poruka);
        })
        .catch((e)=>{console.log(e)})
    }

        async function dohvatiBrojIgara() {
        await IgraService.ukupnoIgara()
        .then((odgovor)=>{
            setIgara(odgovor.poruka);
        })
        .catch((e)=>{console.log(e)})
    }

    async function ucitajPodatke() {
        await dohvatiBrojIgara();
        await dohvatiBrojIgraca();
        await dohvatiBrojTurnira();
    }

    useEffect(()=>{
        ucitajPodatke();
    },[])

    return(
        <>
            <Row>
                <h2 className="sredina">Currently counting:</h2>
                
                <Col sm={12} md={4} lg={4}>
                <div className="naslovna d-flex align-items-center justify-content-center">
                    <CountUp
                    start={0}
                    end={turnira}
                    duration={7}
                    separator="."
                    ></CountUp>
                </div>
                <h4 className="sredina">Tournaments</h4>
                </Col>
                <Col sm={12} md={4} lg={4}>
                <div className="naslovna d-flex align-items-center justify-content-center">
                    <CountUp
                    start={0}
                    end={igara}
                    duration={7}
                    separator="."
                    ></CountUp>
                </div>
                <h4 className="sredina">Games</h4>
                </Col>
                <Col sm={12} md={4} lg={4}>
                <div className="naslovna d-flex align-items-center justify-content-center">
                    <CountUp
                    start={0}
                    end={igraca}
                    duration={7}
                    separator="."
                    ></CountUp>
                </div>
                <h4 className="sredina">Players</h4>
                </Col>
            </Row>
        </>
    )
}