# Deployment Guide

## Current Setup

This app is a **frontend application with Firebase**:
- **Firebase Realtime Database** - Shared data across all users
- **No build process** - Ready to deploy as-is
- **Real-time updates** - See predictions as they're made
- **GitHub + Firebase** - Perfect for multi-user deployment

## Firebase Setup (Required)

This app uses **Firebase Realtime Database** for shared data. You must set up Firebase before deploying.

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name and follow the setup wizard

### Step 2: Enable Realtime Database

1. In Firebase Console, click "Realtime Database"
2. Click "Create Database"
3. Choose location (closest to you)
4. Start in **"Test mode"** (allows read/write for 30 days)

### Step 3: Get Firebase Config

1. Firebase Console → ⚙️ Settings → Project settings
2. Scroll to "Your apps" → Click `</>` (web icon)
3. Register app (any nickname works)
4. Copy the `firebaseConfig` object

### Step 4: Configure App

1. Open `firebase-config.js`
2. Replace placeholder values with your actual Firebase config
3. Save the file

### Step 5: Set Security Rules

In Firebase Console → Realtime Database → Rules:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

⚠️ **Note**: These rules allow anyone to read/write. Fine for a private app with friends. For production, add authentication.

---

## Deployment Options

### Option 1: GitHub Pages (Recommended)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/holleyy/oscar-sweepstakes.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: `main`, Folder: `/ (root)`
   - Save

3. **Your app is live** at: `https://holleyy.github.io/oscar-sweepstakes`

### Option 2: Netlify

1. Push code to GitHub
2. Go to [Netlify](https://netlify.com)
3. "Add new site" → "Import an existing project"
4. Connect GitHub repo
5. Deploy! (Auto-deploys on every push)

### Option 3: Vercel

1. Install: `npm i -g vercel`
2. Run: `vercel` in project folder
3. Follow prompts

---

## File Structure

```
Oscar Sweep/
├── index.html          (Main HTML file)
├── style.css           (Pixel art styling)
├── script.js           (App logic + Firebase integration)
├── firebase-config.js  (Firebase config - YOU NEED TO FILL THIS IN)
├── README.md           (Setup instructions)
├── DEPLOYMENT.md       (This file)
└── .gitignore         (Git ignore file)
```

**No package.json, no node_modules, no build process!**

---

## Quick Start Checklist

- [ ] Create Firebase project
- [ ] Enable Realtime Database
- [ ] Copy Firebase config to `firebase-config.js`
- [ ] Set database security rules
- [ ] Push code to GitHub
- [ ] Deploy to GitHub Pages / Netlify / Vercel
- [ ] Test the app - add a user and make predictions
- [ ] Share with friends!

## Firebase Database Structure

The app uses this structure in Firebase:

```
{
  "users": {
    "Alice": true,
    "Bob": true
  },
  "predictions": {
    "Alice": {
      "Best Picture": {
        "shouldWin": "One Battle After Another",
        "willWin": "Hamnet"
      }
    }
  },
  "winners": {
    "Best Picture": "One Battle After Another"
  }
}
```

## Troubleshooting

**"Firebase is not defined" error:**
- Check that Firebase SDK is loaded in `index.html`
- Verify `firebase-config.js` is included before `script.js`
- Make sure you've filled in your Firebase config

**Data not saving:**
- Check Firebase Console → Realtime Database → Rules
- Verify rules allow read/write
- Check browser console for errors

**Can't see other users:**
- Make sure everyone is using the same Firebase project
- Check that database rules allow reading
- Verify Firebase config is correct
