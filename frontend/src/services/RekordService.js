import { HttpService } from "./HttpService";

async function get() {
    return await HttpService('/Rekord')
    .then((odgovor)=>{
        return odgovor.data
    })
    .catch((e)=>{})
}

export default{
    get
}