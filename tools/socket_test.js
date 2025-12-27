import { io } from 'socket.io-client';

async function run() {
  const socket = io('http://127.0.0.1:5000', { timeout: 5000, reconnectionAttempts: 2 });

  socket.on('connect', async () => {
    console.log('Socket connected:', socket.id);
    try {
      const res = await fetch('http://127.0.0.1:5000/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ time: new Date().toISOString(), event: 'pressed', key: 'TEST_SOCKET' })
      });
      console.log('Posted test keystroke, status', res.status);
    } catch (err) {
      console.error('Error posting test keystroke:', err && err.message ? err.message : err);
    }
  });

  socket.on('new_keystroke', (data) => {
    console.log('Received new_keystroke event:', data);
    socket.close();
    process.exit(0);
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connect_error:', err && err.message ? err.message : err);
  });

  // timeout if nothing received
  setTimeout(() => {
    console.error('Test timeout: did not receive new_keystroke within 5s');
    socket.close();
    process.exit(1);
  }, 5000);
}

run();
