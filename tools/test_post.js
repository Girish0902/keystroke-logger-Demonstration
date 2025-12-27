async function run() {
  try {
    // Node 18+ has fetch globally; use it to avoid extra deps
    const postRes = await fetch('http://127.0.0.1:5000/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ time: new Date().toISOString(), event: 'pressed', key: 'NODE_TEST_SCRIPT' })
    });
    console.log('POST /api/logs status:', postRes.status);
    const dataRes = await fetch('http://127.0.0.1:5000/data');
    const json = await dataRes.json();
    console.log('/data =>', json);
  } catch (err) {
    console.error('Error testing API:', err.message || err);
    process.exit(1);
  }
}

run();
