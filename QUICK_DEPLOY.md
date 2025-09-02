# Quick Deployment Guide

## Option 1: Automated Deployment (Recommended)

### Prerequisites
1. Create accounts at:
   - [Railway.app](https://railway.app) (for backend)
   - [Vercel.com](https://vercel.com) (for frontend)
2. Push your code to GitHub if you haven't already

### Quick Deploy
1. Open PowerShell in your project directory
2. Run: `.\deploy.ps1`
3. Follow the prompts to connect your GitHub repo
4. Set environment variables (see below)

## Option 2: Manual Deployment

### Backend (Railway)
1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect Python and deploy
5. Set environment variables in Railway dashboard:
   - `FLASK_ENV` = `production`
   - `JWT_SECRET_KEY` = (generate with: `python -c "import secrets; print(secrets.token_hex(32))"`)

### Frontend (Vercel)
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project" → Import from GitHub
3. Select your repository
4. Configure project:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
5. After deployment, add environment variable:
   - `REACT_APP_API_URL` = Your Railway backend URL + `/api`

## Environment Variables Needed

### Railway (Backend):
```
FLASK_ENV=production
JWT_SECRET_KEY=<your-32-char-secret-key>
```

### Vercel (Frontend):
```
REACT_APP_API_URL=https://your-railway-app.up.railway.app/api
```

## Generate JWT Secret Key
Run this command to generate a secure JWT secret:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

## Testing Your Deployment
1. Visit your Vercel URL
2. Try registering a new account
3. Test login/logout functionality
4. Browse through the disaster preparedness resources
5. Take a quiz to test the full app functionality

## Common Issues
- **CORS errors**: Make sure your Railway backend URL is correct in the frontend environment variable
- **API not responding**: Check Railway logs in the dashboard
- **Build failures**: Ensure all dependencies are properly listed in package.json and requirements.txt
