# Disaster Preparedness App Deployment Script

Write-Host "🚀 Deploying Disaster Preparedness App..." -ForegroundColor Green

# Check if we're in the right directory
if (!(Test-Path "frontend/package.json") -or !(Test-Path "backend/app.py")) {
    Write-Host "❌ Error: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

# Deploy Backend to Railway
Write-Host "📦 Deploying Backend to Railway..." -ForegroundColor Yellow

# Check if Railway CLI is installed
try {
    railway --version | Out-Null
    Write-Host "✅ Railway CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Railway CLI not found. Installing..." -ForegroundColor Red
    npm install -g @railway/cli
}

# Deploy backend
Write-Host "🔧 Deploying to Railway..." -ForegroundColor Blue
railway up

# Get the Railway URL
$railwayUrl = railway status --json | ConvertFrom-Json | Select-Object -ExpandProperty url
Write-Host "🎯 Backend deployed to: $railwayUrl" -ForegroundColor Green

# Deploy Frontend to Vercel
Write-Host "🌐 Deploying Frontend to Vercel..." -ForegroundColor Yellow

# Check if Vercel CLI is installed
try {
    vercel --version | Out-Null
    Write-Host "✅ Vercel CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
}

# Update frontend environment variable with Railway URL
if ($railwayUrl) {
    $apiUrl = "$railwayUrl/api"
    Write-Host "🔗 Setting frontend API URL to: $apiUrl" -ForegroundColor Blue
    Set-Content -Path "frontend/.env.production" -Value "REACT_APP_API_URL=$apiUrl"
}

# Deploy frontend
Set-Location frontend
Write-Host "🔧 Deploying to Vercel..." -ForegroundColor Blue
vercel --prod

Write-Host "🎉 Deployment completed!" -ForegroundColor Green
Write-Host "📝 Don't forget to set environment variables in Railway dashboard:" -ForegroundColor Yellow
Write-Host "   - FLASK_ENV=production" -ForegroundColor White
Write-Host "   - JWT_SECRET_KEY=<generate-a-secure-key>" -ForegroundColor White

Set-Location ..
