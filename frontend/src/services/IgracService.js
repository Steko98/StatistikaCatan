import { HttpService } from "./HttpService"

async function get() {
    return await HttpService.get('/Igrac')
    .then((odgovor)=>{
        return {greska: false, poruka: odgovor.data}
    })
    .catch((e)=>{console.error(e)})
}

async function getBySifra(sifra) {
    return await HttpService.get('/Igrac/' + sifra)
    .then((odgovor)=>{
        return {greska:false, poruka: odgovor.data}
    })
    .catch(()=>{
        return {greska: true, poruka: 'Igrač nije pronađen'}
    })
}

async function obrisi(sifra) {
    return await HttpService.delete('/Igrac/' + sifra)
    .then((odgovor)=>{
        return {greska:false, poruka: odgovor.data}
    })
    .catch(()=>{
        return {greska: true, poruka: 'Igrač nije pronađen'}
    })
}

async function dodaj(igrac) {
    return await HttpService.post('/Igrac', igrac)
    .then((odgovor)=>{
        return {greska:false, poruka: odgovor.data}
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
                return {greska: true, poruka: 'Igrač se ne može dodati'}
        }
    })
}

async function promjeni(sifra, igrac) {
    return await HttpService.put('/Igrac/' + sifra, igrac)
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
                return {greska: true, poruka: 'Igrač se ne može promjeniti'}
        }
    })
}

export default{
    get,
    getBySifra,
    obrisi,
    dodaj,
    promjeni
}