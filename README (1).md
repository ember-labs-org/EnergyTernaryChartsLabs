# A Three-Way View of Energy History · Ember Labs

An interactive ternary chart of how the world's energy mix has moved between three corners, Electrons (electricity), Fossil, and Bio & other, from 1900 to 2023, for regions and countries.

**Made by:** Daan Walter, Ember Futures (Electrotech Revolution)
**Source repo:** [dmw24/EnergyTernaryCharts](https://github.com/dmw24/EnergyTernaryCharts). This repo is the Ember Labs fork of it.

## What it does

- Each point is a region or country's energy mix in the selected year; its trail shows how the mix moved over time.
- Switch between **final** energy demand (as delivered, e.g. electricity at the socket) and **useful** energy demand (after conversion losses).
- Show the trail **annually** or as a **5-year average**.
- Choose any of 8 regions and 13 countries.
- Play the years forward at 1×, 2× or 5×, or drag the year slider.

## Data

Source: IIASA, IEA and Electrotech Revolution team analysis (as stated on the chart). The processed data is in `data.json`.

The Python scripts that build it (`generate_all_charts.py`, `process_uk_data.py`) read input files from Daan's own computer, which aren't in the repo, so the data can't yet be rebuilt from here.

**Before wider promotion:** confirm the IEA's terms allow publishing the derived data (with Ember's data team).

## How it's built

Plain HTML, CSS and JavaScript with D3, with no build step: `index.html`, `styles.css`, `app.js` and `data.json`.

## The Ember Labs version

Daan's files are unchanged. The Labs version adds:

| File | What it does |
| --- | --- |
| `labs.css` | The Ember Labs look (Rey Dizon's `ember-labs-branding` skill): navy and canvas surfaces, Poppins, Labs controls, sharp corners, no shadows. Hides the Electrotech banner, and lets the page grow to its full height so the Labs frame fits it |
| `labs.js` | Series colours from the Labs chart palette, in selection order: World in white, then yellow, blue, green, pale blue and pale yellow; any more in slate grey. Opens with World plus four series (the US, China, India and Europe) |
| `analytics.js` | Cookieless usage tracking with Umami, labelled `tool: energy-ternary-chart` |

Plus a few lines in `index.html`: Poppins, `labs.css`, iframe-resizer, Umami, and the two Labs scripts. A comment marks them.

**Not included yet:** the UK version (since 1700), in `UK version/`.

## Keeping this fork up to date

**Daan's repo is the source of truth** for the chart, its data and its text.

- When Daan updates his repo, click **Sync fork → Update branch**, never Discard.
- After syncing, check that the Labs lines are still in `index.html` (search for "Ember Labs").
- `labs.css` and `labs.js` rely on Daan's class names and on `COUNTRY_CONFIG`, `selectedCountries` and the `renderList`, `updateChart` and `renderLegend` functions in `app.js`. If he renames them, update the Labs files to match.

## Analytics

| Event | When | Details |
| --- | --- | --- |
| `setting_changed` | energy type, trail or speed changed | setting (`energy_type`, `trail`, `speed`), value |
| `option_toggled` | a region or country added or removed, or Select all | option, on |
| `animation_played` · `animation_paused` | Play / Pause | — |
| `slider_set` | the year slider released | control `year`, value |
| `point_inspected` | hovering a series' current point | series |

Only real visitor actions count: the code-made clicks the speed buttons use to restart playback are ignored.
