import { HttpService } from "./HttpService"

async function get() {
    return await HttpService.get('/Turnir')
    .then((odgovor)=>{

        return {greska: false, poruka: odgovor.data}
    })
    .catch((e)=>{
        return {greska: true, poruka: 'Problem kod dohvaćanja turnira'}
    })
}

async function getBySifra(sifra) {
    return await HttpService.get('/Turnir/'+sifra)
    .then((odgovor)=>{
        return {greska: false, poruka: odgovor.data}
    })
    .catch((e)=>{
        return {greska: true, poruka: 'Turnir nije pronađen'}
    })
}

async function dodaj(turnir) {
    return await HttpService.post('/Turnir', turnir)
    .then((odgovor)=>{
        return {greska: false, poruka: odgovor.data}
    })
    .catch((e)=>{
        switch (e.status){
            case 400:
                let poruke='';
                for(const kljuc in e.response.data.errors){
                    poruke += kljuc + ': ' + e.response.data.errors[kljuc][0] + '\n';
                }
                console.log(poruke);
                return {greska:true, poruka: poruke}
            default:
                return {greska: true, poruka: 'Turnir se ne može dodati'}
        }
    })
}

async function obrisi(sifra) {
    return await HttpService.delete('/Turnir/'+sifra)
    .then((odgovor)=>{
        return {greska:false, poruka: odgovor.data}
    })
    .catch(()=>{
        return {greska: true, poruka: 'Greška kod brisanja turnira'}
    })
}

async function promjeni(sifra, turnir) {
    return await HttpService.put('/Turnir/' + sifra, turnir)
    .then((odgovor)=>{
        return {greska: false, poruka: odgovor.data}
    })
    .catch((e)=>{
        switch (e.status){
            case 400:
                let poruke='';
                for(const kljuc in e.response.data.errors){
                    poruke += kljuc + ': ' + e.response.data.errors[kljuc][0] + '\n';
                }
                console.log(poruke);
                return {greska:true, poruka: poruke}
            default:
                return {greska: true, poruka: 'Turnir se ne može promjeniti'}
        }
    })
}

async function getIgre(sifra) {
    return await HttpService.get('Turnir/Igre/'+sifra)
    .then ((odgovor)=>{
        return {greska: false, poruka: odgovor.data}
    })
    .catch(()=>{return {greska:true, poruka: "Problem kod dohvaćanja igara na turniru"}})
}

async function traziTurnir(uvjet) {
    return await HttpService.get('Turnir/trazi/'+uvjet)
    .then ((odgovor)=>{
        return {greska: false, poruka: odgovor.data}
    })
    .catch ((e)=>{return {greska: true, poruka: "Problem kod traženja turnira"}})
}


export default{
    get,
    dodaj,
    obrisi,
    promjeni,
    getBySifra,
    getIgre,
    traziTurnir
}