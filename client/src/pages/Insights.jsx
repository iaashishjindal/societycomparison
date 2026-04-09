import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getComparisonData } from '../services/api';

function Insights() {
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBenchmark, setSelectedBenchmark] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getComparisonData();
        setComparisonData(res.data);
        if (res.data?.insights?.length > 0) {
          setSelectedBenchmark(res.data.insights[0]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  if (!comparisonData?.insights?.length) {
    return (
      <div className="page">
        <h1>📈 Insights & Trends</h1>
        <div className="alert alert-info">No data available for insights yet.</div>
      </div>
    );
  }

  const chartData = selectedBenchmark?.data?.map((item) => ({
    name: item.societyName.substring(0, 15),
    value: item.value,
    fullName: item.societyName,
  })) || [];

  const categoryStats = comparisonData.insights.reduce((acc, insight) => {
    const existing = acc.find((c) => c.category === insight.category);
    if (existing) {
      existing.avg = (existing.avg + insight.stats?.mean) / 2;
    } else {
      acc.push({
        category: insight.category,
        avg: insight.stats?.mean || 0,
      });
    }
    return acc;
  }, []);

  return (
    <div className="page">
      <h1>📈 Insights & Trends Analysis</h1>

      <h2>Statistics Overview</h2>
      <div className="cards-grid">
        <div className="card">
          <div className="stat">
            <div className="stat-value">{comparisonData.societies.length}</div>
            <div className="stat-label">Total Societies</div>
          </div>
        </div>
        <div className="card">
          <div className="stat">
            <div className="stat-value">{comparisonData.insights.length}</div>
            <div className="stat-label">Benchmarks Tracked</div>
          </div>
        </div>
      </div>

      <h2>Benchmark Selection</h2>
      <div className="filters">
        <select
          value={selectedBenchmark?.benchmarkId || ''}
          onChange={(e) => {
            const selected = comparisonData.insights.find(
              (i) => i.benchmarkId === e.target.value
            );
            setSelectedBenchmark(selected);
          }}
          style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
        >
          {comparisonData.insights.map((insight) => (
            <option key={insight.benchmarkId} value={insight.benchmarkId}>
              {insight.benchmarkName}
            </option>
          ))}
        </select>
      </div>

      {selectedBenchmark && (
        <>
          <h2>{selectedBenchmark.benchmarkName}</h2>
          <div className="card">
            <h3>Statistics</h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
              }}
            >
              <div>
                <strong>Average:</strong> ₹{selectedBenchmark.stats?.mean?.toFixed(2)}
              </div>
              <div>
                <strong>Median:</strong> ₹{selectedBenchmark.stats?.median?.toFixed(2)}
              </div>
              <div>
                <strong>Min:</strong> ₹{selectedBenchmark.stats?.min?.toFixed(2)}
              </div>
              <div>
                <strong>Max:</strong> ₹{selectedBenchmark.stats?.max?.toFixed(2)}
              </div>
              <div>
                <strong>Std Dev:</strong> ₹{selectedBenchmark.stats?.stdDev?.toFixed(2)}
              </div>
              <div>
                <strong>Data Points:</strong> {selectedBenchmark.stats?.count}
              </div>
            </div>
          </div>

          <h3 style={{ marginTop: '2rem' }}>Distribution Chart</h3>
          <div style={{ background: 'white', padding: '1rem', borderRadius: '8px' }}>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload[0]) {
                        return (
                          <div
                            style={{
                              background: 'white',
                              padding: '0.5rem',
                              border: '1px solid #ccc',
                              borderRadius: '4px',
                            }}
                          >
                            <p>{payload[0].payload.fullName}</p>
                            <p>₹{payload[0].value.toFixed(2)}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" fill="#3498db" name="Value" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="alert alert-info">No data to display</div>
            )}
          </div>

          <h3 style={{ marginTop: '2rem' }}>Society Values (Sorted)</h3>
          <table>
            <thead>
              <tr>
                <th>Society</th>
                <th>Value</th>
                <th>Deviation from Mean</th>
              </tr>
            </thead>
            <tbody>
              {selectedBenchmark.data
                ?.sort((a, b) => b.value - a.value)
                .map((item) => {
                  const deviation = (
                    ((item.value - selectedBenchmark.stats.mean) /
                      selectedBenchmark.stats.mean) *
                    100
                  ).toFixed(2);
                  const isOutlier = selectedBenchmark.outliers?.includes(item.value);

                  return (
                    <tr key={item.societyId} className={isOutlier ? 'outlier' : ''}>
                      <td>{item.societyName}</td>
                      <td>₹{item.value.toFixed(2)}</td>
                      <td>
                        {deviation > 0 ? (
                          <span style={{ color: 'red' }}>
                            +{deviation}% {isOutlier && '⚠️ Outlier'}
                          </span>
                        ) : (
                          <span style={{ color: 'green' }}>
                            {deviation}% {isOutlier && '⚠️ Outlier'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </>
      )}

      <h2 style={{ marginTop: '2rem' }}>Category Analysis</h2>
      <div style={{ background: 'white', padding: '1rem', borderRadius: '8px' }}>
        {categoryStats.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={categoryStats} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="category"
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avg" fill="#27ae60" name="Avg Value" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="alert alert-info">No category data available</div>
        )}
      </div>
    </div>
  );
}

export default Insights;
