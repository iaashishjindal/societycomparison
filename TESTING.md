# Testing Guide - Society Maintenance Benchmarking System

## Quick Start Testing

### Prerequisites
- Have all 3 services running:
  - MongoDB: `docker-compose up -d`
  - Backend: `cd server && npm run dev` (Terminal 1)
  - Frontend: `cd client && npm run dev` (Terminal 2)

## Test Scenarios

### 1. Public User Journey

#### 1.1 View Home Page
1. Navigate to `http://localhost:5173`
2. **Expected**: 
   - See welcome message
   - See stats showing 0 societies and 18 benchmarks
   - See quick links

#### 1.2 View Comparison Page
1. Click "Comparison" in header
2. **Expected**: 
   - Message "Showing 0 of 0 societies"
   - Empty table (no data yet)

#### 1.3 View Insights Page
1. Click "Insights" in header
2. **Expected**: 
   - "No data available" message (since no societies added yet)

### 2. Admin Login & Setup

#### 2.1 Admin Login
1. Click "Admin" in header
2. Click "Admin" link or navigate to `/admin`
3. Enter password: `admin123`
4. Click "Login"
5. **Expected**: 
   - Login form disappears
   - Admin panel appears with two tabs: "Manage Societies" and "Manage Benchmarks"
   - "Logout" button visible

#### 2.2 Add First Society
1. In "Manage Societies" tab, fill form with:
   - Name: `Green Valley Apartments`
   - Location: `Sector 57, Gurgaon`
   - Total Flats: `250`
   - Total Area: `500000`
   - Year Established: `2010`
2. Click "Add Society"
3. **Expected**: 
   - Success message
   - Society appears in "Existing Societies" table below
   - Home page stats now show 1 society

#### 2.3 Add Second Society
1. Fill form with:
   - Name: `Sunrise Towers`
   - Location: `Sector 52, Gurgaon`
   - Total Flats: `180`
   - Total Area: `350000`
   - Year Established: `2015`
2. Click "Add Society"
3. **Expected**: 
   - Both societies visible in table
   - Home stats show 2 societies

#### 2.4 Add Third Society (Different Area)
1. Fill form with:
   - Name: `Maple Residency`
   - Location: `Cybercity, Gurgaon`
   - Total Flats: `320`
   - Total Area: `600000`
   - Year Established: `2008`
2. Click "Add Society"
3. **Expected**: 
   - All 3 societies in table
   - Home stats show 3 societies

### 3. Add Benchmark Data

#### 3.1 Add Data for First Society
1. Go to "Manage Benchmarks" tab
2. Select "Green Valley Apartments" from dropdown
3. **Expected**: Form loads with all benchmark categories

#### 3.2 Fill Benchmark Values for Green Valley
Fill in the following values (per sq ft):

**Building & Maintenance:**
- Annual Building Maintenance: `2.5`
- Painting & Whitewashing: `0.5`
- Pest Control: `0.3`
- Lift Maintenance: `1.2`

**Utilities:**
- Water Supply & Treatment: `1.8`
- Electricity - Common Areas: `1.5`
- Sewage Treatment: `0.4`

**Security & Safety:**
- Security Staff Salaries: `3.0`
- CCTV & Monitoring: `0.8`
- Fire Safety & Alarms: `0.2`
- Gate Maintenance: `0.5`

**Amenities & Recreation:**
- Garden & Landscaping: `1.0`
- Swimming Pool Maintenance: `0.6`
- Gym Maintenance: `0.4`

**Administration:**
- Administrative Staff: `2.0`
- Office Supplies & Insurance: `0.5`
- Legal & Compliance: `0.3`
- Reserve Fund: `1.0`

**Total: ~19.6 per sq ft**

1. Click "Save All Benchmarks"
2. **Expected**: Success message

#### 3.3 Add Data for Sunrise Towers (Similar but slightly lower)
1. Select "Sunrise Towers"
2. Fill with values 5-10% lower than Green Valley
3. Click "Save All Benchmarks"

#### 3.4 Add Data for Maple Residency (Slightly higher)
1. Select "Maple Residency"
2. Fill with values 5-10% higher than Green Valley
3. Click "Save All Benchmarks"

### 4. Test Public Features

#### 4.1 View Updated Comparison Table
1. Navigate to "Comparison" page
2. **Expected**: 
   - All 3 societies visible in table
   - Shows: Name, Location, Total Flats, Total Area, Year Est., Building Maintenance charge
   - Can scroll to see all columns

#### 4.2 Test Filters
1. Filter by location: Type "Sector 57"
2. **Expected**: Only Green Valley Apartments shown

1. Clear location, filter Min Flats: `200`
2. **Expected**: Green Valley (250) and Maple (320) shown, Sunrise (180) hidden

1. Filter Max Area: `400000`
2. **Expected**: Only Sunrise Towers (350,000) shown

#### 4.3 Test Sorting
1. Sort by "Name"
2. **Expected**: Alphabetical order (Green Valley → Maple → Sunrise)

1. Sort by "Flats"
2. **Expected**: Descending order (Maple 320 → Green Valley 250 → Sunrise 180)

