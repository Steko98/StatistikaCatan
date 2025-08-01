import { HttpService } from "./HttpService";

async function get() {
    return await HttpService.get('/Igra')
    .then((odgovor)=>{

        return {greska: false, poruka: odgovor.data}
    })
    .catch((e)=>{
        return {greska: true, poruka: 'Problem kod dohvaćanja igre'}
    })
}


async function getBySifra(sifra) {
    return await HttpService.get('/Igra/' + sifra)
    .then((odgovor)=>{
        return {greska:false, poruka: odgovor.data}
    })
    .catch((e)=>{
        return {greska: true, poruka: 'Igra nije pronađena'}
    })
}

async function obrisi(sifra) {
    return await HttpService.delete('/Igra/' + sifra)
    .then((odgovor)=>{
        return {greska:false, poruka: odgovor.data}
    })
    .catch(()=>{
        return {greska: true, poruka: 'Igra nije pronađena'}
    })
}

async function dodaj(igra) {
    return await HttpService.post('/Igra', igra)
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
                return {greska: true, poruka: 'Igra se ne može dodati'}
        }
    })
}

async function promjeni(sifra, igra) {
    return await HttpService.put('/Igra/' + sifra, igra)
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
                return {greska: true, poruka: 'Igra se ne može promjeniti'}
        }
    })
}

// async function traziIgra(uvjetPocetak, uvjetKraj) {
//     const uvjeti = new uvjeti;
//     return await HttpService.get(`Igra/trazi?${uvjeti}`)
//     .then ((odgovor)=>{
//         return {greska: false, poruka: odgovor.data}
//     })
//     .catch ((e)=>{return {greska: true, poruka: "Problem kod traženja igre"}})
// }

export default{
    get,
    getBySifra,
    obrisi,
    dodaj,
    promjeni,
    traziIgra
}