import { HttpService } from "./HttpService"

async function get() {
    return await HttpService('/Turnir')
    .then((odgovor)=>{
        //console.log(odgovor.data)
        return odgovor.data
    })
    .catch((e)=>{})
}

async function getBySifra(sifra) {
    return await HttpService.get('/Turnir/'+sifra)
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

async function promjeni(sifra, turnir) {
    return await HttpService.put('/Turnir/'+sifra, turnir)
    .then((odgovor)=>{return true})
    .catch((e)=>{return false})
}


export default{
    get,
    dodaj,
    obrisi,
    promjeni,
    getBySifra
}