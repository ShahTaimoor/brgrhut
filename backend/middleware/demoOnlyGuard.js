// ============================================================================
// !!! DEMO MODE ONLY !!!
// This file exists solely to lock down the demo-login backdoor (see
// UserService.demoLogin / UserController.demoLogin / routes/userRoutes.js
// POST /demo-login, and the matching frontend demo-login pieces).
//
// DELETE THIS FILE alongside all of the above before any real deployment.
// ============================================================================

const PRIVATE_IPV4_RANGES = [
  /^127\./,                 // loopback
  /^10\./,                  // private class A
  /^192\.168\./,            // private class C
  /^172\.(1[6-9]|2\d|3[0-1])\./, // private class B (172.16.0.0 - 172.31.255.255)
];

const isPrivateOrLoopbackIp = (rawIp) => {
  if (!rawIp) return false;

  // Normalize IPv4-mapped IPv6 addresses (e.g. "::ffff:127.0.0.1") down to IPv4
  const ip = rawIp.startsWith('::ffff:') ? rawIp.slice(7) : rawIp;

  if (ip === '::1' || ip === 'localhost') return true; // IPv6 loopback
  if (/^fc[0-9a-f]{2}:|^fd[0-9a-f]{2}:/i.test(ip)) return true; // IPv6 unique local (fc00::/7)

  return PRIVATE_IPV4_RANGES.some((pattern) => pattern.test(ip));
};

// Blocks the request unless BOTH of these hold:
//   1. NODE_ENV is not explicitly "production" (catches every standard
//      deployment platform - Render, Railway, Heroku, Vercel, Docker images
//      following 12-factor convention, etc. all set this automatically)
//   2. The request is coming from this machine or a private/local network
//      (catches the case where NODE_ENV was never set at all on a public
//      deployment - real internet clients won't have private/loopback IPs)
// Both checks must pass so a single forgotten/misconfigured setting doesn't
// silently reopen this endpoint to the public internet.
const demoOnlyGuard = (req, res, next) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isLocalRequest = isPrivateOrLoopbackIp(req.ip);

  if (isProduction || !isLocalRequest) {
    return res.status(404).json({ success: false, message: 'Route not found' });
  }

  next();
};

module.exports = demoOnlyGuard;
