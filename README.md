# Society Maintenance Charges Benchmarking System

A comprehensive web application to benchmark maintenance charges across multiple residential societies. This tool helps justify maintenance charges by comparing them with similar societies in nearby areas.

## Features

- **Public Dashboard**: View and compare maintenance charges across societies
- **Benchmarking Data**: Pre-defined categories covering Building & Maintenance, Utilities, Security & Safety, Amenities, and Administration
- **Admin Panel**: Add societies and maintenance charge data (password protected)
- **Comparison Table**: Filter and sort societies by location, number of flats, and area
- **Analytics & Insights**: 
  - Statistical analysis (mean, median, standard deviation)
  - Outlier detection for unusually high/low charges
  - Trend visualization
  - Charge distribution charts

## Tech Stack

- **Frontend**: React 18 + Vite + Recharts
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Session Management**: Express-session

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (or Docker for local setup)
- Git

## Installation & Setup

### 1. Start MongoDB

Using Docker (recommended):
```bash
docker-compose up -d
```

Or install MongoDB locally and ensure it's running on `mongodb://localhost:27017`

### 2. Setup Backend

```bash
cd server
npm install
npm run dev
```

The backend will start on `http://localhost:5000` and automatically seed benchmark categories on first run.

### 3. Setup Frontend

In a new terminal:
```bash
cd client
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

## Usage

### As a Public User

1. Open `http://localhost:5173` in your browser
2. **Home**: View system overview and quick links
3. **Comparison**: See a table of all societies with benchmark data
   - Filter by location, number of flats, or area
   - Sort by different criteria
4. **Insights**: View analytics and trends
   - Statistical summaries for each benchmark
   - Outlier detection
   - Trend charts

### As an Admin

1. Go to `http://localhost:5173/admin`
2. Click "Admin" in the header and login with password: `admin123`
3. **Manage Societies Tab**:
   - Add new societies with name, location, number of flats, and total area
   - View and delete existing societies
4. **Manage Benchmarks Tab**:
   - Select a society
   - Enter maintenance charge values for each benchmark category
   - Values should be in rupees per square foot

## API Endpoints

### Public Routes
- `GET /api/societies` - List all societies
- `GET /api/societies/:id` - Get single society with benchmarks
- `GET /api/benchmarks` - List all benchmark categories
- `GET /api/comparison` - Get comparison data for all societies
- `GET /api/insights` - Get statistical insights
- `GET /api/trends` - Get trend data

### Admin Routes
- `POST /api/admin/login` - Admin authentication
- `POST /api/admin/logout` - Logout
- `GET /api/admin/check` - Check authentication status
- `POST /api/admin/societies` - Create society
- `PUT /api/admin/societies/:id` - Update society
- `DELETE /api/admin/societies/:id` - Delete society
- `GET /api/admin/benchmarks` - Get benchmark templates
- `GET /api/admin/benchmarks/:societyId` - Get society's benchmark data
- `POST /api/admin/benchmarks/:societyId` - Update benchmark data

## Default Benchmark Categories

### Building & Maintenance
- Annual Building Maintenance
- Painting & Whitewashing
- Pest Control
- Lift Maintenance

### Utilities
- Water Supply & Treatment
- Electricity - Common Areas
- Sewage Treatment

### Security & Safety
- Security Staff Salaries
- CCTV & Monitoring
- Fire Safety & Alarms
- Gate Maintenance

### Amenities & Recreation
- Garden & Landscaping
- Swimming Pool Maintenance
- Gym Maintenance

### Administration
- Administrative Staff
- Office Supplies & Insurance
- Legal & Compliance
- Reserve Fund

## Environment Variables

Create a `.env` file in the `server` directory:

```
MONGODB_URI=mongodb://localhost:27017/society-comparison
PORT=5000
NODE_ENV=development
ADMIN_PASSWORD=admin123
```

## Project Structure

```
societycomparison/
├── server/                    # Node.js/Express backend
│   ├── config/               # Configuration files
│   ├── models/               # MongoDB schemas
│   ├── routes/               # API routes
│   ├── controllers/          # Business logic
│   ├── middleware/           # Authentication middleware
│   ├── seeders/              # Database seeders
│   ├── index.js             # Main server file
│   └── package.json
│
├── client/                    # React frontend
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── services/        # API client
│   │   ├── context/         # Auth context
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── docker-compose.yml         # MongoDB setup
├── README.md                  # This file
└── .gitignore
```

## Testing the Application

### Sample Data Flow

1. **Add a Society**:
   - Admin → Manage Societies → Fill in details
   - Example: Green Valley Apts, Sector 57, 250 flats, 500,000 sq ft

2. **Add Benchmark Data**:
   - Admin → Manage Benchmarks → Select society
   - Fill in maintenance charges per sq ft for each category
   - Example: Building Maintenance = ₹2.5/sq ft

3. **View Comparisons**:
   - Go to Comparison page → See your society in the table
   - Compare with other added societies

4. **View Insights**:
   - Go to Insights page → See statistics and outlier analysis
   - Identify if your society's charges are reasonable

## Security Notes

- Admin password is hardcoded for simplicity (change in production)
- Session cookies use httpOnly flag
- CORS is restricted to localhost:5173
- Implement proper authentication in production (JWT, OAuth, etc.)

## Future Enhancements

- User accounts with role-based access
- Historical tracking of charges over time
- Export comparison reports as PDF
- Machine learning-based recommendations
- Mobile app
- Email notifications
- Advanced analytics and predictive models

## Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is running: `docker-compose up -d`
- Check MongoDB URI in `.env` file

### Port Already in Use
- Backend: Change PORT in `.env` and update frontend API URL
- Frontend: Update port in `vite.config.js`

### CORS Errors
- Ensure frontend is on `http://localhost:5173`
- Backend CORS is configured for this URL

### Admin Login Not Working
- Default password: `admin123`
- Check `.env` file for correct password

## License

ISC

## Support

For issues or questions, please check the application logs and ensure all services are running correctly.
