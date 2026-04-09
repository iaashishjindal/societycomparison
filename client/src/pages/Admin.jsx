import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { adminAPI, publicAPI } from '../services/api';

export default function Admin() {
  const { isAdmin, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('societies');
  const [societies, setSocieties] = useState([]);
  const [benchmarks, setBenchmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Form states
  const [societyForm, setSocietyForm] = useState({
    name: '',
    location: '',
    totalFlats: '',
    totalArea: '',
    yearEstablished: '',
  });
  const [selectedSociety, setSelectedSociety] = useState('');
  const [benchmarkValues, setBenchmarkValues] = useState({});

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [societiesRes, benchmarksRes] = await Promise.all([
        adminAPI.getSocieties(),
        adminAPI.getBenchmarks(),
      ]);
      setSocieties(societiesRes.data);
      setBenchmarks(benchmarksRes.data);
    } catch (error) {
      setMessage('Failed to load data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    const success = await login(password);
    if (success) {
      setPassword('');
      setMessage('Logged in successfully');
    } else {
      setLoginError('Invalid password');
    }
  };

  const handleAddSociety = async (e) => {
    e.preventDefault();
    if (!societyForm.name || !societyForm.totalFlats || !societyForm.totalArea) {
      setMessage('Please fill required fields');
      return;
    }

    try {
      setLoading(true);
      await adminAPI.createSociety({
        name: societyForm.name,
        location: societyForm.location,
        totalFlats: parseInt(societyForm.totalFlats),
        totalArea: parseInt(societyForm.totalArea),
        yearEstablished: societyForm.yearEstablished ? parseInt(societyForm.yearEstablished) : null,
      });
      setSocietyForm({ name: '', location: '', totalFlats: '', totalArea: '', yearEstablished: '' });
      setMessage('Society added successfully');
      loadData();
    } catch (error) {
      setMessage('Failed to add society: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSociety = async (id) => {
    if (window.confirm('Are you sure you want to delete this society?')) {
      try {
        setLoading(true);
        await adminAPI.deleteSociety(id);
        setMessage('Society deleted successfully');
        loadData();
      } catch (error) {
        setMessage('Failed to delete society: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSelectSociety = async (societyId) => {
    setSelectedSociety(societyId);
    try {
      setLoading(true);
      const res = await adminAPI.getSocietyBenchmarks(societyId);
      const values = {};
      res.data.forEach(sb => {
        values[sb.benchmarkId._id] = sb.value;
      });
      setBenchmarkValues(values);
    } catch (error) {
      setMessage('Failed to load benchmarks: ' + error.message);
      setBenchmarkValues({});
    } finally {
      setLoading(false);
    }
  };

  const handleBenchmarkChange = (benchmarkId, value) => {
    setBenchmarkValues(prev => ({
      ...prev,
      [benchmarkId]: value ? parseFloat(value) : '',
    }));
  };

  const handleSaveBenchmarks = async (e) => {
    e.preventDefault();
    if (!selectedSociety) {
      setMessage('Please select a society');
      return;
    }

    try {
      setLoading(true);
      const benchmarksData = Object.entries(benchmarkValues)
        .filter(([_, value]) => value !== '')
        .map(([benchmarkId, value]) => ({
          benchmarkId,
          value,
          notes: '',
        }));

      await adminAPI.updateBenchmarks(selectedSociety, { benchmarks: benchmarksData });
      setMessage('Benchmarks saved successfully');
      loadData();
    } catch (error) {
      setMessage('Failed to save benchmarks: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="container">
        <div className="card">
          <h2>Admin Login</h2>
          {loginError && <div className="error">{loginError}</div>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
              />
            </div>
            <button type="submit">Login</button>
          </form>
          <p style={{ marginTop: '20px', color: '#7f8c8d', fontSize: '12px' }}>
            Default password: admin123
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Admin Panel</h2>
        <button onClick={() => logout()} style={{ marginBottom: '20px' }}>Logout</button>

        {message && (
          <div className={message.includes('Failed') ? 'error' : 'success'}>
            {message}
          </div>
        )}

        <div style={{ marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
          <button
            className={activeTab === 'societies' ? '' : 'secondary'}
            onClick={() => setActiveTab('societies')}
            style={{ marginRight: '10px', marginBottom: '10px' }}
          >
            Manage Societies
          </button>
          <button
            className={activeTab === 'benchmarks' ? '' : 'secondary'}
            onClick={() => setActiveTab('benchmarks')}
            style={{ marginBottom: '10px' }}
          >
            Manage Benchmarks
          </button>
        </div>

        {activeTab === 'societies' && (
          <div>
            <div className="form-section">
              <h3>Add New Society</h3>
              <form onSubmit={handleAddSociety}>
                <div className="form-group">
                  <label>Society Name *</label>
                  <input
                    type="text"
                    value={societyForm.name}
                    onChange={(e) => setSocietyForm({ ...societyForm, name: e.target.value })}
                    placeholder="e.g., Green Valley Apartments"
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={societyForm.location}
                    onChange={(e) => setSocietyForm({ ...societyForm, location: e.target.value })}
                    placeholder="e.g., Sector 57, Gurgaon"
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="form-group">
                    <label>Total Flats *</label>
                    <input
                      type="number"
                      value={societyForm.totalFlats}
                      onChange={(e) => setSocietyForm({ ...societyForm, totalFlats: e.target.value })}
                      placeholder="e.g., 250"
                    />
                  </div>
                  <div className="form-group">
                    <label>Total Area (sq ft) *</label>
                    <input
                      type="number"
                      value={societyForm.totalArea}
                      onChange={(e) => setSocietyForm({ ...societyForm, totalArea: e.target.value })}
                      placeholder="e.g., 500000"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Year Established</label>
                  <input
                    type="number"
                    value={societyForm.yearEstablished}
                    onChange={(e) => setSocietyForm({ ...societyForm, yearEstablished: e.target.value })}
                    placeholder="e.g., 2015"
                  />
                </div>
                <button type="submit" disabled={loading}>Add Society</button>
              </form>
            </div>

            <div className="form-section">
              <h3>Existing Societies</h3>
              {societies.length === 0 ? (
                <p>No societies added yet</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Location</th>
                      <th>Flats</th>
                      <th>Area (sq ft)</th>
                      <th>Year Est.</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {societies.map(society => (
                      <tr key={society._id}>
                        <td>{society.name}</td>
                        <td>{society.location || '-'}</td>
                        <td>{society.totalFlats}</td>
                        <td>{society.totalArea.toLocaleString()}</td>
                        <td>{society.yearEstablished || '-'}</td>
                        <td>
                          <button
                            className="danger"
                            onClick={() => handleDeleteSociety(society._id)}
                            style={{ padding: '5px 10px' }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeTab === 'benchmarks' && (
          <div>
            <div className="form-section">
              <h3>Enter Benchmark Data for Society</h3>
              <div className="form-group">
                <label>Select Society *</label>
                <select
                  value={selectedSociety}
                  onChange={(e) => handleSelectSociety(e.target.value)}
                >
                  <option value="">-- Select a society --</option>
                  {societies.map(society => (
                    <option key={society._id} value={society._id}>
                      {society.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedSociety && (
                <form onSubmit={handleSaveBenchmarks}>
                  {benchmarks.length > 0 ? (
                    <>
                      {['Building & Maintenance', 'Utilities', 'Security & Safety', 'Amenities & Recreation', 'Administration'].map(
                        category => (
                          <div key={category} className="form-section">
                            <h4>{category}</h4>
                            {benchmarks
                              .filter(b => b.category === category)
                              .map(benchmark => (
                                <div className="form-group" key={benchmark._id}>
                                  <label>{benchmark.name} ({benchmark.unit})</label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={benchmarkValues[benchmark._id] || ''}
                                    onChange={(e) => handleBenchmarkChange(benchmark._id, e.target.value)}
                                    placeholder="e.g., 2.5"
                                  />
                                </div>
                              ))}
                          </div>
                        )
                      )}
                      <button type="submit" disabled={loading}>Save All Benchmarks</button>
                    </>
                  ) : (
                    <p>Loading benchmarks...</p>
                  )}
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
