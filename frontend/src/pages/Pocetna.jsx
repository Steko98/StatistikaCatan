import { Container } from "react-bootstrap";
import slika from '../assets/slikaCatan.jpg';

export default function Pocetna(){
    return(
            <>
                <img src={slika} alt="drustvena igra catan" style={{maxWidth:600}}/>
            </>
    )
}