# IoT Dashboard - Windows Installation Guide

## Prerequisites Installation

### 1. Install Python 3.8+
1. Visit https://www.python.org/downloads/
2. Download Python 3.8 or higher (recommended: Python 3.11)
3. Run the installer
4. ✅ **IMPORTANT**: Check "Add Python to PATH" during installation
5. Click "Install Now"

**Verify Installation:**
```bash
python --version
pip --version
```

### 2. Install Node.js 16+ and npm
1. Visit https://nodejs.org/
2. Download LTS version (recommended: 18.x or 20.x)
3. Run the installer with default settings
4. Node.js includes npm automatically

**Verify Installation:**
```bash
node --version
npm --version
```

### 3. Install Yarn (Package Manager)
```bash
npm install -g yarn
```

**Verify Installation:**
```bash
yarn --version
```

### 4. Install MongoDB

**Option A: Local MongoDB Installation**
1. Visit https://www.mongodb.com/try/download/community
2. Download MongoDB Community Server for Windows
3. Run installer with default settings
4. MongoDB will run as a Windows Service automatically

**Option B: Use MongoDB Atlas (Cloud - Recommended for Easy Setup)**
1. Visit https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a free cluster
4. Get connection string (e.g., mongodb+srv://username:password@cluster.mongodb.net/)

### 5. Install Git (Optional - for cloning repository)
1. Visit https://git-scm.com/download/win
2. Download and install with default settings

---

## Project Setup

### Step 1: Download/Extract Project
Extract the project to a folder, e.g., `C:\Projects\iot-dashboard`

Open Command Prompt or PowerShell and navigate to the project:
```bash
cd C:\Projects\iot-dashboard
```

---

## Backend Setup

### Step 2: Navigate to Backend Folder
```bash
cd app\backend
```

### Step 3: Create Virtual Environment (Recommended)
```bash
python -m venv venv
```

### Step 4: Activate Virtual Environment
**Command Prompt:**
```bash
venv\Scripts\activate
```

**PowerShell:**
```bash
venv\Scripts\Activate.ps1
```

**Note:** If PowerShell gives execution policy error, run:
```bash
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Step 5: Upgrade pip
```bash
python -m pip install --upgrade pip
```

### Step 6: Install Backend Dependencies
```bash
pip install -r requirements.txt
```

This will install:
- FastAPI
- Uvicorn
- Motor (MongoDB async driver)
- Pydantic
- Python-dotenv
- And all other dependencies

### Step 7: Configure Backend Environment
Create a file named `.env` in `app/backend/` folder with:

```
MONGO_URL=mongodb://localhost:27017
DB_NAME=iot_dashboard
CORS_ORIGINS=*
```

**If using MongoDB Atlas:**
```
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=iot_dashboard
CORS_ORIGINS=*
```

---

## Frontend Setup

### Step 8: Open NEW Terminal Window
Keep the backend terminal open, and open a NEW Command Prompt or PowerShell window.

Navigate to frontend folder:
```bash
cd C:\Projects\iot-dashboard\app\frontend
```

### Step 9: Install Frontend Dependencies
```bash
yarn install
```

**Alternative (if yarn doesn't work):**
```bash
npm install
```

This will install:
- React 19
- Tailwind CSS
- Recharts
- jsPDF
- Lucide React icons
- Shadcn UI components
- And all other dependencies

### Step 10: Configure Frontend Environment
The `.env` file should already exist in `app/frontend/` with:

```
REACT_APP_BACKEND_URL=http://localhost:8001
WDS_SOCKET_PORT=443
ENABLE_HEALTH_CHECK=false
```

**For local development, change to:**
```
REACT_APP_BACKEND_URL=http://localhost:8001
WDS_SOCKET_PORT=0
ENABLE_HEALTH_CHECK=false
```

---

## Running the Application

### Terminal 1: Start Backend Server

Navigate to backend folder (if not already there):
```bash
cd C:\Projects\iot-dashboard\app\backend
```

Activate virtual environment:
```bash
venv\Scripts\activate
```

Start the backend server:
```bash
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

**You should see:**
```
INFO:     Uvicorn running on http://0.0.0.0:8001 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Backend is now running on:** `http://localhost:8001`

---

### Terminal 2: Start Frontend Development Server

Open a NEW terminal window.

Navigate to frontend folder:
```bash
cd C:\Projects\iot-dashboard\app\frontend
```

Start the frontend:
```bash
yarn start
```

**Alternative:**
```bash
npm start
```

**You should see:**
```
Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

**Frontend will automatically open in your default browser at:** `http://localhost:3000`

---

## Accessing the Dashboard

Open your web browser and go to:
```
http://localhost:3000
```

**Available Features:**
✅ 5 Sensor Cards (North Wing, South Wing, East Wing, West Wing, Central Hub)
✅ 3 Gauge Charts (Average Temperature, Humidity, Pressure)
✅ Line Chart (24-hour trends)
✅ Bar Chart (Sensor comparison)
✅ Data Table (All sensor readings)
✅ Health Monitoring Dashboard
✅ Export Data (CSV/PDF) with date range selection
✅ Alert Configuration (Mocked email notifications)
✅ Auto-refresh toggle (every 30 seconds)
✅ Manual refresh button

---

## Testing API Endpoints

Open browser or use tools like Postman:

**1. API Root:**
```
http://localhost:8001/api/
```

**2. Get All Sensors:**
```
http://localhost:8001/api/sensors
```

**3. Get Sensor History:**
```
http://localhost:8001/api/sensors/SENSOR-01/history
```

**4. Get Health Data:**
```
http://localhost:8001/api/sensors/health/all
```

**5. Get Alerts:**
```
http://localhost:8001/api/alerts
```

---

## Stopping the Application

### To Stop Backend:
- Press `CTRL + C` in the backend terminal

### To Stop Frontend:
- Press `CTRL + C` in the frontend terminal
- Type `Y` when asked to terminate

### Deactivate Virtual Environment:
```bash
deactivate
```

---

## Troubleshooting

### Issue: "Port already in use"
**Solution:**
```bash
# Kill process on port 8001 (Backend)
netstat -ano | findstr :8001
taskkill /PID <PID_NUMBER> /F

# Kill process on port 3000 (Frontend)
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

### Issue: "Module not found" errors
**Solution:**
```bash
# Backend
cd app\backend
pip install -r requirements.txt

# Frontend
cd app\frontend
yarn install
```

### Issue: MongoDB connection error
**Solution:**
- Verify MongoDB is running (check Windows Services)
- Check `.env` file has correct MONGO_URL
- If using Atlas, ensure IP is whitelisted and credentials are correct

### Issue: PowerShell execution policy error
**Solution:**
```bash
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue: Python not recognized
**Solution:**
- Reinstall Python and check "Add to PATH"
- Or manually add Python to PATH in System Environment Variables

---

## Quick Start Commands Summary

**Terminal 1 (Backend):**
```bash
cd C:\Projects\iot-dashboard\app\backend
venv\Scripts\activate
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

**Terminal 2 (Frontend):**
```bash
cd C:\Projects\iot-dashboard\app\frontend
yarn start
```

**Open Browser:**
```
http://localhost:3000
```

---

## Development Tips

1. **Hot Reload Enabled:** Both frontend and backend auto-reload on file changes
2. **MongoDB Data:** All sensor data is mocked/generated - no database setup required
3. **Email Alerts:** Notifications are mocked (not actually sent)
4. **Logs:** Check terminal windows for any errors or warnings

---

## Production Build (Optional)

### Build Frontend for Production:
```bash
cd app\frontend
yarn build
```

Output will be in `app\frontend\build\` folder.

### Serve Production Build:
```bash
npx serve -s build -l 3000
```

---

## Support

If you encounter any issues:
1. Check both terminal windows for error messages
2. Verify all prerequisites are installed
3. Ensure MongoDB is running
4. Check firewall settings aren't blocking ports 3000 or 8001
5. Review the Troubleshooting section above

---

**Dashboard is now ready to use! 🚀**
