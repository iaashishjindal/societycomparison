import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { publicAPI } from '../services/api';

export default function Home() {
  const [stats, setStats] = useState({ societies: 0, benchmarks: 0 });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [societiesRes, benchmarksRes] = await Promise.all([
          publicAPI.getSocieties(),
          publicAPI.getBenchmarks(),
        ]);

        setStats({
          societies: societiesRes.data.length,
          benchmarks: benchmarksRes.data.length,
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h2>Welcome to Society Maintenance Benchmarking</h2>
        <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
          This platform helps you benchmark maintenance charges across similar societies in your area.
          It provides comprehensive data comparison and insights to justify or adjust maintenance charges fairly.
        </p>

        <div className="stats-grid">
          <div className="stat-box">
            <h3>Total Societies</h3>
            <div className="value">{stats.societies}</div>
          </div>
          <div className="stat-box">
            <h3>Benchmark Categories</h3>
            <div className="value">{stats.benchmarks}</div>
          </div>
        </div>

        <div style={{ marginTop: '30px' }}>
          <h3>Quick Links</h3>
          <ul style={{ marginLeft: '20px', marginTop: '15px' }}>
            <li style={{ marginBottom: '10px' }}>
              <Link to="/comparison">View Comparison Data</Link> - See how your society compares with others
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link to="/insights">View Analytics & Insights</Link> - Understand trends and outliers
            </li>
            <li>
              <Link to="/admin">Admin Panel</Link> - Add societies and benchmark data (requires password)
            </li>
          </ul>
        </div>

        <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#ecf0f1', borderRadius: '4px' }}>
          <h3>About Benchmarks</h3>
          <p style={{ marginTop: '10px' }}>
            Benchmarks are grouped into five main categories:
          </p>
          <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
            <li>Building & Maintenance</li>
            <li>Utilities</li>
            <li>Security & Safety</li>
            <li>Amenities & Recreation</li>
            <li>Administration</li>
          </ul>
          <p style={{ marginTop: '15px' }}>
            Each category contains several specific cost items that contribute to the total maintenance charges.
          </p>
        </div>
      </div>
    </div>
  );
}
