import api from '../Api';

export default function Navbar() {
  const logout = async (e) => {
    e.preventDefault();
    try {
      await api.post('/logout');
    } catch (err) {
      // ignore
    }
    localStorage.removeItem('sessionToken');
    window.location.href = '/';
  };

  return (
    <div className="nav">
      <a href="/logger">Logger</a>
      <a href="/dashboard">Dashboard</a>
      <a href="#" onClick={logout} className="danger">Logout</a>
    </div>
  );
}
