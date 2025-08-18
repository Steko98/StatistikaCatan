import { useState } from "react";
import { Button } from "react-bootstrap";

const GrafTipovi = ["Postotak", "Zbroj bodova", "Broj odigranih"]

export default function GrafTabovi({ onChange }){

    const [aktivan, setAktivan] = useState(GrafTipovi[0])

    return (
        <div className="btn-group" role="group">
            {GrafTipovi.map((tip)=>(
                <Button key={tip}
                type="button"
                onClick={()=>{
                    setAktivan(tip)
                    onChange(tip)
                }}
                className={`btn ${aktivan === tip ? "btn-primary" : "btn-secondary"}`}>
                    {tip}
                </Button>
            ))}
        </div>
    )

}