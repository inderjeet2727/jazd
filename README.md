# Jaz Dhami – website

One-page site built from the Figma file **JazD-01** (1200px desktop frame, 7 sections:
intro, dedication, discovery, join my tribe, socials, shop, footer).
Plain HTML/CSS/JS – no build step. Upload the folder as it is.

```
index.html            page (all copy lives here)
css/styles.css        layout + type; breakpoints at 700px and 1024px
js/main.js            parallax + signup form
assets/img, assets/svg   Figma images (see "Assets" below)
fonts/                self-hosted web fonts + licences
netlify.toml, .nojekyll  deploy helpers
tools/download-figma-assets.sh   re-downloads the Figma assets
```

## Assets

The Figma photos and graphics are already in `assets/img/` (5 optimised JPGs) and `assets/svg/` (18 SVGs),
so the site works as soon as you open `index.html` or upload the folder.

If you ever need to re-download them from Figma, run this from the folder in Terminal:

```
bash tools/download-figma-assets.sh
```

The Figma download links expire after about 7 days; if they fail, ask Claude for fresh ones.

## Layout and parallax

* **≥1024px** – pixel-faithful to Figma. Every element is placed with its Figma coordinates
  (`--x`, `--y`, `--w`, `--h` in each element's `style`) inside a centred 1200px stage; photos run full-bleed.
* **700–1023px (tablet)** and **<700px (mobile)** – single column, larger type, same order as the design.
* **Parallax** – each photo layer drifts slower than the page; text groups carry a `data-depth`
  (positive = faster than the page, negative = slower). Tune the section-level `data-parallax`
  (0 = off, ~0.3 = default) and each `data-depth` in `index.html`. It is switched off automatically for
  visitors with "reduce motion" turned on, and damped on small screens.

## Fonts

| Design font | Used here (free) |
| --- | --- |
| Instrument Sans | Instrument Sans (variable) |
| OCR A Std | Share Tech Mono |
| Arial Unicode MS (Punjabi) | Noto Sans Gurmukhi |
| Arial | Arimo |
| Libre Barcode 128 | Libre Barcode 128 |

All are SIL Open Font Licence; licences are in `fonts/`.

## Things to fill in

* **Social links** in `index.html` currently point at each platform's home page – swap in Jaz's real profile URLs.
* **Signup form** is wired for Netlify Forms (works automatically once deployed on Netlify; submissions appear in the
  Netlify dashboard). On GitHub Pages there is no form backend, so replace the `<form>` with your mailer's embed
  (Mailchimp, Mailerlite, etc.).
* **Text to double-check** (copied exactly from Figma): the shop clock reads "Summer 2005 GMT" while the rest says 2025.
* **Share image**: add an `og:image` tag once you have a picture you want on link previews.

## Deploy

**Netlify** – drag this folder onto https://app.netlify.com/drop (or connect the GitHub repo; publish directory `.`, no build command).

**GitHub Pages** – push the folder to a repo → Settings → Pages → deploy from the `main` branch, `/ (root)`.

## Pointing your domain at it

1. **Netlify:** Site configuration → Domain management → Add a domain, then follow the DNS instructions it shows
   (either switch the domain's nameservers to Netlify, or add the CNAME/A records it lists at your registrar).
2. **GitHub Pages:** Settings → Pages → Custom domain. At your registrar add four `A` records for the apex domain
   (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`) and a `CNAME` for `www` pointing to
   `<your-username>.github.io`. GitHub adds a `CNAME` file to the repo for you.
3. Turn on HTTPS in the same screen once DNS has propagated (can take from minutes to a day).
