# Kulku – julkaisu App Storeen ja Google Playhin

Sovellus käännetään pilvessä Codemagicilla, joten Macia ei tarvita.
Sinun osuutesi ovat tilit ja maksut. Muut asetukset on tehty valmiiksi.

## Valmiina repossa

| Tiedosto | Tehtävä |
|---|---|
| `index.html` | Sovellus (sama verkossa ja puhelimessa) |
| `mobile/` | Capacitor-mobiiliprojekti: asetukset, kuvakkeiden piirto, lupien lisäys |
| `codemagic.yaml` | Pilvikäännökset: `ios-release` ja `android-release` |
| `tietosuoja.html` | Tietosuojaseloste, julkaistaan osoitteessa kulku.app/tietosuoja.html |

- Sovelluksen tunniste (Bundle ID / Package name): **app.kulku**
- Nimi: **Kulku**, versio 1.0.0
- Mobiilisovelluksen ominaisuudet: sijainti (lähin kaupunki), suosikit ja muistutus 15 min ennen lähtöä, alanavigaatio ja offline-tila

## 1. Kehittäjätilit (sinä)

**Apple Developer Program:** developer.apple.com/programs. Vuosimaksu, henkilöllisyyden vahvistus. Hyväksyntä kestää yleensä 1–2 päivää.

**Google Play Console:** play.google.com/console. Kertamaksu ja henkilöllisyyden vahvistus.
Uudella henkilötilillä sovellusta pitää testata suljetusti vähintään **12 testaajalla 14 päivän ajan** ennen kuin sen voi julkaista kaikille. Testaajiksi käyvät kaverit ja perhe Gmail-osoitteellaan.

## 2. Codemagic (kerran)

1. Kirjaudu osoitteessa codemagic.io GitHub-tunnuksilla ja lisää repo `tolonjan/Kulku`.
2. **Android-avain:** Team settings → Code signing identities → Android keystores → Upload.
   Lataa `kulku-upload.jks`, reference name `kulku_keystore`, salasanat tiedostosta `KULKU-AVAIN-OHJE.txt`.
3. **Apple-avain:** App Store Connect → Users and Access → Integrations → App Store Connect API → luo avain (rooli App Manager).
   Codemagicissa: Team settings → Integrations → Developer Portal → lisää avain nimellä **Kulku ASC**.

## 3. Sovellustietueet kauppoihin (sinä)

**App Store Connect:** Apps → + → New App
- Platform iOS, nimi Kulku, kieli suomi, Bundle ID **app.kulku**
  (jos sitä ei ole listalla, aja ensin Codemagicissa `ios-release`, joka luo sen), SKU `kulku`
- Kopioi App Information -sivulta **Apple ID** (numero) ja vaihda se `codemagic.yaml`:n kohtaan `APP_STORE_APPLE_ID`

**Google Play Console:** Create app → nimi Kulku, kieli suomi, App, Free

## 4. Käännökset

- Codemagicissa aja **Kulku iOS (App Store)**. Valmis versio menee automaattisesti TestFlightiin.
- Aja **Kulku Android (Google Play)**. Lataa Artifacts-kohdasta `.aab`-tiedosto ja vie se Play Consolessa:
  Testing → Closed testing → Create release.

## 5. Kauppasivun tiedot

**Tietosuojaselosteen osoite:** https://kulku.app/tietosuoja.html
(lisää selosteeseen yhteyssähköposti ennen lähetystä)

**Tukisivu / Support URL:** https://kulku.app

**Kategoria:** Matkailu (Travel) · **Ikäraja:** 4+ / Kaikki · **Hinta:** ilmainen

**Tietojen keruu (App Privacy / Data safety):** Ei kerätä tietoja. Sijaintia käytetään vain laitteella eikä sitä lähetetä.

### Suomi

**Nimi:** Kulku – junat, bussit, laivat
**Alaotsikko (iOS, 30 merkkiä):** Kaikki lähdöt yhdestä paikasta
**Lyhyt kuvaus (Google, 80 merkkiä):** Junat, bussit, laivat ja lennot kaupungeittain samassa lähtötaulussa.

**Kuvaus:**
Kulku kokoaa kaupungin kaikki lähdöt yhteen: junat, paikallisbussit, laivat ja lennot samassa näkymässä, reaaliajassa.

• Valitse kaupunki tai anna Kulkun löytää lähin
• Näe lähtevät ja saapuvat, raide, laituri ja portti
• Myöhästymiset ja peruutukset heti näkyvissä
• "Minne pääsee?" näyttää suosituimmat kohteet ja seuraavan lähdön
• Tallenna lähtö suosikiksi ja saat muistutuksen 15 minuuttia ennen
• Toimii myös ilman verkkoa viimeksi haetuilla tiedoilla
• Lipunhaku vie suoraan VR:n, HSL:n, laivayhtiön tai lentoyhtiön sivulle

Mukana 15 kaupunkia Helsingistä Rovaniemelle. Tiedot: Fintraffic Digitraffic, Digitransit ja Finavia.

**Avainsanat (iOS, 100 merkkiä):** juna,bussi,laiva,lento,aikataulu,lähtö,VR,HSL,Finavia,satama,asema,lentokenttä,Waltti

### English

**Name:** Kulku – trains, buses, ferries
**Subtitle:** Every departure in one place
**Short description:** Trains, buses, ferries and flights by city in one live departure board.

**Description:**
Kulku brings every departure in a Finnish city together: trains, local buses, ferries and flights in one live board.

• Pick a city or let Kulku find the nearest one
• See departures and arrivals with track, berth and gate
• Delays and cancellations at a glance
• "Where can I go?" shows popular destinations and the next departure
• Save a departure and get a reminder 15 minutes before
• Works offline with the latest fetched data
• Ticket search opens VR, HSL, the ferry line or the airline directly

15 cities from Helsinki to Rovaniemi. Data: Fintraffic Digitraffic, Digitransit and Finavia.

## 6. Kuvakaappaukset

Kauppoihin tarvitaan kuvakaappaukset (iPhone 6,9" ja Android-puhelin).
Ne saa ottamalla puhelimella kuvia Kulkusta TestFlight- tai testiversiosta, tai Claude voi tehdä ne valmiiksi.

## Apple-tarkastusta varten (Notes for Review)

> Kulku is a native departure board for Finnish cities. Native features: location (nearest city),
> local notification reminders for saved departures, offline mode with cached timetables, and tab navigation.
> No login required.
