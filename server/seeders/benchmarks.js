import Benchmark from '../models/Benchmark.js';

const benchmarkData = [
  // Building & Maintenance
  {
    name: 'Annual building maintenance & repairs',
    category: 'Building & Maintenance',
    description: 'Maintenance and repair costs for building structure',
    unit: 'per sq ft',
  },
  {
    name: 'Painting & whitewashing',
    category: 'Building & Maintenance',
    description: 'External and internal painting costs',
    unit: 'per sq ft',
  },
  {
    name: 'Pest control & pest management',
    category: 'Building & Maintenance',
    description: 'Regular pest control and fumigation',
    unit: 'per unit',
  },
  {
    name: 'Lift maintenance',
    category: 'Building & Maintenance',
    description: 'Elevator/lift maintenance and repairs',
    unit: 'per unit',
  },

  // Utilities
  {
    name: 'Water supply & treatment',
    category: 'Utilities',
    description: 'Water supply, treatment, and maintenance',
    unit: 'per sq ft',
  },
  {
    name: 'Electricity for common areas',
    category: 'Utilities',
    description: 'Common area electricity costs',
    unit: 'per sq ft',
  },
  {
    name: 'Sewage treatment',
    category: 'Utilities',
    description: 'Sewage treatment plant maintenance',
    unit: 'per unit',
  },

  // Security & Safety
  {
    name: 'Security staff salaries',
    category: 'Security & Safety',
    description: 'Guards and security personnel',
    unit: 'per unit',
  },
  {
    name: 'CCTV & monitoring',
    category: 'Security & Safety',
    description: 'CCTV installation and monitoring',
    unit: 'per sq ft',
  },
  {
    name: 'Fire safety & alarms',
    category: 'Security & Safety',
    description: 'Fire safety equipment and alarms',
    unit: 'per sq ft',
  },
  {
    name: 'Gate maintenance',
    category: 'Security & Safety',
    description: 'Entry gate and access control',
    unit: 'per unit',
  },

  // Amenities & Recreation
  {
    name: 'Garden & landscaping',
    category: 'Amenities & Recreation',
    description: 'Garden maintenance and landscaping',
    unit: 'per sq ft',
  },
  {
    name: 'Swimming pool maintenance',
    category: 'Amenities & Recreation',
    description: 'Pool cleaning, chemicals, and maintenance',
    unit: 'per unit',
  },
  {
    name: 'Gym facility maintenance',
    category: 'Amenities & Recreation',
    description: 'Gym equipment and facility maintenance',
    unit: 'per unit',
  },

  // Administration
  {
    name: 'Staff salaries - Admin & Cleaner',
    category: 'Administration',
    description: 'Administrative staff and cleaning personnel',
    unit: 'per unit',
  },
  {
    name: 'Office supplies & insurance',
    category: 'Administration',
    description: 'Office supplies, insurance premiums',
    unit: 'per sq ft',
  },
  {
    name: 'Legal & compliance',
    category: 'Administration',
    description: 'Legal fees and regulatory compliance',
    unit: 'per unit',
  },
  {
    name: 'Reserve fund contribution',
    category: 'Administration',
    description: 'Reserve fund for future maintenance',
    unit: 'per sq ft',
  },
];

export const seedBenchmarks = async () => {
  try {
    const existingCount = await Benchmark.countDocuments();
    if (existingCount > 0) {
      console.log('✓ Benchmarks already seeded, skipping...');
      return;
    }

    await Benchmark.insertMany(benchmarkData);
    console.log(`✓ Seeded ${benchmarkData.length} benchmarks`);
  } catch (error) {
    console.error('✗ Error seeding benchmarks:', error.message);
  }
};
