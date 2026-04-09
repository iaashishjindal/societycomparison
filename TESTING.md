# Testing Guide - Society Maintenance Charges Benchmarking System

This document provides step-by-step instructions to test the complete application.

## Prerequisites

- Node.js installed
- MongoDB running (via Docker or local installation)
- Ports 5000 (backend) and 5173 (frontend) available

## Setup for Testing

### 1. Start MongoDB

**Option A: Using Docker (Recommended)**
```bash
docker-compose up -d
```

**Option B: Local MongoDB**
Ensure MongoDB is running on `mongodb://localhost:27017`

### 2. Start Backend Server

```bash
cd server
npm install  # if not done already
npm start
```

Expected output:
```
✓ MongoDB connected successfully
✓ Seeded 17 benchmarks
✓ Server running on http://localhost:5000
✓ API available at http://localhost:5000/api
✓ Admin API available at http://localhost:5000/api/admin
```

### 3. Start Frontend (in new terminal)

```bash
cd client
npm install  # if not done already
npm run dev
```

Expected output:
```
VITE v... ready in ... ms

➜  Local:   http://localhost:5173/
```

## Manual Test Cases

### Test 1: Home Page
1. Navigate to `http://localhost:5173`
2. **Expected**: 
   - Page loads with "Society Maintenance Charges Benchmarking" title
   - Shows 4 stat cards (Societies, Avg Maintenance, Avg Units, Avg Area)
   - All stats show 0 initially (no data yet)
   - Quick links buttons are visible

### Test 2: Admin Login
1. Click "🔐 Admin Access" button on home page
2. Modal appears asking for password
3. Try with wrong password: should show "Invalid password" error
4. Enter correct password: `admin123`
5. **Expected**: Login successful, modal closes, admin panel accessible

### Test 3: Create Societies (Admin)
1. After login, click "⚙️ Admin Panel" in navbar
2. Go to "🏢 Manage Societies" tab
3. Fill in society form:
   - Name: "Ashoka Garden Apartments"
   - Location: "Gurgaon - Sector 63"
   - Total Flats: 150
   - Total Area: 50000
   - Year Established: 2010
4. Click "Add Society"
5. **Expected**: Success message, society appears in table below

6. Repeat to add 2-3 more societies:
   - Society 2: "Crown Heights", Sector 43, 200 flats, 60000 sq ft, 2005
   - Society 3: "Meridian View", Sector 48, 100 flats, 35000 sq ft, 2015

### Test 4: Enter Benchmark Data (Admin)
1. Click "📊 Manage Benchmarks" tab
2. Select first society from dropdown
3. Enter benchmark values (sample data):
   - Annual building maintenance: 2.5
   - Painting & whitewashing: 0.5
   - Pest control: 1.0
   - Lift maintenance: 0.3
   - Water supply & treatment: 1.2
   - Electricity for common areas: 0.8
   - Sewage treatment: 0.4
   - Security staff salaries: 1.5
   - CCTV & monitoring: 0.2
   - Fire safety & alarms: 0.1
   - Gate maintenance: 0.15
   - Garden & landscaping: 0.8
   - Swimming pool maintenance: 0 (if not applicable)
   - Gym facility: 0.3
   - Staff salaries: 2.0
   - Office supplies & insurance: 0.5
   - Legal & compliance: 0.2
   - Reserve fund: 1.0
4. Click "Save All Benchmarks"
5. **Expected**: Success message

6. Select 2nd society and enter similar/slightly different values
7. Select 3rd society with some higher values (e.g., 3.5 for maintenance instead of 2.5)

### Test 5: View Comparisons
1. Click "Comparison" in navbar (logout if in admin, or use new browser window)
2. **Expected**:
   - See all 3 societies listed
   - Benchmark comparison tables showing values for each society
   - Variance percentages shown (positive/negative)
   - Outlier detection for the society with higher values (⚠️ Outlier marker)

