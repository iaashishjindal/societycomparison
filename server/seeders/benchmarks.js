export const benchmarkData = [
  // Building & Maintenance
  {
    name: 'Annual Building Maintenance',
    description: 'General maintenance and repairs to building structure',
    category: 'Building & Maintenance',
    unit: 'per sq ft',
  },
  {
    name: 'Painting & Whitewashing',
    description: 'Periodic painting and whitewashing of common areas',
    category: 'Building & Maintenance',
    unit: 'per sq ft',
  },
  {
    name: 'Pest Control',
    description: 'Regular pest control and management',
    category: 'Building & Maintenance',
    unit: 'per sq ft',
  },
  {
    name: 'Lift Maintenance',
    description: 'Maintenance and servicing of elevators',
    category: 'Building & Maintenance',
    unit: 'per sq ft',
  },
  
  // Utilities
  {
    name: 'Water Supply & Treatment',
    description: 'Water supply, treatment, and distribution',
    category: 'Utilities',
    unit: 'per sq ft',
  },
  {
    name: 'Electricity - Common Areas',
    description: 'Electricity for common areas and facilities',
    category: 'Utilities',
    unit: 'per sq ft',
  },
  {
    name: 'Sewage Treatment',
    description: 'Sewage treatment and management',
    category: 'Utilities',
    unit: 'per sq ft',
  },
  
  // Security & Safety
  {
    name: 'Security Staff Salaries',
    description: 'Salaries for security personnel',
    category: 'Security & Safety',
    unit: 'per sq ft',
  },
  {
    name: 'CCTV & Monitoring',
    description: 'CCTV system maintenance and monitoring',
    category: 'Security & Safety',
    unit: 'per sq ft',
  },
  {
    name: 'Fire Safety & Alarms',
    description: 'Fire safety systems and alarm maintenance',
    category: 'Security & Safety',
    unit: 'per sq ft',
  },
  {
    name: 'Gate Maintenance',
    description: 'Gate and access control system maintenance',
    category: 'Security & Safety',
    unit: 'per sq ft',
  },
  
  // Amenities & Recreation
  {
    name: 'Garden & Landscaping',
    description: 'Garden maintenance and landscaping',
    category: 'Amenities & Recreation',
    unit: 'per sq ft',
  },
  {
    name: 'Swimming Pool Maintenance',
    description: 'Swimming pool maintenance and chemicals',
    category: 'Amenities & Recreation',
    unit: 'per sq ft',
  },
  {
    name: 'Gym Maintenance',
    description: 'Gym equipment maintenance',
    category: 'Amenities & Recreation',
    unit: 'per sq ft',
  },
  
  // Administration
  {
    name: 'Administrative Staff',
    description: 'Salaries for administrative and office staff',
    category: 'Administration',
    unit: 'per sq ft',
  },
  {
    name: 'Office Supplies & Insurance',
    description: 'Office supplies and general insurance',
    category: 'Administration',
    unit: 'per sq ft',
  },
  {
    name: 'Legal & Compliance',
    description: 'Legal fees and compliance management',
    category: 'Administration',
    unit: 'per sq ft',
  },
  {
    name: 'Reserve Fund',
    description: 'Contribution to reserve fund for future expenses',
    category: 'Administration',
    unit: 'per sq ft',
  },
];

export const seedBenchmarks = async (Benchmark) => {
  try {
    const count = await Benchmark.countDocuments();
    if (count === 0) {
      await Benchmark.insertMany(benchmarkData);
      console.log('Benchmarks seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding benchmarks:', error);
  }
};
