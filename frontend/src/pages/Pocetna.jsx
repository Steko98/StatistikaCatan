import { Container } from "react-bootstrap";
import slika from '../assets/background.png';

export default function Pocetna(){
    return(
            <>
                <img style={{width:'100%', maxHeight: '80vh'}} src={slika} alt="" />
            </>
    )
}