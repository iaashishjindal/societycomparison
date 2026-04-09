import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navigation() {
  const { isAdmin, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav>
      <div>
        <Link to="/" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
          🏢 Society Comparison
        </Link>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/comparison">Comparison</Link>
        <Link to="/insights">Insights</Link>
        {isAdmin && <Link to="/admin">Admin</Link>}
        {isAdmin && (
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
