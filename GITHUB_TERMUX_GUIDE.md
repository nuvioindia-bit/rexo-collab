# Rexo Collab - GitHub + Termux Complete Guide

## Important Notice

**Ye project ek React Vite PWA (Progressive Web App) hai, native Android APK nahi.**

- Ye **static website** (HTML/CSS/JS) banata hai
- Direct `.apk` file GitHub Actions se nahi banegi
- APK ke liye **Capacitor** ya **Cordova** wrapper add karna padega (maine abhi nahi kiya)
- Automatic build **web deployment** banayega jo "Add to Home Screen" se native app jaisa kaam karega

---

## Quick Fix: GitHub Actions Error (Permanent Solution)

### Problem Analysis

Error aa raha tha: `ERROR packages field missing or empty`

**Root Cause:**
- `pnpm-workspace.yaml` file thi jisme sirf `catalog` tha, lekin `packages` field nahi thi
- GitHub Actions `setup-node` with `cache: "pnpm"` step mein `pnpm store path` command chalta hai
- Lekin `pnpm` workspace config ke wajah se ye command fail ho jati hai kyunki workspace packages define nahi the
- Isliye `pnpm` error deta hai: "packages field missing or empty"

**Permanent Fix Applied:**
1. `pnpm-workspace.yaml` delete kar di gayi (single project hai, monorepo nahi)
2. `.npmrc` add kiya gaya for pnpm compatibility
3. Both workflow files (`build.yml` & `release.yml`) update kiye gaye:
   - `pnpm/action-setup@v4` with `run_install: false` (latest version, no auto-install)
   - `setup-node` mein `cache: "pnpm"` aur `node-version: "22"` (fast + stable)
   - `pnpm install` without `--frozen-lockfile` (flexible, avoids lockfile mismatch)
   - Clean sequence: checkout → setup pnpm → setup node → install → type check → lint → build → upload

**Steps:**
1. Nayi zip file download karein ya updated files ko replace karein
2. `git add . && git commit -m "Fix pnpm workspace and CI build" && git push origin main`
3. GitHub Actions automatically green ho jayega

---

## Step 1: Termux Mein GitHub Repository Push Karna

### 1.1 Termux Install Karein

Play Store se **Termux** install karein (ya F-Droid se latest version).

### 1.2 Required Packages Install Karein

```bash
pkg update && pkg upgrade -y
pkg install git nodejs-lts openssh -y
```

### 1.3 Git Config Set Karein

```bash
git config --global user.name "Aapka Naam"
git config --global user.email "aapka@email.com"
```

### 1.4 SSH Key Generate Karein

```bash
ssh-keygen -t ed25519 -C "aapka@email.com"
cat ~/.ssh/id_ed25519.pub
```

Ye public key copy karein.

### 1.5 GitHub Par SSH Key Add Karein

1. Browser mein jayein: `github.com/settings/keys`
2. "New SSH key" click karein
3. Title: `Termux Mobile`
4. Key type: `Authentication Key`
5. Paste karein woh key jo `cat` command se aayi
6. "Add SSH key"

### 1.6 Project Ko GitHub Par Push Karein

**NOTE:** Is project ko aapko pehle apne GitHub account mein ek nayi repository bana kar usme push karna hoga.

```bash
# Apne project folder mein jayein
cd /path/to/rexo-collab

# Git init (agar pehle se nahi hai)
git init

# Saari files add karein
git add .

# Commit karein
git commit -m "Initial commit: Rexo Collab PWA"

# GitHub repository connect karein
git remote add origin git@github.com:AAPKA_USERNAME/rexo-collab.git

# Push karein
git branch -M main
git push -u origin main
```

---

## Step 2: GitHub Pages Auto Deploy Setup

### 2.1 Repository Settings

1. GitHub par repository kholen
2. **Settings** tab par jayein
3. Left sidebar mein **Pages** select karein
4. Source: **GitHub Actions**

### 2.2 Workflow Already Included Hai

`.github/workflows/build.yml` already present hai. Jab aap `git push` karenge, yeh automatically:

- Dependencies install karega
- Type check karega
- Build karega
- GitHub Pages par deploy karega

### 2.3 Deploy Check Karein

