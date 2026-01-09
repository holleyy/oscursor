# Oscar Sweepstakes 2026

A pixel art-style sweepstakes app for predicting Oscar winners with friends. Built with vanilla JavaScript and Firebase Realtime Database.

## Features

- 🎬 Predict winners in 15 Oscar categories
- 👥 Multiple users - no login required, just enter a name
- 📊 Compare predictions with friends
- 🏆 Enter actual winners and see who got the most correct
- 🎨 Pixel art retro aesthetic
- ⚡ Real-time updates via Firebase

## Setup Instructions

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter a project name (e.g., "oscar-sweepstakes")
4. Disable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Realtime Database

1. In your Firebase project, click on "Realtime Database" in the left sidebar
2. Click "Create Database"
3. Choose a location (pick the closest to you)
4. **Important**: Start in **"Test mode"** for development
   - This allows read/write access for 30 days
   - For production, you'll need to set up proper security rules

### 3. Get Your Firebase Config

1. In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the `</>` (web) icon
5. Register your app (you can use any nickname)
6. Copy the `firebaseConfig` object

### 4. Configure the App

1. Open `firebase-config.js` in this project
2. Replace the placeholder values with your Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "your-project-id.firebaseapp.com",
    databaseURL: "https://your-project-id-default-rtdb.firebaseio.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};
```

### 5. Set Up Security Rules (Important!)

In Firebase Console → Realtime Database → Rules, use these rules for a simple shared app:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**⚠️ Warning**: These rules allow anyone to read/write. For a private app with friends, this is fine. For production, consider adding authentication.

### 6. Deploy to GitHub

1. Initialize git (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create a new repository on GitHub

3. Push your code:
   ```bash
   git remote add origin https://github.com/yourusername/oscar-sweepstakes.git
   git branch -M main
   git push -u origin main
   ```

### 7. Deploy to GitHub Pages (Optional)

1. Go to your GitHub repository
2. Click "Settings" → "Pages"
3. Under "Source", select "Deploy from a branch"
4. Choose "main" branch and "/ (root)" folder
5. Click "Save"
6. Your app will be live at: `https://yourusername.github.io/oscar-sweepstakes`

### Alternative: Deploy to Netlify/Vercel

**Netlify:**
1. Push to GitHub
2. Go to [Netlify](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repo
5. Deploy!

**Vercel:**
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project folder
3. Follow the prompts

## File Structure

```
Oscar Sweep/
├── index.html          # Main HTML file
├── style.css           # Pixel art styling
├── script.js           # App logic + Firebase integration
├── firebase-config.js  # Firebase configuration (you need to fill this in)
├── README.md           # This file
└── DEPLOYMENT.md       # Detailed deployment guide
```

## How It Works

- **Users**: Enter a name to join. Names are stored in Firebase.
- **Predictions**: Select "Should Win" and "Will Win" for each category using radio buttons.
- **Winners**: Enter actual winners after the Oscars ceremony.
- **Results**: See scores and compare predictions with all users.

## Firebase Database Structure

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
- Make sure Firebase SDK is loaded before `firebase-config.js`
- Check that `firebase-config.js` is included in `index.html`

**Data not saving:**
- Check Firebase Console → Realtime Database → Rules
- Make sure rules allow read/write
- Check browser console for errors

**Can't see other users' predictions:**
- Make sure Firebase is properly configured
- Check that you're using the same Firebase project
- Verify database rules allow reading

## License

Free to use for personal projects!
# oscursor
