import { HttpService } from "./HttpService"

async function get() {
    return await HttpService('/Igrac')
    .then((odgovor)=>{
        // console.log(odgovor.data)
        return odgovor.data
    })
    .catch((e)=>{})
}

export default{
    get
}