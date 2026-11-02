# SkillKart — Student-First Opportunities Marketplace

SkillKart is an interactive, unified marketplace connecting university student creators with businesses and startups for real digital, creative, and technical projects.

---

## 🚀 Instant Deployment Options

The project is completely self-contained and ready for immediate deployment on any platform:

### 1. Deploy on Vercel
- **Option A (CLI):** Run `npx vercel` in the project root directory.
- **Option B (Dashboard):** Push to GitHub and import the repository on [vercel.com](https://vercel.com).
- A pre-configured `vercel.json` with security headers and caching is already included.

### 2. Deploy on Netlify
- **Option A (CLI):** Run `npx netlify deploy --prod --dir .`
- **Option B (Drag & Drop):** Go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag this folder into the window.
- A pre-configured `netlify.toml` is included.

### 3. Deploy on GitHub Pages
1. Push this repository to GitHub.
2. In your repository, go to **Settings** → **Pages**.
3. Under **Build and deployment**, select **Source: Deploy from a branch** and choose `main` / `/ (root)`.
4. Click **Save**. The `.nojekyll` and `404.html` files ensure zero configuration is needed.

### 4. Local Preview
To preview locally:
```bash
npm start
# Or using any static file server:
# npx serve .
# python -m http.server 8000
```
Then open `http://localhost:3000` (or `http://localhost:8000`) in your browser.

---

## 📁 Key Files
- `index.html`: Unified single-page application containing all views (Home, Projects Marketplace, Student Talent Directory, Services, Messenger, Dashboard) and interactive modals.
- `style.css`: Unified editorial design system (Playfair Display, Manrope, DM Mono).
- `script.js`: Reactive view router, local state manager, search debouncing, and booking workflows.
- `favicon.svg`: Brand icon with dual-petal mark.
- `manifest.json`: Web App Manifest for mobile and PWA installation.
- `robots.txt` & `sitemap.xml`: Production search engine indexing configuration.
- `vercel.json` & `netlify.toml`: Production hosting configuration.

