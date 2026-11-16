// Introductie (Vincent). Script: Google Doc, tab "Vincent".
window.SLIDES = (window.SLIDES || []).concat([
  // Titel
  // Grote titel laag links verankerd, datum als losse regel onderaan; .ox trekt elke regel optisch op de marge.
  { type: 'title', h1: true, grad: true, layout: 'anchor',
    h: '<span class="ox" style="--ox:-11px">Artificial</span><br><em class="ox" style="--ox:-15px">Intelligence</em>',
    tagline: '<span class="ox" style="--ox:-2px">Gemeenteavond<span class="sep">·</span>10 november</span>',
    notes: 'Titel van de avond; staat in beeld terwijl iedereen binnenkomt. Daarna direct de krantenkoppen.' },

  // 2. Waarom deze avond?
  { type: 'headlines', sub: 'Wie het nieuws volgt, ziet het overal',
    items: [
      ['Werk', 'Startersvacatures in drie jaar gehalveerd', 'Intelligence Group · NOS'],
      ['Werk', 'Driekwart van de Nederlanders vreest banenverlies door AI', 'CBS · NL Times'],
      ['Fraude', 'Videogesprek met financieel directeur bleek volledig nep', 'Arup maakte 25,5 miljoen dollar over'],
      ['Jongeren', '1000 van de 1300 jongeren bespreken hun problemen met een chatbot', 'NOS'],
      ['Onderwijs', 'Raad van State buigt zich over AI-fraude bij scripties', 'De bronnen bleken door AI verzonnen'],
      ['Energie', 'Datacenters gebruiken dit jaar 5 keer zoveel stroom als heel Nederland', 'Gartner'],
    ],
    notes: '“Wie het nieuws volgt, ziet het overal. Startersbanen halveren. Jongeren die hun hart luchten bij een chatbot in plaats van bij hun ouders. […]” NB: de spreektekst noemt nog “een man die 1,2 miljoen kwijtraakt”; op de slide staat de Arup-kop (25,5 miljoen dollar via een nep-videogesprek). De eerste kop staat er meteen; elke klik voegt een kop toe.' },
  // Nettoverlies $80,7 miljard, waarvan ~72 miljard boekhoudkundig; uitgaven aan rekenkracht en infrastructuur bijna 9 miljard (S-1).
  { type: 'loss', sub: 'Anthropic, de maker van Claude', n: 80, unit: 'miljard dollar verlies',
    caption: 'in het eerste halfjaar van 2026.<br>Alleen al aan rekenkracht: 9 miljard.',
    credit: 'Bron: beursprospectus (S-1) van Anthropic, via CNBC · nettoverlies $80,7 miljard',
    notes: '“En kijk naar het geld. Een bedrijf van vijf jaar oud, dat dit jaar alleen al tientallen miljarden verlies maakte…” Op de achtergrond tekent zich een dalende koerslijn. NB: ongeveer 72 van de 80 miljard is een boekhoudkundige post (herwaardering van converteerbare leningen), geen geld dat echt is uitgegeven. Daarom noemt de onderregel de echte uitgaven: bijna 9 miljard dollar aan rekenkracht in een halfjaar, vier keer zoveel als een jaar eerder.' },
  // Verwachte beurswaarde volgens de FT: $1,25–1,75 biljoen; het midden ($1,5 biljoen) omgerekend tegen ~1,15 dollar per euro.
  // Bbp Nederland 2025: ~1.190 miljard euro (CBS: tekort 19 miljard = 1,6% bbp).
  { type: 'compare',
    items: [['Anthropic', '1,3', 'biljoen euro', 'verwachte beurswaarde,<br>een bedrijf van vijf jaar oud'],
            ['Nederland', '1,2', 'biljoen euro', 'alles wat ons land<br>in een jaar verdient']],
    credit: 'Bronnen: Financial Times (verwachte waardering $1,25–1,75 biljoen) · CBS (bbp 2025)',
    notes: '“…wordt deze maand op de beurs mogelijk meer waard dan alles wat heel Nederland in een jaar verdient.” Klik: Nederland erbij. “Zo groot is het geloof in wat AI gaat worden.” NB: de verwachte waardering zakte in oktober/november van ~2 naar 1–1,75 biljoen dollar; check vlak voor de avond het laatste nieuws (beursgang gepland week voor Thanksgiving, kan schuiven).' },
  { type: 'statement', sub: 'Uit het eigen beursprospectus', text: 'Hun AI kan een risico zijn voor de mensheid.', accent: 'risico',
    credit: 'Bron: beursprospectus (S-1) van Anthropic: AI “could pose catastrophic or existential risks to society”',
    notes: '“En in datzelfde beursprospectus waarschuwt het bedrijf zelf dat hun AI een risico voor de mensheid kan zijn.”' },
  { type: 'statement', center: true, text: 'Geen reden tot angst. Wel urgent.', accent: 'urgent', maxw: 1320,
    notes: '“Dit is geen hype die overwaait. Het raakt ons werk, onze kinderen en wat we nog als waar kunnen aannemen. Wij geloven niet dat AI een reden is om bang te zijn. Maar het is wel urgent. We willen jullie vanavond verwonderen, en tegelijk de magie eraf halen.”' },

  // 3. Waarom wíj?
  { type: 'statement', center: true, text: 'Wie zijn wij?', accent: 'wij',
    notes: '“Waarom staan wíj hier? We zijn geen theologen en geen professors. Maar we werken alle drie elke dag met AI, en we zien van dichtbij hoe hard het gaat.”' },
  // Grote namen: een balk in de bedrijfskleur veegt over de regel en onthult de naam; baan en toelichting schuiven in, daarna een tegel in de bedrijfskleur met het logo.
  { type: 'team2', variant: 'wipe', builds: 2,
    items: [
      { h: 'Johannes', role: 'AI-engineer', note: 'Bachelor én master Artificial Intelligence',
        logoInk: 'coolblue.svg', logoInkH: 130, brand: 'linear-gradient(135deg, #0068c2 0%, #0090e3 55%, #36b0f7 100%)' },
      { h: 'Vincent', role: 'Managing Director', note: 'Bouwde en verkocht twee softwarebedrijven',
        logoInk: 'channable-stacked-wit.svg', logoInkH: 120, brand: 'linear-gradient(135deg, #1b1a3a 0%, #27418e 55%, #9e216d 100%)' },
      { h: 'Paul', role: 'De enige echte engineer', note: 'Bouwt met AI elke app in minuten',
        logoInk: 'boerma-media-wit.png', logoInkH: 92, brand: 'linear-gradient(135deg, #0b0b0b 0%, #1f1f1f 55%, #6a0d15 100%)' },
    ],
    notes: 'Johannes staat er meteen. “Johannes heeft een bachelor én een master in AI en is AI-engineer bij Coolblue: ruim 2,5 miljard euro omzet, bekend om z’n klantenservice. Hij automatiseert die klantenservice met AI-agents; de volgende keer dat je Coolblue belt of chat, praat je dus eigenlijk met Johannes.” Klik: Vincent. “Ikzelf heb de afgelopen vijf jaar een advertentieplatform gebouwd voor meer dan 500 webshops… Channable: de data en tracking van ruim 20.000 klanten.” [Eventueel: Rituals, Coolblue en Albert Heijn zijn klant.] Klik: Paul. “Johannes en ik hebben dus vooral mooie titels. Maar dan Paul… Waar jij nog drie apps nodig hebt om een afspraak te maken, heeft Paul er gewoon eentje voor gebouwd.”' },

  // 4. Wat gaan we doen vanavond?
  { type: 'agenda', sub: 'Vanavond',
    items: [['Deel 1', 'The state of AI', 'Wat is AI? Wat is een LLM? Wat kan het nu al?', '30 min'],
            ['Pauze', '', '', '15 min'],
            ['Deel 2', 'Hoe kijken we hier als christenen naar?', 'Thema’s en een gespreksronde', '60 min'],
            ['Deel 3', 'Praktisch', 'Voorbeelden voor thuis, werk en kerk', '']],
    notes: '“We willen jullie vanavond twee dingen geven. In deel 1 laten we zien wat er nu al mogelijk is, en dat is meer dan de meesten denken. Maar we willen ook de magie eraf halen: als je snapt hoe het werkt, zie je ook wat het níet is. Daarom beginnen we met uitleg en demo’s. Na de pauze gaan we samen in gesprek: hoe kijken we hier als christenen naar? Daar hebben wij ook niet alle antwoorden op.” Deel 3 is praktisch en heeft geen eindtijd. → Johannes, deel 1.' },
]);
