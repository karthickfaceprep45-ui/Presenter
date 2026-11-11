// api/trigger.js
// Receives an event from the frontend and broadcasts it via Pusher Channels.
// The Pusher secret is kept server-side only.

const Pusher = require('pusher');

let pusherClient = null;

function getPusher() {
  if (!pusherClient) {
    pusherClient = new Pusher({
      appId:   process.env.PUSHER_APP_ID,
      key:     process.env.PUSHER_KEY,
      secret:  process.env.PUSHER_SECRET,
      cluster: process.env.PUSHER_CLUSTER,
      useTLS:  true,
    });
  }
  return pusherClient;
}

const ALLOWED_EVENTS = new Set([
  'class-started',
  'image-changed',
  'class-ended',
  'class-state',   // heartbeat for late-joining students
]);

module.exports = async function handler(req, res) {
  // CORS headers (needed for local dev with vercel dev)
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { channel, event, data } = req.body || {};

  // ── Validation ──────────────────────────────────────────────
  if (!channel || !event || data === undefined) {
    return res.status(400).json({ error: 'Missing required fields: channel, event, data' });
  }

  // Channel must be room-XXXXXX (6 digits)
  if (!/^room-\d{6}$/.test(channel)) {
    return res.status(400).json({ error: 'Invalid channel name' });
  }

  if (!ALLOWED_EVENTS.has(event)) {
    return res.status(400).json({ error: 'Event not allowed' });
  }

  // ── Broadcast ───────────────────────────────────────────────
  try {
    await getPusher().trigger(channel, event, data);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[trigger] Pusher error:', err.message);
    return res.status(500).json({ error: 'Failed to broadcast event' });
  }
};

