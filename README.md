# Universal Nautic — website redesign

A static, dependency-free rebuild of the Universal Nautic website: editorial,
architectural, monochromatic. Plain HTML/CSS/JS — no build step, no
framework. Open any `.html` file through a static server and it works.

## Running locally

```
python3 -m http.server 8000
```

then visit `http://localhost:8000/`.

## Structure

```
index.html                 Homepage
about.html
team.html
contact.html
privacy.html / terms.html  Placeholder legal pages
services/
  index.html                Services overview
  interior.html
  deck.html
  carpets-flooring.html
projects/
  index.html                Projects gallery
  project-01.html … project-05.html
assets/
  css/style.css              Design system + all component styles
  js/main.js                 Header scroll state, mobile nav, scroll reveal, contact form
```

## Why there are no photographs yet

This build was produced without access to the real Universal Nautic
photography or the current logo file (no assets were present in the
repository, and the live site could not be fetched from this environment).
Rather than fill the gaps with stock or AI-generated imagery — which the
brief explicitly rules out — every image slot uses a deliberate, labelled
placeholder (the `.media` component in `assets/css/style.css`): a warm
stone-coloured panel with a thin architectural border and a small caption
naming what belongs there.

**To finish the site:** replace each `.media` block's placeholder markup
with a real `<img>`, e.g.

```html
<!-- before -->
<div class="media" data-ratio="wide">
  <div class="media-label"><span>Interior — image to be supplied</span><span>02</span></div>
</div>

<!-- after -->
<div class="media" data-ratio="wide">
  <img src="/assets/images/services/interior-01.jpg"
       alt="Hand-stitched leather cabin upholstery aboard a superyacht"
       loading="lazy" width="1600" height="900">
</div>
```

Keep the wrapping `.media[data-ratio]` div (it reserves the aspect ratio so
the layout doesn't shift) and drop the `.media-label` line once a real image
is in place. Hero images (`data-ratio="hero"` inside `.hero`) can stay
`loading="eager"`/unset since they're above the fold; everything else should
keep `loading="lazy"`.

## Logo and colour

No logo file was supplied, so the palette is the brief's safe default:
warm ivory (`--ivory`), dark charcoal (`--charcoal`) and a muted warm grey
(`--grey-warm`) — see the `:root` block at the top of `style.css`. Once the
real logo is available, derive any supporting accent from it there; the
current wordmark lockup in the header (`.logo`) can be swapped for an
`<img>`/inline SVG in the same spot in each page's `<header>`.

## Contact details

Email, phone number and street address are marked "pending confirmation"
throughout (footer, `contact.html`) rather than invented — fill these in
once confirmed, in every page's footer and in `contact.html`.

## Project names

`projects/project-01.html` … `project-05.html` use generic, non-invented
placeholder titles (e.g. "Interior Refit", "Deck Restoration"). Replace the
titles, category tags and copy with real project details as they're
confirmed — do not publish invented yacht names, launch years, or lengths.

## Contact form

`contact.html`'s form currently has `action="#"` and shows a "not yet
connected" message on submit (see `assets/js/main.js`). Point `action` at a
real form backend (e.g. Formspree, Netlify Forms) to make it live.
