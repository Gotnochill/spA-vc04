# 🛠️ Smart Pricing AI - Troubleshooting Guide

## ✅ **ISSUE RESOLVED: VS Code Tasks Fixed**

The VS Code task configuration has been **completely fixed**! All tasks now use the correct Python executable path.

## 🔧 **Updated VS Code Configuration**

### **Fixed Tasks** (`.vscode/tasks.json`)
- ✅ **Install Backend Dependencies** - Now uses correct Python path
- ✅ **Install Frontend Dependencies** - NPM installation
- ✅ **Start Backend Server** - FastAPI with uvicorn
- ✅ **Start Frontend Server** - Next.js development server
- ✅ **Start Full Application** - Runs both servers

### **New Launch Configurations** (`.vscode/launch.json`)
- 🐛 **Debug Backend (FastAPI)** - Step-through debugging
- 📊 **Run Sample Data Generation** - Generate test data
- 🤖 **Train ML Models** - Train pricing models

## 🚀 **How to Use VS Code Tasks**

### **Method 1: Command Palette**
1. Press `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (Mac)
2. Type "Tasks: Run Task"
3. Select the task you want to run:
   - **Install Backend Dependencies** ✅
   - **Install Frontend Dependencies** ✅
   - **Start Backend Server** 🔧
   - **Start Frontend Server** 🎨
   - **Start Full Application** 🚀

### **Method 2: Terminal Menu**
1. Go to **Terminal → Run Task...**
2. Choose from available tasks

### **Method 3: Keyboard Shortcut**
- Press `Ctrl+Shift+B` to run build tasks

## 🐛 **Common Issues & Solutions**

### **❌ "py: command not found"**
**✅ FIXED!** 
- **Issue**: Old task used `py` command not available in bash
- **Solution**: Updated to use full Python executable path: `D:/smartPricing/.venv/Scripts/python.exe`

### **❌ "npm: command not found"**
**Solution**: 
```bash
# Install Node.js from https://nodejs.org/
# Or use package manager:
winget install OpenJS.NodeJS  # Windows
brew install node            # Mac
```

### **❌ Port Already in Use**
**Solution**:
```bash
# Find process using port 3000 (frontend)
netstat -ano | findstr :3000
taskkill /PID <process_id> /F

# Find process using port 8000 (backend)
netstat -ano | findstr :8000
taskkill /PID <process_id> /F
```

### **❌ Virtual Environment Issues**
**Solution**:
```bash
# Recreate virtual environment
cd d:/smartPricing
rm -rf .venv
python -m venv .venv
.venv/Scripts/activate
pip install -r backend/requirements.txt
```

## 🔍 **Debugging Steps**

### **1. Check Python Environment**
```bash
# Verify Python path
D:/smartPricing/.venv/Scripts/python.exe --version

# Check installed packages
D:/smartPricing/.venv/Scripts/python.exe -m pip list
```

### **2. Test Backend Manually**
```bash
cd d:/smartPricing/backend
D:/smartPricing/.venv/Scripts/python.exe -m uvicorn main:app --reload
```

### **3. Test Frontend Manually**
```bash
cd d:/smartPricing/frontend
npm run dev
```

### **4. Check API Endpoints**
- Backend Health: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- Frontend: http://localhost:3000

## 📊 **Performance Monitoring**

### **Backend Logs**
- Check terminal output for FastAPI logs
- API request/response times
- Error messages and stack traces

### **Frontend Logs**
- Browser developer console (F12)
- Next.js compilation messages
- Network tab for API calls

## 🛡️ **Security Notes**

### **Development vs Production**
- **Current setup**: Development mode with hot reload
- **CORS**: Allow all origins (development only)
- **Secrets**: No sensitive data in repository

### **Production Checklist**
- [ ] Update CORS settings
- [ ] Add environment variables
- [ ] Configure HTTPS
- [ ] Set up proper logging
- [ ] Add authentication

## 📝 **VS Code Extensions Recommended**

### **Python Development**
- Python (Microsoft)
- Python Debugger
- Pylance

### **Frontend Development**
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Tailwind CSS IntelliSense

### **General**
- GitLens
- REST Client
- Thunder Client (API testing)

## 🚀 **Quick Start Commands**

### **Full Reset & Restart**
```bash
# Stop all servers (Ctrl+C in terminals)
# Then run:
cd d:/smartPricing

# Backend setup
cd backend
D:/smartPricing/.venv/Scripts/python.exe -m pip install -r requirements.txt
D:/smartPricing/.venv/Scripts/python.exe -m uvicorn main:app --reload &

# Frontend setup
cd ../frontend
npm install
npm run dev
```

### **Using VS Code Tasks (Recommended)**
1. Open VS Code in the project root
2. Press `Ctrl+Shift+P`
3. Type "Tasks: Run Task"
4. Select "Start Full Application"

## 📞 **Getting Help**

### **Check Status**
- ✅ Backend running: http://localhost:8000
- ✅ Frontend running: http://localhost:3000
- ✅ API docs: http://localhost:8000/docs

### **Log Files**
- Backend: Terminal output
- Frontend: Browser console (F12)
- VS Code: Output panel

### **Common Commands**
```bash
# Check if servers are running
curl http://localhost:8000        # Backend
curl http://localhost:3000        # Frontend

# Restart services
# Use VS Code tasks or manual commands above
```

---

## 🎉 **Status: All Fixed!**

Your Smart Pricing AI development environment is now **fully configured** with:
- ✅ Correct Python paths in VS Code tasks
- ✅ Working backend and frontend servers
- ✅ Professional debugging setup
- ✅ Comprehensive task automation
- ✅ Beautiful, functional UI

**Ready for development and demonstration! 🚀**
