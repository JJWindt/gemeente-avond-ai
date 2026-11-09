# Gemeenteavond AI

Slides en visualisaties voor de gemeenteavond over AI.

## Belangrijkste regel: alleen content aanpassen

**Pas alleen content aan. Wijzig bestaande visualisaties nooit zonder expliciete toestemming van de gebruiker.**

- **Wel zonder vragen:** teksten, titels, bijschriften, volgorde en inhoud van slides in `slides/inhoud/*.js`.
- **Niet zonder expliciete toestemming:**
  - de visualisaties in `visualisaties/` (zijn goedgekeurd en af);
  - de engine in `slides/engine/` (`deck.js`, `deck.css`): slidetypes, layouts, animaties, kleuren en stijl;
  - het uiterlijk, de layout of animaties van bestaande slides;
  - de stijl in `stijlen/`, foto's in `slides/fotos/` en logo's in `slides/logos/`.
- Lijkt een contentwijziging een visuele aanpassing nodig te hebben? Stop en vraag het eerst. Leg uit wat er zou veranderen.
- "Ga je gang" of toestemming voor één wijziging geldt niet voor andere visualisaties of latere wijzigingen.

## Structuur

- `slides/intro.html`, `slides/deel-1.html`, `slides/avond.html`: decks per onderdeel en de hele avond.
- `slides/inhoud/*.js`: de content per onderdeel (`window.SLIDES`).
- `slides/engine/`: gedeelde engine die de slides en visualisaties weergeeft.
- `visualisaties/`: losse visualisaties met stappen, die als iframe in de slides staan.
- Openen via de lokale server (`.claude/launch.json` → `slides`), niet via `file://`.
