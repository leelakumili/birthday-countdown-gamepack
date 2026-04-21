# Deployment & Installation Guide

This project is a fully static site — no server, no build step, no npm. Pick the delivery method that fits your situation.

---

## 1. Local play (fastest, no internet needed)

### Option A — Double-click (Chrome / Safari)

1. Clone or download the repo as a ZIP and unzip it
2. Open `config/app-config.js` and fill in `playerName`, `birthdayDate`, and `activeTheme`
3. Double-click `index.html`

Works on Windows, macOS, and Linux. The service worker (PWA offline caching) is **disabled** on `file://` URLs — everything still plays, but the app won't install to the home screen this way.

### Option B — Local server (enables full PWA)

Service workers require `http://localhost` or HTTPS. Run any of these in the project root:

```bash
# Python 3
python3 -m http.server 8080

# Node (npx, no install required)
npx serve .

# VS Code — install the "Live Server" extension, then click "Go Live"
```

Then open `http://localhost:8080` in your browser.

---

## 2. GitHub Pages (free, HTTPS, shareable link)

1. Push this repo to your GitHub account
2. Go to **Settings → Pages**
3. Set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`
4. Click **Save**
5. Your URL will be `https://<your-username>.github.io/<repo-name>/`

The service worker activates automatically over HTTPS — full offline support and PWA install prompt work out of the box.

> **Keep clues private?** Use a private repo. GitHub Pages works on private repos with a GitHub Pro/Team/Enterprise plan. Alternatively use Netlify (see below) which supports private deploys on its free tier.

---

## 3. Netlify (drag-and-drop, free tier)

1. Go to [netlify.com](https://netlify.com) and create a free account
2. From the dashboard, click **Add new site → Deploy manually**
3. Drag the entire project folder onto the upload area
4. Netlify assigns a URL like `https://random-name-123.netlify.app`
5. Optionally rename it under **Site settings → Site name**

No configuration files needed — Netlify serves the root `index.html` automatically.

---

## 4. Vercel (free tier)

1. Go to [vercel.com](https://vercel.com) and create a free account
2. Click **Add New → Project**
3. Import from GitHub, or use the CLI:
   ```bash
   npx vercel --prod
   ```
4. Accept all defaults (framework: Other, output directory: `.`)
5. Vercel assigns a `https://<project>.vercel.app` URL

---

## 5. Sharing with family (no hosting required)

If you want to hand the game to a relative without any hosting:

1. **Zip the folder** (right-click → Compress / Send to Zip)
2. Send the ZIP by email, AirDrop, WhatsApp, or USB
3. Recipient unzips and double-clicks `index.html`

Works offline, no account needed. Same caveat as Option A — no PWA install prompt, but all 10 games play fine.

---

## 6. Installing as a PWA (Add to Home Screen)

Once the app is served over HTTPS (GitHub Pages, Netlify, Vercel, or `localhost`):

### iOS (Safari)
1. Open the URL in Safari
2. Tap the **Share** button → **Add to Home Screen**
3. Tap **Add**

### Android (Chrome)
1. Open the URL in Chrome
2. Tap the **⋮ menu** → **Add to Home screen** (or tap the install banner if it appears)
3. Tap **Install**

### Desktop (Chrome / Edge)
1. Open the URL
2. Click the **install icon** (⊕) in the address bar
3. Click **Install**

After installation, the app launches full-screen with no browser chrome and works completely offline.

---

## 7. Customizing before you ship

Open `config/app-config.js` and update:

| Field | What to change |
|-------|---------------|
| `playerName` | Your child's name |
| `birthdayDate` | `"YYYY-MM-DD"` format |
| `activeTheme` | `"panda"` / `"penguin"` / `"transformer"` / `"brainrot"` / `"pirate"` / `"dino"` / `"minecraft"` / `"pokemon"` / `"unicorn"` / `"space"` |
| `themes.<theme>.games.dayN.clue` | The real-world treasure hunt hint for each day |

No other files need to be touched to fully customize the pack.

---

## 8. Resetting progress

All game progress is stored in the browser's `localStorage` under the key `birthday_adventure_state_v2`.

To reset for a fresh start:

- **DevTools**: Open DevTools → Application → Local Storage → delete the key
- **In-app**: From the launcher, open the player modal, remove the player, and re-add them

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Games don't unlock | Check `birthdayDate` in `app-config.js` — format must be `YYYY-MM-DD`. Use `todayOverride` to test a specific day. |
| Service worker not updating after a change | Open DevTools → Application → Service Workers → click **Update** or **Unregister**, then hard-refresh |
| Blank screen on iOS | Ensure you are using Safari (not Chrome/Firefox on iOS) for `file://` access |
| App not installable | The page must be served over HTTPS or `localhost` — `file://` URLs do not support PWA install |
| Clue shows "undefined" | Make sure the theme key in `activeTheme` exactly matches a key under `themes` in `app-config.js` |
