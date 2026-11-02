<div align="center">
  <img src="favicon.svg" alt="SkillKart Logo" width="84" height="84" />
  <h1>SkillKart</h1>
  <p><strong>Your Skills. Your Opportunities.</strong></p>
  <p><em>A student-first marketplace connecting ambitious emerging campus talent with founders, startups, and businesses for meaningful real-world projects.</em></p>

  <p>
    <a href="https://github.com/saurabh222007/skillkart/stargazers"><img src="https://img.shields.io/github/stars/saurabh222007/skillkart?style=flat-square&color=302e81" alt="Stars" /></a>
    <a href="https://github.com/saurabh222007/skillkart/network/members"><img src="https://img.shields.io/github/forks/saurabh222007/skillkart?style=flat-square&color=302e81" alt="Forks" /></a>
    <a href="https://github.com/saurabh222007/skillkart/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-cdf26b.svg?style=flat-square&labelColor=182129" alt="License" /></a>
    <img src="https://img.shields.io/badge/status-production--ready-cdf26b.svg?style=flat-square&labelColor=182129" alt="Status" />
    <img src="https://img.shields.io/badge/mobile--ready-100%25-302e81.svg?style=flat-square" alt="Mobile Ready" />
  </p>
</div>

---

## 💡 About SkillKart

Students possess immense creativity, modern technical skills, and fresh perspectives, but often struggle to cross the threshold from academic exercises to their first credited client brief. Meanwhile, early-stage founders and small businesses need high-quality digital work without hefty agency retainers.

**SkillKart** bridges this gap:
- **For Students:** Find scoped, fair-budget opportunities, build a verified portfolio, deliver milestones, and launch your career while in college.
- **For Businesses & Founders:** Discover vetted student talent across software development, brand design, video editing, social growth, and data analytics.

---

## ✨ Core Features & Modules

### 1. 💼 Projects Marketplace (`#projects`)
- **Real-Time Keyword Search:** Powered by an SVG search icon with instant debouncing and 1-click clear (`×`).
- **Category Filter Pills:** Swipeable tabs for *Design & Creative*, *Development*, *Video & Media*, *Marketing & Growth*, *Data & Analytics*, and *Writing*.
- **Dropdown Controls:** Filter by experience level (*Beginner*, *Intermediate*, *Advanced*), location (*Remote Only*, *Ahmedabad Local*), and sort by budget or deadline.
- **Interactive Project Cards:** Displays client logo, fixed budget, deadline counter, and saved bookmark hearts (`♡` / `♥`) with `localStorage` persistence.
- **Detailed Scope Inspector:** Inspect full deliverables checklists, client background, and required toolkits.
- **Application Workflow:** Submit proposals with custom bid amounts and pitch notes that immediately sync to your dashboard.

### 2. 🎓 Discover Student Talent Directory (`#discover`)
- **24 Comprehensive Student Profiles:** Spanning premier colleges (IIT Gandhinagar, NID Ahmedabad, DA-IICT, CEPT, MICA, Nirma, PDEU, NIFT).
- **9 Specialized Disciplines:** Developers, UI/UX & Brand Designers, Photography & Media, Writers, Marketers, Data & AI/ML, 3D/CAD Architects, Fashion Stylists, and Virtual Assistants.
- **Two-Way Selection Paths:** Select via the toolbar dropdown or the top category pills with bidirectional state sync.
- **View Mode Switcher:** Toggle seamlessly between a multi-column **Grid View** and a detailed **List View**.
- **Rich Profile Modal:** Explore animated skill proficiency meters, visual portfolio thumbnails, client review histories, response times, and spoken languages.
- **4-Step Booking Wizard:** Step-by-step service customization (Service Selection → Budget & Deadline → Communication Preference → Summary Confirmation) that tracks in the dashboard.

### 3. ⚡ Services Catalog (`#services`)
- 6 in-depth disciplines (Web & Mobile Development, Visual Identity & Brand Design, Video Editing & Content Media, Digital Marketing & Growth, Copywriting & Strategy, Data & Technical Specialties).
- Deep-links directly to pre-filtered student talent and project briefs with a single click.

