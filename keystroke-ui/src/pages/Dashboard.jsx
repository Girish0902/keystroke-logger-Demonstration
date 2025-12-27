import { useEffect, useState } from "react";
import api from "../Api";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const res = await api.get('/data');
        if (!cancelled) setCount(res.data.count);
      } catch (err) {
        if (import.meta.env.MODE === 'development') console.debug('Failed to fetch /data', err?.message || err);
      }
    }

    fetchData();
    // Refresh every 5 seconds to keep dashboard live
    const id = setInterval(fetchData, 5000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  return (
    <div className="center">
      <div className="card">
        <Navbar />
        <h2 className="page-title">Analytics Dashboard</h2>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>Total Keystrokes</div>
            <div style={{ fontSize: 28, fontWeight: 700, marginTop: 6 }}>{count}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div className="chart-container">
              <Bar data={{
                labels: ["Keys Logged"],
                datasets: [{
                  label: "Keystrokes",
                  data: [count]
                }]
              }} />
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <a className="btn" href={`${import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:5000'}/download`}>
            Download CSV
          </a>
        </div>
      </div>
    </div>
  );
}
