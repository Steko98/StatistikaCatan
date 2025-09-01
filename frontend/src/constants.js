export const RouteNames = {
    HOME: '/',

    TURNIR_PREGLED: '/turniri',
    TURNIR_NOVI: '/turniri/dodaj',
    TURNIR_PROMJENI: '/turniri/:sifra',
    TURNIR_DETALJI: '/turnir/:sifra',

    IGRE_PREGLED: '/igre', //ne koristi se
    IGRE_NOVI: '/igre/dodaj/:sifra',
    IGRE_PROMJENI: '/igre/:sifra', //ne koristi se
    IGRA_POJEDINACNO: '/igra/:sifra',

    IGRACI_PREGLED: '/igraci',
    IGRAC_NOVI: '/igraci/dodaj',
    IGRAC_PROMJENI: '/igraci/:sifra',
    IGRAC_POJEDINACNO: '/igrac/:sifra',

    CLAN_PREGLED: '/clanovi', //ne koristi se
    CLAN_NOVI: '/clan/dodaj/:sifra',
    CLAN_PROMJENI: '/clanovi/:sifra', //ne koristi se

    LOGIN: '/login',
    ERA: '/era',
    REGISTER: '/register'
}

export const BACKEND_URL='https://steko98-001-site1.ntempurl.com';
// export const BACKEND_URL='https://localhost:7141';