Push ke baad:

1. Repository par **Actions** tab kholen
2. Build progress dekhein
3. Green tick aa jaye toh deploy ho gaya
4. URL: `https://aapka-username.github.io/rexo-collab`

---

## Step 3: Release Banwana (Tags)

### 3.1 Tag Create Karein Termux Se

```bash
git tag -a v1.0.0 -m "Version 1.0.0 - Initial Release"
git push origin v1.0.0
```

### 3.2 Automatic Release

Tag push hote hi:
- Build hoga automatically
- `rexo-collab-web.zip` file release mein attach hogi
- GitHub Releases page par download milega

---

## Step 4: PWA Ko Phone Par Install Karna

### 4.1 Browser Se Install

1. Deployed URL (`https://aapka-username.github.io/rexo-collab`) Chrome/Safari mein kholen
2. Address bar ke side mein **"Add to Home Screen"** ya **Install** button dikhega
3. Click karein
4. App phone ke home screen par aa jayegi

### 4.2 PWA Features

- Offline kaam karega (service worker hai)
- Full screen experience
- No browser UI
- Push notifications support
- Works like a native app

---

## Step 5: APK Kaise Banein (Advanced)

**Agar aapko REAL APK chahiye**, toh aapko ye karna hoga:

### Option A: Capacitor Add Karein

```bash
npm install @capacitor/core @capacitor/cli
npx cap init "Rexo Collab" "com.rexo.collab" --web-dir dist
npx cap add android
npm run build
npx cap copy android
cd android
./gradlew assembleDebug
```

**Note:** Ye Android Studio + SDK chahiye, Termux mein possible nahi.

### Option B: Online Converter Use Karein

Websites jaise `gonative.io` ya `appmaker.xyz` par PWA URL daal kar APK bana sakte hain.

---

## Step 6: Daily Development Workflow

### Changes Push Karna

```bash
# Code edit karein (Termux mein nano/vim se)
cd /path/to/rexo-collab

# Changes check karein
git status

# Add karein
git add .

# Commit
git commit -m "Feature: new campaign filter added"

# Push
git push origin main
```

### Auto Build Dekhna

Push ke turant baad GitHub Actions automatically:
- Build karega
- Deploy karega
- 2-3 minute mein live ho jayega

---

## File Structure (Important Files)

```
rexo-collab/
├── .github/workflows/     # CI/CD automation
│   ├── build.yml           # Auto build + deploy on push
│   └── release.yml         # Create release on tag
├── public/                 # Static assets
│   ├── manifest.json       # PWA manifest
│   ├── sw.js              # Service worker
│   ├── icon-192x192.png   # App icon small
│   ├── icon-512x512.png   # App icon large
│   └── favicon.png        # Browser icon
├── src/                    # Source code
│   ├── pages/             # All screens
│   ├── components/        # Reusable UI
│   ├── stores/            # Global state
│   └── data/              # Mock data
├── index.html             # Entry HTML
├── vite.config.ts         # Build config
├── tailwind.config.js     # Styling config
└── package.json           # Dependencies
```

---

## Troubleshooting

### Build Fail Ho Raha Hai

GitHub Actions > Failed build > Logs check karein.
Common issues:
- Type errors: `src/` mein `.ts`/`.tsx` files check karein
- Missing dependency: `pnpm install` se theek hoga

### Deploy Nahi Ho Raha

1. Settings > Pages > Source = GitHub Actions verify karein
2. Actions tab mein error message check karein
3. `.github/workflows/build.yml` syntax check karein

### Icons Nahi Dikhe

`public/` folder mein icons verify karein:
- `icon-192x192.png`
- `icon-512x512.png`
- `manifest.json` mein paths sahi hon

---

## Summary

| Feature | Status |
|---------|--------|
| Auto build on push | Yes (GitHub Actions) |
| Auto deploy to web | Yes (GitHub Pages) |
| Release ZIP on tag | Yes |
| Native APK | No (PWA hai, web app hai) |
| Install on phone | Yes (PWA "Add to Home Screen") |
| Offline support | Yes (Service Worker) |

**Har push ke saath automatic build aur deploy ho jayega. Aapko kuch nahi karna!**
