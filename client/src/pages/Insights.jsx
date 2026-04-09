import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { publicAPI } from '../services/api';

export default function Insights() {
  const [insights, setInsights] = useState(null);
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const [insightsRes, trendsRes] = await Promise.all([
          publicAPI.getInsights(),
          publicAPI.getTrends(),
        ]);

        setInsights(insightsRes.data);
        setTrends(trendsRes.data);
      } catch (error) {
        console.error('Failed to load insights:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInsights();
  }, []);

  if (loading) {
    return <div className="container loading">Loading insights...</div>;
  }

  if (!insights || !trends) {
    return <div className="container loading">No data available</div>;
  }

  // Prepare data for charts
  const benchmarksList = Object.entries(insights).map(([_, insight]) => ({
    name: insight.name.substring(0, 20),
    fullName: insight.name,
    mean: parseFloat(insight.stats.mean.toFixed(2)),
    median: parseFloat(insight.stats.median.toFixed(2)),
    stdDev: parseFloat(insight.stats.stdDev.toFixed(2)),
    outliers: insight.outliersCount,
  }));

  const trendChartData = trends.slice(0, 3).map(trend => ({
    benchmarkName: trend.benchmarkName.substring(0, 15),
    data: trend.values.map(v => ({
      x: v.flats,
      y: v.value,
      society: v.societyName,
      area: v.area,
    })),
  }));

  return (
    <div className="container">
      <div className="card">
        <h2>Analytics & Insights</h2>

        {benchmarksList.length > 0 && (
          <div className="chart-container">
            <h3>Benchmark Statistics (Mean vs Median)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={benchmarksList}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="mean" fill="#3498db" name="Mean" />
                <Bar dataKey="median" fill="#2ecc71" name="Median" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="chart-container">
          <h3>Outlier Detection by Benchmark</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={benchmarksList}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="outliers" fill="#e74c3c" name="Outliers (±2σ)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ marginTop: '30px' }}>
          <h3>Detailed Insights by Benchmark</h3>
          {benchmarksList.map((benchmark, idx) => (
            <div key={idx} style={{
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: '#ecf0f1',
              borderRadius: '4px',
            }}>
              <h4>{benchmark.fullName}</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '10px' }}>
                <div><strong>Mean:</strong> {benchmark.mean}</div>
                <div><strong>Median:</strong> {benchmark.median}</div>
                <div><strong>Std Dev:</strong> {benchmark.stdDev.toFixed(2)}</div>
                <div><strong>Outliers:</strong> {benchmark.outliers}</div>
              </div>
            </div>
          ))}
        </div>

        {trendChartData.length > 0 && (
          <div className="chart-container" style={{ marginTop: '30px' }}>
            <h3>Charge vs Number of Flats (Sample Benchmarks)</h3>
            {trendChartData.map((trend, idx) => (
              <div key={idx} style={{ marginBottom: '30px' }}>
                <h4>{trend.benchmarkName}</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" dataKey="x" name="Number of Flats" />
                    <YAxis type="number" dataKey="y" name="Charge (per sq ft)" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Societies" data={trend.data} fill="#3498db" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#d4edda', borderRadius: '4px' }}>
          <h3>Interpretation Guide</h3>
          <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
            <li><strong>Mean:</strong> Average maintenance charge across all societies</li>
            <li><strong>Median:</strong> Middle value when charges are sorted (less affected by extremes)</li>
            <li><strong>Std Dev:</strong> How much variation exists in charges</li>
            <li><strong>Outliers:</strong> Societies with unusually high or low charges (beyond ±2 standard deviations)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
