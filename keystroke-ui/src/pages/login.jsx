import api from "../Api";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Grabs username and password from the form inputs
    const data = Object.fromEntries(new FormData(e.target));
    
    try {
      // Sends request to the backend root URL
      const res = await api.post("/", data);
      const token = res.data?.token;

      if (token) {
        // Saves token using the key required by Api.jsx
        localStorage.setItem('sessionToken', token);
        setLoading(false);
        // Redirects to the logger page
        navigate('/logger');
      } else {
        setError('Login failed: no token returned');
        setLoading(false);
      }
    } catch (err) {
      // Improved error message for Network Errors
      if (!err?.response) {
        setError('Network error: could not reach the server or request blocked by CORS. Check that the API server is running on port 5000 and that CORS allows your dev origin.');
      } else {
        const msg = err.response?.data?.error || err.response?.statusText || err.message;
        setError(`Login failed: ${msg}`);
      }
      setLoading(false);
    }
  };

  return (
    <div className="center">
      <div className="card">
        <h2>Keystroke Logger</h2>
        <p className="subtitle">Secure Login · Educational Demo</p>

        <form onSubmit={login}>
          <label style={{display:'block',textAlign:'left'}}>Username</label>
          <input name="username" placeholder="admin" required />
          
          <label style={{display:'block',textAlign:'left'}}>Password</label>
          <input name="password" type="password" placeholder="••••••••" required />
          
          <div style={{marginTop:12}}>
            <button type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Login'}
            </button>
          </div>
        </form>

        {error && <p className="error-msg">{error}</p>}

        <div className="demo-info">
          Demo Access<br/>
          <strong>admin / password123</strong>
        </div>
      </div>
    </div>
  );
}