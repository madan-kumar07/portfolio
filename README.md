# Signal Studio — Madankumar A

Open **Signal-Studio.html** in Chrome, Edge, Firefox or Safari to explore the portable portfolio. The same ZIP includes the editable Vite project and its static production build. External project demos, Google Drive and email links require the visitor's normal network or email app.

## Experience

The opening point cloud transforms from headphones into a vinyl record for TuneFlow AI and a serving dome for Smart Canteen. Native scrolling and three direct scene buttons control the sequence. Each project scene opens the matching case study. Reduced-motion visitors can use the scene buttons without automatic transitions. Devices without WebGL use still renders of all three original objects.

The project archive presents the two builds on a dimensional monitor with switchable interface studies. Case studies document project implementation and architecture. Additional sections cover education, skills and contact. A procedurally projected city responds to scrolling behind the contact form.

## Develop and deploy

Use Node.js 20 or newer. Run `npm ci`, then `npm run dev`. Run `npm run build` for TypeScript checks, bundling and prerendering. Run `npm run preview` to inspect the production output. On Vercel, choose the project directory, the Vite preset, `npm run build` and the `dist` output directory. Update the domain in `index.html`, `public/sitemap.xml` and `public/robots.txt` when using a different public URL.

After building, `node scripts/portable.mjs Signal-Studio.html` produces a standalone copy.

## Content and controls

- `src/scenes/transmission.ts` defines the three parametric shapes, their point lighting and the interpolated transitions.
- `src/components/SignalIntro.tsx` handles scroll thresholds, manual selection, still images and motion preferences.
- `src/components/Work.tsx` contains the project selector and expandable architecture views.
- `src/components/CityPassage.tsx` renders the contact backdrop on demand.
- `src/data/portfolio.ts` contains the profile, project information and supplied public Drive résumé URL. The offline résumé edition remains available in the command menu and terminal.
- Ctrl/Cmd+K opens quick navigation. The footer opens the developer terminal.
- The contact form opens an addressed email draft unless a public HTTPS endpoint is configured through `.env.example`.

The interface studies are illustrations of the projects. Project links and résumé permissions are maintained by their respective hosts. No third-party portfolio artwork is included.
## Verification

The production build passed TypeScript and Vite checks. Browser checks exercised the scroll-driven scene sequence, motion control, both project selectors, case-study navigation, architecture tabs, the site menu, keyboard search and the supplied résumé URL. Seven viewport widths from 320 to 1920 pixels passed horizontal-overflow checks. A separate mobile check disabled WebGL and verified the embedded still rendering. No browser console errors were recorded in the primary interaction run.