### 4. 💬 Interactive Messenger (`#messages`)
- Split-pane conversation manager with unread message badges.
- Search conversations with a dedicated SVG icon.
- Live chat stream with timestamps, outgoing/incoming bubbles, and embedded project proposal cards with "Review & Confirm" actions.
- Simulated real-time responses: contact replies automatically ~800ms after sending with toast notifications.
- Integrated voice and video call scheduling simulation modals.

### 5. 📊 Business & Student Dashboard (`#dashboard`)
- Live stat counters tracking **Active Bookings**, **Submitted Applications**, **Saved Projects**, and **Completed Transactions**.
- **Interactive Booking Manager:** Click "Simulate student acceptance" to transition a booking to accepted status.
- **Simulated Escrow Payment Checkout:** Test transparent checkout with fee breakdown, demo payment rails (UPI Demo, Card Demo, Net Banking), and generation of official receipt reference codes (`SKD-XXXXXX`).
- Direct 1-click access to submitted applications and saved project bookmarks.

### 6. 📝 Post a Project Workflow
- Available from any page via the top navigation `Post a project ↗` CTA.
- Fill in title, discipline, budget, timeline, level, location, tags, and description.
- Posts dynamically to the live marketplace with instant toast confirmation and counter updates.

### 7. 📱 Mobile-First Responsive Design
- Enforced `overflow-x: hidden` with zero horizontal scrolling on mobile viewports.
- Responsive sticky header with animated hamburger toggle and slide-out navigation drawer (`#mobileDrawer`).
- Horizontally swipeable category pill bars with native touch momentum (`-webkit-overflow-scrolling: touch`).
- Single-column stacked layouts on mobile screens for all filter toolbars, cards, and modal dialogs.

---

## 🎨 Design System & Brand Identity

| Element | Specification |
| :--- | :--- |
| **Emblem** | Interlocking dual-petal leaves: Primary Indigo (`#302e81`) rotated 38° + Accent Lime (`#cdf26b`) rotated -142° |
| **Typography** | Headlines: `Playfair Display` (Serif)<br>Body/UI: `Manrope` (Sans-Serif)<br>Tags/Code: `DM Mono` (Monospace) |
| **Color Palette** | **Deep Ink:** `#182129` · **Rich Indigo:** `#302e81` · **Vibrant Lime:** `#cdf26b` · **Warm Cream:** `#f7f4ee` |

---

## 🛠️ Architecture & Tech Stack

- **Zero Heavy Frameworks:** Built with modern, standard-compliant semantic **HTML5**, **CSS3**, and **Vanilla JavaScript (ES6+)**.
- **Client-Side Hash Router:** Hash-based SPA router supporting `#home`, `#projects`, `#discover`, `#services`, `#messages`, `#dashboard`, and `#how` with browser Back/Forward navigation.
- **State Persistence:** Local storage synchronization for saved project IDs, submitted applications, bookings, and transaction receipts.
- **PWA & Production Ready:** Includes `manifest.json`, `favicon.svg`, `robots.txt`, `sitemap.xml`, and `404.html`.

---

## 🚀 Deployment Guide

### Option 1: Cloudflare Pages (Recommended)
1. Go to [dash.cloudflare.com](https://dash.cloudflare.com/) → **Compute (Workers & Pages)** → **Pages** → **Connect to Git**.
2. Select your GitHub repository: `saurabh222007/skillkart`.
3. Set Framework Preset to **None** and leave the build command blank.
4. Click **Save and Deploy**. Your site goes live instantly on Cloudflare's global edge network!

### Option 2: Vercel
Run via terminal or import in the Vercel dashboard:
```bash
npx vercel
```
*Pre-configured `vercel.json` with security headers and caching is included.*

### Option 3: Netlify
Deploy via Netlify CLI or drag-and-drop the directory into [app.netlify.com/drop](https://app.netlify.com/drop):
```bash
npx netlify deploy --prod --dir .
```
*Pre-configured `netlify.toml` is included.*

### Option 4: GitHub Pages
1. In your GitHub repository, open **Settings** → **Pages**.
2. Under **Build and deployment**, select **Deploy from a branch** and choose `main` / `/ (root)`.
3. Click **Save**.

### Option 5: Local Preview
```bash
npm start
# Or using any static server:
# npx serve .
# python -m http.server 8000
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). Built for emerging campus talent.
