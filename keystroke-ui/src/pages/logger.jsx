import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Navbar from "../components/Navbar";
import api from "../Api";

export default function Logger() {
  const [logs, setLogs] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const logEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // connect to socket using env URL or default
    const base = import.meta.env.VITE_API_URL ?? "http://localhost:5000";
    const socket = io(base, { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("connect", () => setSocketConnected(true));
    socket.on("disconnect", () => setSocketConnected(false));

    socket.on("new_keystroke", (data) => {
      const entry = `${data.time} | ${data.event || 'pressed'} | ${data.key}`;
      setLogs((prev) => [...prev, entry]);
    });

    socket.on('connect_error', (err) => {
      console.warn('Socket connection error', err && err.message ? err.message : err);
    });

    return () => {
      socket.off("new_keystroke");
      socket.disconnect();
    };
  }, []);

  // Scroll to bottom when logs change
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Local keyboard capture (works even when server is down)
  useEffect(() => {
    const handler = (e) => {
      const time = new Date().toISOString();
      const entry = `${time} | pressed | ${e.key}`;
      // Immediately show locally
      setLogs((prev) => [...prev, entry]);

      // Send to server (best-effort). Include consent header required by server
      api.post('/log', { key: e.key, time }, { headers: { 'X-Consent': 'true' } })
        .catch(err => {
          // ignore errors so local UX isn't blocked
          if (import.meta.env.MODE === 'development') console.debug('Failed to post keystroke', err?.message || err);
        });
    };

    // Attach to document so typing anywhere registers
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="center">
      <div className="card">
        <Navbar />
        <h2 className="page-title">Keystroke Logging Demonstration</h2>

        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 8 }}>
          {socketConnected ? 'Connected to server' : 'Running locally — server not connected'}
        </div>

        <div className="log-window" role="log" aria-live="polite" tabIndex={0} style={{ outline: 'none' }}>
          {logs.map((log, index) => (
            <div key={index} className="log-line">{log}</div>
          ))}
          <div ref={logEndRef} />
        </div>

        <div style={{ marginTop: 12, fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
          Tip: start typing anywhere on the page to see keystrokes. Your keys are shown locally and sent to the server if available.
        </div>
      </div>
    </div>
  );
}