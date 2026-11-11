# Presenter

A real-time classroom presentation app with **Admin**, **Mentor**, and **Student** roles. Built with vanilla HTML/JS, [Pusher Channels](https://pusher.com/channels) for real-time sync, and deployable to [Vercel](https://vercel.com) with zero configuration.

---

## How it works

| Role | Responsibility |
|------|----------------|
| **Admin** | Generates a 6-digit room code and shares it with the Mentor and Students |
| **Mentor** | Enters the code, starts the class, and navigates between the 3 presentation images |
| **Student** | Enters the code and sees each image change in real time as the Mentor controls them |

---

## Setup

### 1. Create a free Pusher account

1. Sign up at [pusher.com](https://pusher.com) (free — up to 100 connections).
2. Create a new **Channels** app.
3. Choose the cluster nearest to you (`us2`, `eu`, `ap2`, etc.).
4. Copy the four credentials from the **App Keys** tab:
   - App ID
   - Key
   - Secret
   - Cluster

### 2. Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_REPO)

1. Import or push this project to Vercel.
2. In your Vercel project settings → **Environment Variables**, add:

   | Name | Value |
   |------|-------|
   | `PUSHER_APP_ID` | *(your App ID)* |
   | `PUSHER_KEY` | *(your Key)* |
   | `PUSHER_SECRET` | *(your Secret)* |
   | `PUSHER_CLUSTER` | *(your Cluster, e.g. `us2`)* |

3. Click **Deploy**.

### 3. Local development

```bash
# Install dependencies
npm install

# Copy the env template
cp .env.example .env.local
# Fill in your Pusher credentials in .env.local

# Start the local dev server
npx vercel dev
```

Then open `http://localhost:3000`.

---

## Project structure

```
presenter/
├── index.html          # Single-page app (all UI + logic)
├── api/
│   ├── config.js       # Returns public Pusher config to the frontend
│   └── trigger.js      # Broadcasts Pusher events (uses secret server-side)
├── package.json
├── vercel.json
└── .env.example
```

---

## Customising the images

The three presentation images are defined at the top of `index.html`:

```js
const IMAGES = [
  'https://...image1...',
  'https://...image2...',
  'https://...image3...',
];
```

Replace each URL with any publicly accessible image. The viewer uses a 16:9 aspect ratio with `object-fit: cover`.

---

## Notes

- **No database required.** Room state lives in the Mentor's browser tab.  
- **Late joiners:** The Mentor's browser sends a silent heartbeat every 10 seconds while the class is live, so a student who joins mid-session will catch up within 10 seconds.  
- **Room codes** are randomly generated on the client; they simply name the Pusher channel. Any 6-digit code can be reused across separate sessions.