#### 4.4 View Insights Page
1. Navigate to "Insights" page
2. **Expected**: 
   - Bar charts showing Mean vs Median for benchmarks
   - Outlier detection chart
   - Detailed insights box for each benchmark with stats
   - Scatter plots showing charge vs number of flats

#### 4.5 Analyze Statistics
1. Look at "Annual Building Maintenance" insights
2. **Expected**: 
   - Mean value around 2.5-2.7
   - One society (Maple) might show as slightly higher
   - Std Dev shown

### 5. Test Admin Updates

#### 5.1 Delete a Society
1. Go back to "Manage Societies" tab
2. Click "Delete" for Sunrise Towers
3. Confirm deletion
4. **Expected**: 
   - Success message
   - Society removed from table
   - Comparison page updated (2 societies now)
   - Insights updated

#### 5.2 Update Benchmark Data
1. Go to "Manage Benchmarks" tab
2. Select "Green Valley Apartments"
3. Change one value (e.g., Building Maintenance from 2.5 to 3.0)
4. Click "Save All Benchmarks"
5. **Expected**: 
   - Success message
   - Comparison table updated with new value

### 6. Test Admin Logout

#### 6.1 Logout
1. Click "Logout" button in admin panel
2. **Expected**: 
   - Returns to admin login page
   - Must re-enter password to access admin functions

#### 6.2 Verify Session Persistence
1. Refresh page while logged in as admin
2. **Expected**: Still logged in (session persists)

1. Close browser tab, reopen admin page
2. **Expected**: Must login again

### 7. Edge Cases & Error Handling

#### 7.1 Invalid Login
1. Try login with wrong password
2. **Expected**: Error message "Invalid password"

#### 7.2 Missing Required Fields
1. Try adding society without name
2. **Expected**: Required fields validation (handled by HTML5)

#### 7.3 Duplicate Society Name
1. Try adding society with same name as existing
2. **Expected**: Either allow it or show error (depends on backend validation)

#### 7.4 Large Numbers
1. Add society with:
   - Flats: `5000`
   - Area: `10000000`
2. **Expected**: Handles large numbers correctly in charts and tables

#### 7.5 Decimal Benchmarks
1. Add benchmark value: `1.567` (3 decimal places)
2. **Expected**: Stored and displayed correctly

### 8. Visual Testing

#### 8.1 Responsive Design
1. Resize browser window (test at 320px, 768px, 1200px width)
2. **Expected**: Layout adjusts properly, no overflow

#### 8.2 Chart Display
1. View Insights page
2. **Expected**: All charts render properly, legends visible, tooltips work on hover

#### 8.3 Table Scrolling
1. On mobile/narrow viewport, view Comparison table
2. **Expected**: Horizontal scroll works, table is readable

### 9. Performance Testing

#### 9.1 Load Times
1. Open Network tab in browser DevTools
2. Load home page
3. **Expected**: 
   - Page loads in <2 seconds
   - API calls return quickly

#### 9.2 Many Societies
1. Via API or script, add 20 societies with full benchmark data
2. Load Comparison page
3. **Expected**: Page still loads reasonably fast, no lag

### 10. Browser Compatibility

Test on:
- Chrome (latest)
- Firefox (latest)
- Safari (if on Mac)

**Expected**: All features work, styling consistent

## Automated Health Checks

```bash
# Health check backend
curl http://localhost:5000/health

# Expected response:
# {"status":"OK"}

# Check public API
curl http://localhost:5000/api/societies

# Expected response:
# JSON array of societies
```

## Test Data Summary

After all tests, you should have:
- 2 societies (Green Valley, Maple Residency)
- 18 benchmark categories
- Full benchmark data for both societies
- Comparison, filtering, sorting, and analytics all working
- Admin login/logout functional

## Checklist

- [ ] Home page loads with correct stats
- [ ] Comparison page works with 3+ societies
- [ ] All filters function correctly
- [ ] Sorting works (by name, flats, area)
- [ ] Insights page displays charts
- [ ] Admin login/logout works
- [ ] Can add societies
- [ ] Can add/update benchmarks
- [ ] Can delete societies
- [ ] Session persists on page refresh
- [ ] Responsive design works
- [ ] Error handling displays messages
- [ ] Charts display properly
- [ ] No console errors

## Success Criteria

All tests pass when:
1. All UI elements are interactive and responsive
2. Data persists across page refreshes
3. Admin operations update public views immediately
4. Charts and statistics are calculated correctly
5. No JavaScript errors in console
6. Performance is acceptable (< 2s page load)

## Troubleshooting During Testing

**Problem**: Can't login to admin
- Check password is `admin123` (case-sensitive)
- Restart backend server

**Problem**: Societies not showing in comparison
- Ensure benchmarks are saved for the society
- Check backend logs for errors
- Refresh page

**Problem**: Charts not displaying
- Check browser console for errors
- Ensure data was added correctly
- Try clearing browser cache

**Problem**: CORS errors
- Verify backend is running on port 5000
- Verify frontend is on port 5173
- Check CORS configuration in server/index.js

---

**Testing Duration**: ~30-45 minutes for complete test suite

**Last Updated**: 2024
