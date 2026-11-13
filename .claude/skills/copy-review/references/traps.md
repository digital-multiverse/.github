# Known traps, per language

One line each: trap → why → fix. Add every new one found in a review (with project and date).

## Spanish (es-ES)

- **colgar** → also "to freeze/crash" (se cuelga) and "to upload/post" (colgar fotos). A
  screen that «se cuelga» is broken. Use «parece un cuadro colgado en la pared». (remembart 2026-11)
- **colgarla / tenerla con pronombre suelto** → the reader can't tell what «la» is (the app?
  the TV?). Name the noun or use «tenerla» only when the app is the obvious subject. (remembart 2026-11)
- **al salir** → "when I leave" before "when it comes out". Use «cuando salga». (remembart 2026-11)
- **tú + vosotros mixed** → «Avísame» on the button but «Avisadme» in the mail subject is
  fine only if the subject is the user writing to us; otherwise pick one register per page.
- **actualmente / eventualmente / realizar / librería** → false friends of currently /
  eventually / to realise / library.
- **Gerundio de posterioridad** («Instala la app, pudiendo elegir…») → AI and translationese
  tell; split into two sentences.
- **Title Case** («Marcos Dignos De Una Pared») → Spanish headings use sentence case.
- **Missing ¿ ¡** → always open questions and exclamations.
- **«wifi»** → RAE accepts «wifi» lowercase; keep it consistent with the app.
- **AI tells in Spanish:** «en el mundo actual», «sin lugar a dudas», «descubre cómo»,
  «potenciar», «sumérgete», «llevar al siguiente nivel», «no solo X, sino también Y» as a reveal.
- **«X dignos de una pared»** → calque of "worthy of a wall"; say what is true: «Marcos que parecen de verdad». (remembart 2026-11)
- **«Ascua», «Pulso», «Rastro» as common words** → in a game whose canonical names are these words, the common word reads as the name (affinity, tier). Use a synonym: «Cada brasa», not «Cada ascua». (echoes 2026-11)
- **«lo único» / «el único» for a genderless being** → reads as a thing or as masculine; use «la única presencia». (echoes 2026-11)

## Italian (it-IT)

- **appendere / si appende** → a screen does not "hang itself"; «lo schermo si appende» makes
  no sense. Use «sembra un quadro appeso alla parete». (remembart 2026-11)
- **all'uscita** → reads as "at the exit". Use «quando esce». (remembart 2026-11)
- **di base** → colloquial for "by default"; use «per impostazione predefinita» in UI copy. (remembart 2026-11)
- **E' instead of È** → wrong; use the accented capital. Same for «perché» (acute), «è» (grave).
- **tu + Lei mixed** → consumer copy uses «tu» throughout.
- **attualmente / eventualmente / libreria** → false friends.
- **AI tells in Italian:** «nel mondo di oggi», «scopri come», «sblocca», «non solo X, ma
  anche Y» as a reveal, «a portata di clic».
- **fermarsi su una foto** → "to stop (oneself) on a photo"; the person doesn't stop, the photo does: «lasciare fissa una foto». (remembart 2026-11)
- **colore pieno** → understood, but «tinta unita» is the usual term. (remembart 2026-11)
- **«in %s» with a place name** → Italian needs the articulated preposition (nelle Radici, nella Marea, nel giardino); «in il giardino» is ungrammatical. Use «Qualcosa si muove: %s» or one string per place. (echoes 2026-11)
- **«uno» for a genderless being** → it is masculine; use «una presenza». (echoes 2026-11)
- **«un giorno lontano»** → means "a distant day", not "a day away"; use «un giorno d'assenza». (echoes 2026-11)
- **«l'eco» is feminine** in the singular: «Eco dorata», not «Eco dorato». (echoes 2026-11)

## English

- **"hang it"** with an app as the object → you hang photos or a painting, not an app.
  (remembart 2026-11)
- **Alt text describing what isn't in the image** («A TV showing…» on a photo without a TV)
  → describe what is there. (remembart 2026-11)
- **"the screen hangs"** → in tech English "hangs" = freezes, same trap as «se cuelga». Use "looks like a painting on the wall". (remembart 2026-11)

## Every language

- **Where does it appear?** «la dirección que aparece en un ordenador» put the address on the computer, not the TV. In instructions, name the device for each verb: who shows, who types. (remembart 2026-11)
- **Hard-coded English in templates** (`aria-label="Language"`, "Close", "Menu") on es/it pages: screen readers read it in the page language. Grep the templates for English attribute values. (remembart 2026-11)
