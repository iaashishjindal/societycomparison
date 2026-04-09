import { useEffect, useState } from 'react';
import { getComparisonData, getSocieties } from '../services/api';

function Comparison() {
  const [societies, setSocieties] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    minFlats: '',
    maxFlats: '',
    minArea: '',
    maxArea: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [societiesRes, comparisonRes] = await Promise.all([
        getSocieties(),
        getComparisonData(filters),
      ]);
      setSocieties(societiesRes.data);
      setComparisonData(comparisonRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyFilters = () => {
    fetchData();
  };

  const handleClearFilters = () => {
    setFilters({
      location: '',
      minFlats: '',
      maxFlats: '',
      minArea: '',
      maxArea: '',
    });
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
      <h1>📊 Society Comparison</h1>

      <div className="filters">
        <div className="filter-group">
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            placeholder="Location"
          />
        </div>
        <div className="filter-group">
          <input
            type="number"
            name="minFlats"
            value={filters.minFlats}
            onChange={handleFilterChange}
            placeholder="Min Flats"
          />
          <input
            type="number"
            name="maxFlats"
            value={filters.maxFlats}
            onChange={handleFilterChange}
            placeholder="Max Flats"
          />
        </div>
        <div className="filter-group">
          <input
            type="number"
            name="minArea"
            value={filters.minArea}
            onChange={handleFilterChange}
            placeholder="Min Area (sq ft)"
          />
          <input
            type="number"
            name="maxArea"
            value={filters.maxArea}
            onChange={handleFilterChange}
            placeholder="Max Area (sq ft)"
          />
        </div>
        <div className="filter-group">
          <button onClick={handleApplyFilters} className="btn btn-primary">
            Apply
          </button>
          <button onClick={handleClearFilters} className="btn btn-secondary">
            Clear
          </button>
        </div>
      </div>

      {comparisonData?.societies?.length === 0 ? (
        <div className="alert alert-info">No societies found matching your criteria.</div>
      ) : (
        <>
          <h2>Societies ({comparisonData?.societies?.length || 0})</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Total Flats</th>
                <th>Total Area (sq ft)</th>
                <th>Year Est.</th>
                <th>Avg Maintenance</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData?.societies?.map((society) => {
                const societyInsights = comparisonData?.insights?.find((insight) =>
                  insight.data?.some((d) => d.societyId === society._id)
                );
                const avgMaint = societyInsights?.stats?.mean || 'N/A';

                return (
                  <tr key={society._id}>
                    <td>
                      <strong>{society.name}</strong>
                    </td>
                    <td>{society.location}</td>
                    <td>{society.totalFlats}</td>
                    <td>{society.totalArea?.toLocaleString()}</td>
                    <td>{society.yearEstablished}</td>
                    <td>
                      {typeof avgMaint === 'number' ? `₹${avgMaint.toFixed(2)}` : avgMaint}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <h2>Benchmark Comparison</h2>
          {comparisonData?.insights?.length > 0 ? (
            comparisonData.insights.map((insight) => (
              <div key={insight.benchmarkId} className="card">
                <h3>
                  {insight.benchmarkName}{' '}
                  <span style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>
                    ({insight.unit})
                  </span>
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginBottom: '1rem',
                  }}
                >
                  <div>
                    <strong>Average:</strong> ₹{insight.stats?.mean?.toFixed(2) || 'N/A'}
                  </div>
                  <div>
                    <strong>Median:</strong> ₹{insight.stats?.median?.toFixed(2) || 'N/A'}
                  </div>
                  <div>
                    <strong>Min:</strong> ₹{insight.stats?.min?.toFixed(2) || 'N/A'}
                  </div>
                  <div>
                    <strong>Max:</strong> ₹{insight.stats?.max?.toFixed(2) || 'N/A'}
                  </div>
                  <div>
                    <strong>Std Dev:</strong> ₹{insight.stats?.stdDev?.toFixed(2) || 'N/A'}
                  </div>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Society</th>
                      <th>Value</th>
                      <th>Variance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {insight.data?.map((item) => {
                      const variance = (
                        ((item.value - insight.stats.mean) / insight.stats.mean) *
                        100
                      ).toFixed(2);
                      const isOutlier = insight.outliers?.includes(item.value);

                      return (
                        <tr key={item.societyId} className={isOutlier ? 'outlier' : ''}>
                          <td>{item.societyName}</td>
                          <td>₹{item.value.toFixed(2)}</td>
                          <td>
                            {variance > 0 ? (
                              <span style={{ color: 'red' }}>+{variance}%</span>
                            ) : (
                              <span style={{ color: 'green' }}>{variance}%</span>
                            )}
                            {isOutlier && ' ⚠️ Outlier'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))
          ) : (
            <div className="alert alert-info">No benchmark data available.</div>
          )}
        </>
      )}
    </div>
  );
}

export default Comparison;
