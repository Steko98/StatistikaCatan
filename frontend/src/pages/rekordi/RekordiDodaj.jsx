import { Link } from "react-router-dom";
import { RouteNames } from "../../constants";

export default function RekordiDodaj(){
    return (
        <>
        <Link className="btn btn-danger" to={RouteNames.REKORDI_PREGLED}>Povratak</Link>
        </>
    )
}