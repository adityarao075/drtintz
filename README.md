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
| `js/main.js` | Mobile nav, dropdowns, Inquire modal, headline animation, scroll reveals, counters, FAQ accordion, form delivery |
| `assets/img/` | Photos and logo |

## Things to update before launch

- **Stats banner** (`index.html`, `data-count` attributes): years of experience, review count, vehicles tinted, training hours are placeholders.
- **Forms**: the Inquire modal and the contact page form post to FormSubmit (`https://formsubmit.co/doctortintz@gmail.com`), which relays each submission to that inbox. The very first submission triggers a one-time activation email to doctortintz@gmail.com; click the link in it once and all later submissions arrive normally. Submissions are sent in the background with a success message shown on the page; if JavaScript is off, the form posts normally and FormSubmit shows its own thank-you page.
- **Locations dropdown**: Atlanta (1996 Dekalb Ave NE, 30307) and Marietta (1905 Airport Industrial Park Dr SE, Suite A, 30060). The Marietta address came from public directory listings; confirm it.
- **Inquire**: the nav button opens a modal form (name, email, phone, service type, message). See **Forms** above for delivery.
- **Legal pages**: privacy policy and terms are the business's own text (Tanked Tinterz LLC, last updated February 25, 2026).

## Brand

- Fonts: Figtree (headings, light weight 400), Manrope (body), loaded from Google Fonts.
- Layout alternates dark and light: photo hero, black intro and stats, light grey Services with white full-width cards, white testimonial and FAQ, second supercar photo band for the CTA, black footer.
- Buttons: soft sky-blue pills (`--accent: #29abe0`, sampled from the logo) with a black arrow circle on the right. Tokens live at the top of `css/styles.css`; add `theme-light` to any section to flip it to light colors.
- Hero and CTA both use `assets/img/hero-supercars.jpg` as a full-bleed backdrop.
