import React, { useEffect, useState } from 'react';
import { publicAPI } from '../services/api';

export default function Comparison() {
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    location: '',
    minFlats: '',
    maxFlats: '',
    minArea: '',
    maxArea: '',
  });
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await publicAPI.getComparison();
        setData(res.data);
        setFilteredData(res.data.societies);
      } catch (error) {
        console.error('Failed to load comparison data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!data) return;

    let filtered = data.societies;

    // Apply filters
    if (filters.location) {
      filtered = filtered.filter(s =>
        s.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    if (filters.minFlats) {
      filtered = filtered.filter(s => s.totalFlats >= parseInt(filters.minFlats));
    }
    if (filters.maxFlats) {
      filtered = filtered.filter(s => s.totalFlats <= parseInt(filters.maxFlats));
    }
    if (filters.minArea) {
      filtered = filtered.filter(s => s.totalArea >= parseInt(filters.minArea));
    }
    if (filters.maxArea) {
      filtered = filtered.filter(s => s.totalArea <= parseInt(filters.maxArea));
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'flats') return b.totalFlats - a.totalFlats;
      if (sortBy === 'area') return b.totalArea - a.totalArea;
      return 0;
    });

    setFilteredData(filtered);
  }, [filters, sortBy, data]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div className="container loading">Loading comparison data...</div>;
  }

  const maintenanceChargeBenchmark = data?.benchmarks.find(
    b => b.name.toLowerCase().includes('maintenance') || b.name.toLowerCase().includes('building')
  );

  return (
    <div className="container">
      <div className="card">
        <h2>Society Comparison</h2>

        <div className="filters">
          <input
            type="text"
            name="location"
            placeholder="Filter by location"
            value={filters.location}
            onChange={handleFilterChange}
          />
          <input
            type="number"
            name="minFlats"
            placeholder="Min flats"
            value={filters.minFlats}
            onChange={handleFilterChange}
          />
          <input
            type="number"
            name="maxFlats"
            placeholder="Max flats"
            value={filters.maxFlats}
            onChange={handleFilterChange}
          />
          <input
            type="number"
            name="minArea"
            placeholder="Min area (sq ft)"
            value={filters.minArea}
            onChange={handleFilterChange}
          />
          <input
            type="number"
            name="maxArea"
            placeholder="Max area (sq ft)"
            value={filters.maxArea}
            onChange={handleFilterChange}
          />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Sort by Name</option>
            <option value="flats">Sort by Flats</option>
            <option value="area">Sort by Area</option>
          </select>
        </div>

        <p style={{ marginBottom: '15px' }}>
          Showing {filteredData.length} of {data.societies.length} societies
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Society Name</th>
                <th>Location</th>
                <th>Total Flats</th>
                <th>Total Area (sq ft)</th>
                <th>Year Est.</th>
                {maintenanceChargeBenchmark && (
                  <th>{maintenanceChargeBenchmark.name} (per sq ft)</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredData.map(society => (
                <tr key={society._id}>
                  <td><strong>{society.name}</strong></td>
                  <td>{society.location || '-'}</td>
                  <td>{society.totalFlats}</td>
                  <td>{society.totalArea.toLocaleString()}</td>
                  <td>{society.yearEstablished || '-'}</td>
                  {maintenanceChargeBenchmark && (
                    <td>
                      {society.benchmarks[maintenanceChargeBenchmark._id]?.toFixed(2) || '-'}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
