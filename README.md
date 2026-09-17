# Doctor Tintz — website

Static rebuild of doctortintz.com. No build step, no framework: plain HTML, CSS, and a small vanilla JS file.

## Run locally

Open `index.html` directly, or serve the folder:

```
python -m http.server 8000
```

then visit http://localhost:8000.

## Structure

| Path | Purpose |
| --- | --- |
| `index.html` | Home: hero, stats, services, testimonial, FAQ, CTA |
| `about.html` | Founders, story, shop |
| `contact.html` | Contact info, map, quote form |
| `privacy-policy.html`, `terms-and-conditions.html` | Legal pages |
| `css/styles.css` | All styles (design tokens at the top under `:root`) |
| `js/main.js` | Mobile nav, headline animation, scroll reveals, counters, FAQ accordion, contact form |
| `assets/img/` | Photos and logo |

## Things to update before launch

- **Stats banner** (`index.html`, `data-count` attributes): years of experience, review count, vehicles tinted, training hours are placeholders.
- **Contact form**: currently opens the visitor's email app with a pre-filled message. To receive submissions in an inbox, add `action="https://formspree.io/f/YOUR_ID" method="POST"` (or any form endpoint) to the `<form>` in `contact.html`; the JS fallback steps aside automatically.
- **Locations dropdown**: Atlanta (1996 Dekalb Ave NE, 30307) and Marietta (1905 Airport Industrial Park Dr SE, Suite A, 30060). The Marietta address came from public directory listings; confirm it.
- **Inquire**: the nav button opens a modal form (name, email, phone, service type, message). It uses the same mailto fallback as the contact page; set an `action` on the form to post to a real endpoint.
- **Legal pages**: the privacy policy and terms are generic starting points and should be reviewed before publishing.

## Brand

- Fonts: Figtree (headings, light weight 400), Manrope (body), loaded from Google Fonts.
- Layout alternates dark and light: photo hero, black intro and stats, light grey Services with white full-width cards, white testimonial and FAQ, second supercar photo band for the CTA, black footer.
- Buttons: soft sky-blue pills (`--accent: #29abe0`, sampled from the logo) with a black arrow circle on the right. Tokens live at the top of `css/styles.css`; add `theme-light` to any section to flip it to light colors.
- Hero and CTA both use `assets/img/hero-supercars.jpg` as a full-bleed backdrop.
