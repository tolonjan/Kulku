# Kulku

Kaupunkikohtainen lähtötaulu, joka yhdistää junat, bussit, laivat ja lennot.

## Rakenne

| Tiedosto | Tehtävä |
|---|---|
| `index.html` | Itse sovellus (yksi tiedosto) |
| `api/flights.js` | Välipalvelin Finavian lentotiedoille: `GET /api/flights?dir=dep&apt=OUL` |
| `api/digitransit.js` | Välipalvelin Digitransitin bussitiedoille: `POST /api/digitransit?router=waltti` |

Junat ja laivat haetaan suoraan Fintrafficin Digitrafficista. Se ei vaadi avainta.
Lennot ja bussit kulkevat välipalvelimen kautta, joten avaimet pysyvät palvelimella eivätkä näy sovelluksen koodissa.

## Julkaisu Verceliin

1. Luo GitHubiin uusi repo, esimerkiksi `kulku`, ja lataa sinne tämän kansion sisältö.
2. Kirjaudu osoitteessa vercel.com (GitHub-tunnuksilla) ja valitse **Add New → Project**. Valitse sitten repo.
3. Lisää ennen julkaisua kohtaan **Environment Variables**:
   - `FINAVIA_KEY` = Finavian portaalin Primary key
   - `DIGITRANSIT_KEY` = Digitransitin Primary key
   - `FINAVIA_APP_ID` (valinnainen), vain jos Finavia antaa erillisen app_id:n
4. Paina **Deploy**. Framework-asetus on "Other", eikä build-komentoa tarvita.
5. Sovellus toimii osoitteessa `https://<projekti>.vercel.app`, ja se käyttää välipalvelinta automaattisesti.

### Oma verkkotunnus kulku.app

Valitse Vercelissä **Settings → Domains → Add** ja syötä `kulku.app`. Lisää sitten verkkotunnuksen
rekisteröijälle ne DNS-tietueet, jotka Vercel näyttää. HTTPS-varmenne tulee automaattisesti.

## Testaus

- Lennot: avaa `https://<projekti>.vercel.app/api/flights?dir=dep&apt=HEL`. Onnistunut haku näyttää XML:n.
  Virhe näkyy JSON-muodossa, esimerkiksi `{"error":"api.finavia.fi: HTTP 401"}`.
  - 401 tai 403: avain tai tilaus ei kelpaa
  - 404: rajapinnan osoite on muuttunut. Tarkista se Finavian portaalin APIs-sivulta ja päivitä `api/flights.js`.
- Sovelluksen asetuksissa (liukusäädinkuvake) näkyy jokaisen tietolähteen tila ja mahdollinen virhe.

## Paikallinen ajo

Kun avaat `index.html`:n suoraan koneelta, sovellus ei löydä välipalvelinta. Syötä asetuksiin kohtaan
**Välipalvelin** julkaistun palvelimen osoite (esim. `https://kulku.app`), niin lennot ja bussit haetaan sen kautta.

## Lähteet ja lisenssit

- Junat ja laivat: Fintraffic / digitraffic.fi, CC BY 4.0
- Bussit: Digitransit
- Lennot: Finavia API Developer Portal
