import { useEffect, useState } from 'react';
import { getSummaryStats } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { isAdmin, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getSummaryStats();
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      await login(password);
      setShowLoginModal(false);
      setPassword('');
      setError('');
      navigate('/admin');
    } catch (err) {
      setError('Invalid password');
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading">
          <div className="loader"></div>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page">
        <h1>🏢 Society Maintenance Charges Benchmarking</h1>

        <div style={{ marginBottom: '2rem', lineHeight: '1.8' }}>
          <p>
            Welcome to the Society Maintenance Charges Benchmarking Platform! This tool helps
            justify maintenance charges by comparing them with similar societies in nearby areas.
          </p>
          <p style={{ marginTop: '1rem' }}>
            <strong>How it works:</strong>
          </p>
          <ul style={{ marginLeft: '2rem', marginTop: '0.5rem' }}>
            <li>View and compare maintenance charges across multiple societies</li>
            <li>Analyze insights and trends in maintenance costs</li>
            <li>Understand how your society's charges compare to similar properties</li>
          </ul>
        </div>

        <h2>Overview</h2>
        <div className="cards-grid">
          <div className="card">
            <div className="stat">
              <div className="stat-value">{stats?.totalSocieties || 0}</div>
              <div className="stat-label">Societies</div>
            </div>
          </div>
          <div className="card">
            <div className="stat">
              <div className="stat-value">₹{stats?.avgMaintenanceCharge?.toFixed(2) || 0}</div>
              <div className="stat-label">Avg Maintenance (per sq ft)</div>
            </div>
          </div>
          <div className="card">
            <div className="stat">
              <div className="stat-value">{stats?.avgFlats || 0}</div>
              <div className="stat-label">Avg Units</div>
            </div>
          </div>
          <div className="card">
            <div className="stat">
              <div className="stat-value">{stats?.avgArea?.toLocaleString() || 0}</div>
              <div className="stat-label">Avg Area (sq ft)</div>
            </div>
          </div>
        </div>

        <h2>Quick Links</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          <button
            onClick={() => navigate('/comparison')}
            className="btn btn-primary"
          >
            📊 View Comparisons
          </button>
          <button
            onClick={() => navigate('/insights')}
            className="btn btn-primary"
          >
            📈 View Insights & Trends
          </button>
          {!isAdmin && (
            <button
              onClick={() => setShowLoginModal(true)}
              className="btn btn-secondary"
            >
              🔐 Admin Access
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => navigate('/admin')}
              className="btn btn-success"
            >
              ⚙️ Admin Panel
            </button>
          )}
        </div>
      </div>

      {/* Admin Login Modal */}
      {showLoginModal && (
        <div className="modal open">
          <div className="modal-content">
            <h2>Admin Login</h2>
            <form onSubmit={handleAdminLogin}>
              {error && <div className="alert alert-error">{error}</div>}
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLoginModal(false);
                    setPassword('');
                    setError('');
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