### Test 6: Apply Filters
1. On Comparison page, use filters:
   - Filter by location: "Sector 63" → only shows Ashoka Garden
   - Filter by Min Flats: 150 → shows only societies with 150+ flats
   - Filter by Max Area: 50000 → shows only smaller areas
2. Click "Apply"
3. **Expected**: Table updates to show only filtered societies

### Test 7: View Insights
1. Click "Insights" in navbar
2. **Expected**:
   - See statistics cards (3 societies, 17 benchmarks)
   - Dropdown to select benchmark
   - Statistics displayed (Average, Median, Min, Max, Std Dev)
   - Bar chart showing distribution across societies
   - Sorted table with deviation percentages

3. Change selected benchmark:
   - Chart updates
   - Statistics update
   - Table updates

### Test 8: Edit Society (Admin)
1. Go back to Admin Panel
2. Click "Edit" on a society
3. Change the Total Flats to 180
4. Click "Update Society"
5. **Expected**: Success message, table updates
6. Verify change on Comparison page (refresh if needed)

### Test 9: Delete Society (Admin)
1. In Admin Panel, click "Delete" on a society
2. Confirm deletion
3. **Expected**: Success message, society removed from table
4. Verify it's gone from Comparison/Insights pages (refresh)

### Test 10: Logout
1. Click "Logout" button in navbar (appears after admin login)
2. **Expected**: Button disappears, "Admin Access" button returns
3. Try accessing `/admin` directly → should redirect to home

## API Testing (Optional)

Test directly with curl:

```bash
# Get all societies
curl http://localhost:5000/api/societies

# Get all benchmarks
curl http://localhost:5000/api/benchmarks

# Get comparison data
curl "http://localhost:5000/api/comparison"

# Get insights summary
curl http://localhost:5000/api/insights/summary

# Admin login
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password":"admin123"}' \
  -c cookies.txt

# Create society (needs admin session)
curl -X POST http://localhost:5000/api/admin/societies \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name":"Test Society",
    "location":"Gurgaon",
    "totalFlats":100,
    "totalArea":30000,
    "yearEstablished":2020
  }'
```

## Expected Results

✓ **Home Page**: Loads with correct statistics
✓ **Admin Auth**: Login/logout works with correct password validation
✓ **Society CRUD**: Can create, read, update, delete societies
✓ **Benchmark Data**: Can enter and save benchmark values
✓ **Comparisons**: Shows accurate data and calculations
✓ **Filters**: Work correctly with proper data filtering
✓ **Insights**: Charts render and statistics are calculated
✓ **Outlier Detection**: Identifies unusual values correctly
✓ **Responsive**: Works on desktop (mobile testing optional)

## Troubleshooting

### MongoDB Connection Error
```
✗ MongoDB connection error: connect ECONNREFUSED
```
**Solution**: Start MongoDB with `docker-compose up -d`

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Kill existing process or use different port: `PORT=5001 npm start`

### CORS Error on Frontend
```
Access to XMLHttpRequest blocked by CORS
```
**Solution**: Ensure backend is running and check vite proxy config in `vite.config.js`

### Build Issues
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
npm start/run dev
```

## Performance Notes

- First load may take a few seconds (dependencies loading)
- Charts render smoothly with 3+ societies
- Filtering is instant once data is loaded
- Admin operations complete within 1-2 seconds

## Cleanup

To stop services:

```bash
# Stop backend: Ctrl+C in terminal

# Stop frontend: Ctrl+C in terminal

# Stop MongoDB
docker-compose down
```

## Success Criteria

- [ ] All 3 societies can be created and viewed
- [ ] Admin can enter benchmark data for all benchmarks
- [ ] Comparison page shows accurate values and percentages
- [ ] Filters work correctly
- [ ] Insights page displays charts without errors
- [ ] Outlier detection marks appropriate values
- [ ] Admin login/logout works
- [ ] No console errors

## Notes

- Initial data seeding creates 17 benchmarks automatically
- Each society can have multiple benchmark entries
- Statistics are calculated in real-time from the database
- Outliers are detected using Interquartile Range (IQR) method
- All data is persisted in MongoDB
