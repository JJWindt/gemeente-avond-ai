# Gemeenteavond AI: deel 2

De slides van Paul voor de gemeenteavond over AI (NGK Zaltbommel, 10 november 2026): de vragenronde en
"Hoe kijken wij als christenen naar AI?".

Het is één HTML-bestand met een map `media` ernaast. Er is niets te installeren.

## Openen en presenteren

1. Download de repo (groene knop **Code**, dan **Download ZIP**) en pak hem uit.
2. Open `presentatie.html` in Chrome of Safari. Laat de map `media` ernaast staan.
3. Je ziet eerst een overzicht van alle slides. Klik op een slide om vanaf daar te presenteren.

| Toets | Wat het doet |
|---|---|
| `→`, spatie of klik | Volgende stap of slide |
| `←` | Eén stap terug |
| `F` | Volledig scherm |
| `N` | Sprekersnotities aan of uit |
| `P` | Filmpje pauzeren |
| `Esc` | Terug naar het overzicht |

Een filmpje staat eerst stil op het eerste beeld en start bij de volgende klik.

Internet is alleen nodig voor het lettertype (Google Fonts) en de live vragenronde. Zonder internet werkt
alles; je ziet dan een ander lettertype.

## Samenvoegen met een andere presentatie

Dit is een webpagina, geen PowerPoint. Er zijn drie manieren om hem naast of in een andere presentatie
te gebruiken:

- **Wisselen van venster.** Zet dit bestand klaar in een tweede browservenster en wissel bij deel 2.
  Dat is het veiligst.
- **Linken.** Met `presentatie.html#s=5` opent de presentatie meteen op slide 5 (elk nummer kan). Zet
  zo'n link op de laatste slide van het eerste deel.
- **In elkaar schuiven.** Is het andere deel ook HTML, dan kunnen de slides worden overgenomen. Zie
  "Hoe het bestand in elkaar zit".

## De slides

36 slides in zes delen. Slide 1 tot en met 4 horen bij de vragenronde rond de pauze; deel 2 begint op
slide 5.

| Nr | Deel | Slides |
|---|---|---|
| 1–4 | Vragenronde | Meedoen met de QR-code, antwoorden die binnenkomen, woordwolk, twee cijfers |
| 5 | De lijn | Vier stappen: AI stelt ons vragen, de kerk geeft een antwoord, het gaat toch door, wat doen wij? |
| 6–23 | AI stelt ons vragen | Negen risico's met twee filmpjes, daarna zes nog onbeantwoorde vragen |
| 24–28 | De kerk geeft een antwoord | Paus Leo XIV, Magnifica Humanitas: Babel, de keuze, vier zinnen, zijn vraag |
| 29–33 | Het gaat toch door | Filmpje van de makers en Trump, Jacques Ellul, filmpje van Ellul |
| 34–36 | Wat doen wij? | Twee bijbelteksten, dan het gesprek in |

## De live vragenronde

Slide 1 tot en met 4 tonen voorbeelddata, tot je op de overzichtspagina een schermlink plakt bij "Live
vragenronde". Die link komt van Paul (`app.paulboerma.nl/live`). Deelnemers doen mee op
`app.paulboerma.nl/doemee` met de code die op slide 1 staat.

## Hoe het bestand in elkaar zit

Alles staat in `presentatie.html`: eerst de opmaak (`<style>`), dan één script.

- Een slide is 1920 × 1080 en wordt geschaald naar het scherm.
- `chapter('Titel', stap)` begint een deel. `add({ id, steps, html, ... })` voegt een slide toe.
  `video({...})` voegt een filmpje toe, `risk({...})` een punt in de lijst met risico's.
- In de html van een slide laat `data-s="2"` een element pas bij de tweede klik zien. `data-a` laat het
  bij binnenkomst infaden.
- De kleuren en het lettertype staan bovenaan onder `.v-daglicht`.
- `SPEAK` bevat per slide de sprekersnotities die je met `N` ziet.

## Bronnen en rechten

De bronnen staan onderaan de overzichtspagina van de presentatie.

De filmfragmenten zijn kort geknipt uit uitzendingen en films van anderen en zijn alleen bedoeld voor
deze avond. De foto's komen van Wikimedia Commons, met de maker en licentie erbij op de slide. Deel
deze map daarom niet openbaar verder.
