import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Home from './pages/Home';
import Comparison from './pages/Comparison';
import Insights from './pages/Insights';
import Admin from './pages/Admin';

const AppContent = () => {
  const { isAdmin, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <header>
        <nav className="container">
          <h1>🏢 Society Benchmarking</h1>
          <div>
            <Link to="/">Home</Link>
            <Link to="/comparison">Comparison</Link>
            <Link to="/insights">Insights</Link>
            {isAdmin ? (
              <>
                <Link to="/admin">Admin</Link>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <Link to="/admin">Admin</Link>
            )}
          </div>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/comparison" element={<Comparison />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
