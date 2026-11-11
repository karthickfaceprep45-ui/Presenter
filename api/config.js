// api/config.js
// Returns the public Pusher config to the frontend.
// PUSHER_KEY and PUSHER_CLUSTER are safe to expose client-side.

module.exports = function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.json({
    pusherKey:     process.env.PUSHER_KEY     || '',
    pusherCluster: process.env.PUSHER_CLUSTER || '',
  });
};

