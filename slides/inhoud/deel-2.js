// Deel 2 – Hoe kijken we hier als christenen naar? (Paul). Zijn eigen presentatie, als één slide ingebed.
// Schermlink van de live vragenronde (app.paulboerma.nl/live). Elke avond een nieuwe: hier invullen en avond.html herladen.
// Niet committen met de link erin: de repo is openbaar en de link bevat een sleutel.
const LIVE_LINK = '';

window.SLIDES = (window.SLIDES || []).concat([
  { type: 'embed', src: 'deel-2/presentatie.html' + (LIVE_LINK ? '#live=' + encodeURIComponent(LIVE_LINK) : ''), name: 'Deel 2 · Paul',
    notes: 'Pauls presentatie (deel-2/presentatie.html). → en ← bladeren erdoorheen; na de laatste stap volgt deel 3. N toont zijn sprekersnotities, P pauzeert een filmpje.' },
]);
