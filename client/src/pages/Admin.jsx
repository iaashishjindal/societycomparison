import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getSocieties,
  createSociety,
  updateSociety,
  deleteSociety,
  getBenchmarks,
  getSocietyBenchmarks,
  saveBulkBenchmarks,
} from '../services/api';

function Admin() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState('societies'); // 'societies' or 'benchmarks'
  const [societies, setSocieties] = useState([]);
  const [benchmarks, setBenchmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    totalFlats: '',
    totalArea: '',
    yearEstablished: new Date().getFullYear(),
  });
  const [editingId, setEditingId] = useState(null);
  const [selectedSociety, setSelectedSociety] = useState(null);
  const [benchmarkValues, setBenchmarkValues] = useState({});

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchData();
  }, [isAdmin, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [societiesRes, benchmarksRes] = await Promise.all([
        getSocieties(),
        getBenchmarks(),
      ]);
      setSocieties(societiesRes.data);
      setBenchmarks(benchmarksRes.data);
    } catch (err) {
      setError('Error loading data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Society form handlers
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitSociety = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateSociety(editingId, formData);
        setSuccess('Society updated successfully');
      } else {
        await createSociety(formData);
        setSuccess('Society created successfully');
      }
      setFormData({
        name: '',
        location: '',
        totalFlats: '',
        totalArea: '',
        yearEstablished: new Date().getFullYear(),
      });
      setEditingId(null);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Error saving society');
    }
  };

  const handleEditSociety = (society) => {
    setFormData(society);
    setEditingId(society._id);
  };

  const handleDeleteSociety = async (id) => {
    if (window.confirm('Are you sure you want to delete this society?')) {
      try {
        await deleteSociety(id);
        setSuccess('Society deleted successfully');
        fetchData();
      } catch (err) {
        setError('Error deleting society');
      }
    }
  };

  const handleSelectSociety = async (societyId) => {
    setSelectedSociety(societyId);
    try {
      const res = await getSocietyBenchmarks(societyId);
      const values = {};
      res.data.forEach((item) => {
        values[item.benchmarkId._id] = item.value;
      });
      setBenchmarkValues(values);
    } catch (err) {
      console.error('Error loading benchmarks:', err);
    }
  };

  const handleBenchmarkValueChange = (benchmarkId, value) => {
    setBenchmarkValues((prev) => ({
      ...prev,
      [benchmarkId]: parseFloat(value) || '',
    }));
  };

  const handleSaveBenchmarks = async () => {
    if (!selectedSociety) {
      setError('Please select a society');
      return;
    }

    try {
      const benchmarkData = Object.entries(benchmarkValues).map(([benchmarkId, value]) => ({
        benchmarkId,
        value,
        notes: '',
      }));

      await saveBulkBenchmarks(selectedSociety, { benchmarks: benchmarkData });
      setSuccess('Benchmarks saved successfully');
      handleSelectSociety(selectedSociety);
    } catch (err) {
      setError('Error saving benchmarks');
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
    <div className="page">
      <h1>⚙️ Admin Panel</h1>

      {error && (
        <div className="alert alert-error">
          {error}
          <button onClick={() => setError('')} style={{ marginLeft: '1rem' }}>
            ✕
          </button>
        </div>
      )}
      {success && (
        <div className="alert alert-success">
          {success}
          <button onClick={() => setSuccess('')} style={{ marginLeft: '1rem' }}>
            ✕
          </button>
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button
          onClick={() => setTab('societies')}
          className={`btn ${tab === 'societies' ? 'btn-primary' : 'btn-secondary'}`}
        >
          🏢 Manage Societies
        </button>
        <button
          onClick={() => setTab('benchmarks')}
          className={`btn ${tab === 'benchmarks' ? 'btn-primary' : 'btn-secondary'}`}
        >
          📊 Manage Benchmarks
        </button>
      </div>

      {tab === 'societies' && (
        <>
          <h2>{editingId ? 'Edit Society' : 'Add New Society'}</h2>
          <form onSubmit={handleSubmitSociety}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label>Society Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Total Flats *</label>
                <input
                  type="number"
                  name="totalFlats"
                  value={formData.totalFlats}
                  onChange={handleFormChange}
                  required
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Total Area (sq ft) *</label>
                <input
                  type="number"
                  name="totalArea"
                  value={formData.totalArea}
                  onChange={handleFormChange}
                  required
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Year Established *</label>
                <input
                  type="number"
                  name="yearEstablished"
                  value={formData.yearEstablished}
                  onChange={handleFormChange}
                  required
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-success">
                {editingId ? 'Update Society' : 'Add Society'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      name: '',
                      location: '',
                      totalFlats: '',
                      totalArea: '',
                      yearEstablished: new Date().getFullYear(),
                    });
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <h2 style={{ marginTop: '2rem' }}>Existing Societies</h2>
          {societies.length === 0 ? (
            <div className="alert alert-info">No societies added yet.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Flats</th>
                  <th>Area (sq ft)</th>
                  <th>Year Est.</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {societies.map((society) => (
                  <tr key={society._id}>
                    <td>{society.name}</td>
                    <td>{society.location}</td>
                    <td>{society.totalFlats}</td>
                    <td>{society.totalArea.toLocaleString()}</td>
                    <td>{society.yearEstablished}</td>
                    <td>
                      <button
                        onClick={() => handleEditSociety(society)}
                        className="btn btn-secondary"
                        style={{ marginRight: '0.5rem' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSociety(society._id)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {tab === 'benchmarks' && (
        <>
          <h2>Enter Benchmark Values</h2>
          <div className="form-group">
            <label>Select Society *</label>
            <select
              value={selectedSociety || ''}
              onChange={(e) => handleSelectSociety(e.target.value)}
            >
              <option value="">-- Choose a Society --</option>
              {societies.map((society) => (
                <option key={society._id} value={society._id}>
                  {society.name} ({society.location})
                </option>
              ))}
            </select>
          </div>

          {selectedSociety && (
            <>
              <h3>Benchmarks for {societies.find((s) => s._id === selectedSociety)?.name}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {benchmarks.map((benchmark) => (
                  <div key={benchmark._id} className="form-group">
                    <label>
                      {benchmark.name}
                      <span style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>
                        {' '}
                        ({benchmark.unit})
                      </span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={benchmarkValues[benchmark._id] || ''}
                      onChange={(e) =>
                        handleBenchmarkValueChange(benchmark._id, e.target.value)
                      }
                      placeholder="Enter value"
                    />
                  </div>
                ))}
              </div>
              <button onClick={handleSaveBenchmarks} className="btn btn-success">
                Save All Benchmarks
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Admin;
