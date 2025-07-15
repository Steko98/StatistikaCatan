import { HttpService } from "./HttpService"

async function get() {
    return await HttpService('/Turnir')
    .then((odgovor)=>{
        //console.log(odgovor.data)
        return odgovor.data
    })
    .catch((e)=>{})
}

async function dodaj(turnir) {
    return await HttpService.post('/Turnir', turnir)
    .then((odgovor)=>{return true})
    .catch((e)=>{return false})
}

async function obrisi(sifra) {
    return await HttpService.delete('/Turnir/'+sifra)
    .then((odgovor)=>{return true})
    .catch((e)=>{return false})
}

export default{
    get,
    dodaj,
    obrisi
}