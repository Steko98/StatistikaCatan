import {HttpService} from './HttpService'

async function logInService(podaci) {
    return await HttpService
        .post('/Autorizacija/token', podaci)
        .then((odgovor) => {return {greska: false, poruka: odgovor.data};})
        .catch ((e)=>{return {greska:true, poruka: 'Problem kod autorizacije'}})
}

async function registerService(korisnik){
    return await HttpService.post('/Autorizacija/registracija', korisnik)
    .then ((odgovor) => {
        return {greska: false, poruka: odgovor.data}
    })
    .catch ((e)=>{
        switch (e.status){
            case 400:
                let poruke = "";
                for (const kljuc in e.response.data.errors){
                    poruke += kljuc + ': ' + e.response.data.errors[kljuc][0] + '\n'
                }
                console.log(poruke)
                return {greska: true, poruka: poruke}
            default:
                return {greska: true, poruka: "Korisnik se ne može registrirati"}
        }
    })
}

export default {
    logInService,
    registerService
}