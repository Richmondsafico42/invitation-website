# 🎉 Birthday Invitation Website

A single-page birthday invitation built with **React + Vite**. Features a hero
banner with animated confetti, a live countdown to the party, an event details
section, and an RSVP form with client-side validation.

## Customizing

All event details live in [`src/eventConfig.js`](src/eventConfig.js) — edit the
celebrant name, age, date, venue, dress code, etc. The countdown uses `dateISO`.

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build into dist/
npm run preview  # preview the production build
npm run lint     # run ESLint
```

## Project structure

```
src/
  App.jsx              # page layout (hero, details, RSVP, footer)
  eventConfig.js       # all editable event details
  components/
    Countdown.jsx      # live countdown timer
    RsvpForm.jsx       # RSVP form with validation
  App.css, index.css   # styles
```
