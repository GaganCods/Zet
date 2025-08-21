# ZetRocks – All-in-One Online Tools

ZetRocks is a fast, privacy-friendly collection of online tools and guides. It includes developer utilities, text tools, image tools, file tools, utility calculators, and an SEO-friendly blog.

- Homepage: `index.html`
- Tools hub: `tools/index.html`
- Blog: `blog/index.html`
- Legal pages: `legal/privacy-policy.html`, `legal/terms.html`, `legal/about.html`
- Contact: `contact.html`

## Project Structure

- `index.html` – Landing page
- `tools/` – All tool pages, grouped by category
  - `developer-tools/` – Base64, Color Picker, HTML Live Preview, JSON Formatter, URL Encoder/Decoder, etc.
  - `text-tools/` – Case Converter, Lorem Ipsum, Remove Extra Spaces, Text-to-Speech, Word Counter
  - `image-tools/` – Compressor, Converter, Cropper, Resizer, Image-to-Text, YouTube Thumbnail Downloader
  - `file-tools/` – PDF Compressor
  - `utility-tools/` – Age, BMI, Simple Calculator, Time Zone Converter, Unit Converter
- `blog/` – SEO guides and updates with category folders (Development, Image Tools, File Tools, Text Tools, Utility Tools, Productivity)
- `legal/` – Privacy Policy, Terms, About
- `assets/` – Images and icons
- `styles.css`, `tools.css`, `script.js` – Global styles and shared scripts
- `404.html` – Not found page

## Local Development

This is a static site. You can view it by opening `index.html` directly in a browser, but using a local server is recommended so relative paths and fetches work consistently.

- Option 1 (Python):
  ```bash
  # from the project root
  python -m http.server 5500
  # open http://localhost:5500/
  ```
- Option 2 (VS Code Live Server or any static server):
  Start the server from the project root and open the provided URL.

## Deployment

- Host on any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages, or your own server).
- Ensure `sitemap.xml` and `robots.txt` are served at the site root.
- Set canonical base URL to match production (e.g., `https://zetrocks.vercel.app`).

## SEO and Content Strategy

- Clean, ad-free homepage focused on discovery and SEO.
- Tool pages: optimized titles/meta, clear How-to steps, Features, FAQs, related tools; allow banner/sidebar/footer ad slots.
- Blog posts: grouped by category with internal links to relevant tools.
- Generated `sitemap.xml` includes all HTML pages for search engines.

## Updating the Sitemap

If you add or rename pages:
1. Update or regenerate `sitemap.xml` to include the new paths.
2. Optionally update `robots.txt` to reference the sitemap URL.

Example `robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://zetrocks.vercel.app/sitemap.xml
```

## Contributing

- Keep pages lightweight and fast; no heavy frameworks.
- Reuse shared styles/components.
- Maintain accessible markup (labels, alt text, contrast).

## License

MIT (or specify your chosen license).
