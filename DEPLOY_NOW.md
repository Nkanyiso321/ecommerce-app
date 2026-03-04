# 🚀 DEPLOY IN 10 MINUTES 

**Free deployment with Railway (Backend) + Vercel (Frontend)**

---

## ⚡ Quick Start

### Step 1: Push to GitHub (2 min)
```powershell
cd "c:\Ecommerce app"
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/ecommerce-app.git
git push -u origin main
```

### Step 2: Deploy Backend (3 min)
1. Go to [railway.app](https://railway.app)
2. Sign up (free, no credit card)
3. **New Project** → **Deploy from GitHub**
4. Connect GitHub & select your repo
5. Select `backend` folder
6. ✅ **Done!** Railway creates PostgreSQL automatically

### Step 3: Deploy Frontend (3 min)
1. Go to [vercel.com](https://vercel.com)
2. Sign up (free)
3. **Import Project** → Select your GitHub repo
4. Set root directory: `frontend`
5. ✅ **Done!** Auto-deployed

### Step 4: Configure (2 min)
**Railway → Your Project → Variables:**
```
DB_HOST=postgres
DB_PORT=5432
NODE_ENV=production
JWT_SECRET=your-random-string
STRIPE_SECRET_KEY=your-stripe-key
OPENAI_API_KEY=your-openai-key
```

**Vercel → Settings → Environment Variables:**
```
REACT_APP_API_BASE_URL=https://your-railway-url/api
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_...
```

---

## 🌐 Your Live App

After deployment:
- **Frontend**: `https://ecommerce-app-yourname.vercel.app`
- **Backend API**: `https://ecommerce-app-xxxxx.up.railway.app`
- **Database**: Hosted on Railway (PostgreSQL)

---

## 💡 Tips

- Railway gives **$5/month free** (plenty for testing)
- Vercel is **completely free** for frontend
- Both auto-deploy when you push to GitHub
- View logs in dashboards to debug issues

**See [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md) for detailed guide**
