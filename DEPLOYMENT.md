# Deployment Instructions

## Backend Deployment on Railway

### Step 1: Setup Railway
1. Go to [railway.app](https://railway.app) and sign up/login
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo" and connect your repository
4. Railway will automatically detect it's a Python app

### Step 2: Configure Environment Variables
Set these environment variables in Railway dashboard:
- `FLASK_ENV`: `production`
- `JWT_SECRET_KEY`: Generate a secure random string (use: `python -c "import secrets; print(secrets.token_hex(32))"`)
- `PORT`: `8000` (Railway will override this automatically)
- `WORKERS`: `2`

### Step 3: Database (Optional)
For production, consider adding a PostgreSQL database:
1. In Railway dashboard, click "Add Service" → "PostgreSQL"
2. Railway will automatically set `DATABASE_URL` environment variable
3. Update your requirements.txt to include `psycopg2-binary` for PostgreSQL support

## Frontend Deployment on Vercel

### Step 1: Setup Vercel
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Set the root directory to `frontend`

### Step 2: Configure Build Settings
- Build Command: `npm run build`
- Output Directory: `build`
- Install Command: `npm install`

### Step 3: Environment Variables
After backend is deployed, update the frontend environment variable:
- `REACT_APP_API_URL`: Your Railway backend URL (e.g., `https://your-app-name.up.railway.app/api`)

## Quick Deploy Commands

### For Railway (Backend):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway link
railway up
```

### For Vercel (Frontend):
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel

# Set production environment variable
vercel env add REACT_APP_API_URL production
```

## Environment Variables Summary

### Backend (Railway):
- `FLASK_ENV=production`
- `JWT_SECRET_KEY=<your-secret-key>`
- `DATABASE_URL=<automatically-set-by-railway-if-using-postgres>`

### Frontend (Vercel):
- `REACT_APP_API_URL=<your-railway-backend-url>/api`

## Testing Deployment
1. Visit your Vercel frontend URL
2. Check that API calls work properly
3. Test user registration and login
4. Verify all features are working
