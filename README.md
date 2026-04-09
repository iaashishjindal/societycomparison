# Society Maintenance Charges Benchmarking System

A web application to help societies justify maintenance charges by benchmarking against similar societies in nearby areas.

## Features

- **Public Dashboard**: View societies, compare maintenance charges, and analyze trends
- **Admin Panel**: Manage societies and benchmark data (password: `admin123`)
- **Intermediate Analytics**: Charts, trends, outlier detection, and statistical analysis
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React + Vite + Recharts
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Authentication**: Session-based (fixed admin password)

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Docker & Docker Compose (for MongoDB)

### Installation & Setup

#### 1. Start MongoDB

```bash
docker-compose up -d
```

This will start MongoDB with:
- URL: `mongodb://localhost:27017`
- Admin user: `admin`
- Password: `admin123`
- Database: `societycomparison`

#### 2. Backend Setup

```bash
cd server
npm install
npm start
```

The backend will:
- Connect to MongoDB
- Seed initial benchmark categories
- Start on `http://localhost:5000`

#### 3. Frontend Setup

In a new terminal:

```bash
cd client
npm install
npm run dev
```

Frontend will be available at `http://localhost:5173`

## API Endpoints

### Public Routes

```
GET  /api/societies              - List all societies
GET  /api/societies/:id         - Get society with benchmarks
GET  /api/benchmarks            - List all benchmarks
GET  /api/benchmarks-by-category - Get benchmarks grouped by category
GET  /api/comparison            - Compare societies with filters
GET  /api/insights/society/:id  - Get society-specific insights
GET  /api/insights/summary      - Get summary statistics
```

### Admin Routes (Protected)

```
POST /api/admin/login                - Admin login (password: admin123)
POST /api/admin/logout               - Admin logout
POST /api/admin/societies            - Create society
PUT  /api/admin/societies/:id       - Update society
DELETE /api/admin/societies/:id     - Delete society
GET  /api/admin/benchmarks/:societyId - Get society benchmarks
POST /api/admin/benchmarks/:societyId - Save benchmark value
POST /api/admin/benchmarks/:societyId/bulk - Bulk save benchmarks
```

## Usage

### Admin Panel

1. Go to home page and click "Admin Access"
2. Enter password: `admin123`
3. You can now:
   - **Manage Societies**: Add, edit, delete societies
   - **Manage Benchmarks**: Enter benchmark values for each society

### Public Views

- **Home**: Overview of total societies and average maintenance charges
- **Comparison**: Compare maintenance charges across societies with filters
- **Insights**: View charts, trends, and statistical analysis

## Pre-defined Benchmarks

The system comes with 17 pre-defined benchmark categories across 5 main areas:

1. **Building & Maintenance** (4 benchmarks)
   - Annual building maintenance & repairs
   - Painting & whitewashing
   - Pest control & pest management
   - Lift maintenance

2. **Utilities** (3 benchmarks)
   - Water supply & treatment
   - Electricity for common areas
   - Sewage treatment

3. **Security & Safety** (4 benchmarks)
   - Security staff salaries
   - CCTV & monitoring
   - Fire safety & alarms
   - Gate maintenance

4. **Amenities & Recreation** (3 benchmarks)
   - Garden & landscaping
   - Swimming pool maintenance
   - Gym facility maintenance

5. **Administration** (4 benchmarks)
   - Staff salaries (Admin & Cleaner)
   - Office supplies & insurance
   - Legal & compliance
   - Reserve fund contribution

## Features in Detail

### Comparison Page

- **Filters**: Filter societies by location, number of flats, and area
- **Society Table**: View all societies with key metrics
- **Benchmark Comparison**: Compare specific benchmarks across all societies
- **Outlier Detection**: Identify societies with unusually high/low charges

### Insights Page

- **Interactive Charts**: Bar charts showing distribution of charges
- **Statistical Analysis**: Average, median, min, max, and standard deviation
- **Category Analysis**: Compare average costs across different categories
- **Percentage Variance**: See how each society compares to the average

### Admin Panel

- **Society Management**: Full CRUD operations for societies
- **Benchmark Data Entry**: Easy form to enter benchmark values
- **Bulk Operations**: Save all benchmarks at once for a society

## Troubleshooting

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
docker ps

# View MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

### Backend Won't Start

```bash
# Clear node_modules and reinstall
cd server
rm -rf node_modules package-lock.json
npm install
npm start
```

### Frontend Won't Load

```bash
# Clear cache and reinstall
cd client
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## File Structure

```
societycomparison/
├── server/
│   ├── models/           # MongoDB schemas
│   ├── controllers/      # Business logic
│   ├── routes/           # API endpoints
│   ├── middleware/       # Authentication
│   ├── config/           # Database config
│   ├── seeders/          # Initial data
│   ├── index.js          # Entry point
│   └── package.json
├── client/
│   ├── src/
│   │   ├── pages/        # React pages
│   │   ├── components/   # Reusable components
│   │   ├── services/     # API client
│   │   ├── context/      # Global state
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Default Admin Credentials

- **Username**: Admin
- **Password**: `admin123`

⚠️ **Security Note**: Change the password in `server/routes/adminRoutes.js` before deploying to production.

## Future Enhancements

- User accounts and role-based access
- Export reports (PDF/Excel)
- Historical tracking of charges over time
- ML-based cost recommendations
- Mobile app
- Email notifications

## License

ISC

## Support

For issues or questions, please refer to the plan file at `/root/.claude/plans/peppy-twirling-manatee.md` or check the application logs.
