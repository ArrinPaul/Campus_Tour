# Campus 360 - Simple Deployment Guide

## 🎯 Stack (No Credit Card Required!)

| Service | Platform | Free Tier |
|---------|----------|-----------|
| **Everything** | Vercel | 100 GB bandwidth/month |

**Total Cost: $0/month** ✅

---

## 🚀 Deploy to Vercel (5 Minutes)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

This opens browser - sign in with GitHub, Google, or email.

### Step 3: Deploy!

```bash
cd campus-360-app
vercel
```

Answer the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No
- **Project name?** → campus-360-tour (or any name)
- **Directory?** → ./
- **Override settings?** → No

### Step 4: Production Deploy

```bash
vercel --prod
```

**Done!** 🎉 Your app is live at `https://your-project.vercel.app`

---

## 📱 That's It!

Your 360° tour is now live with:
- ✅ All panorama images
- ✅ PWA support (installable)
- ✅ Global CDN (fast worldwide)
- ✅ HTTPS included
- ✅ Auto-deployments from Git (optional)

---

## 🔧 Optional: Connect to GitHub

For automatic deployments when you push code:

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click your project
3. Go to **Settings → Git**
4. Connect your GitHub repository

Now every `git push` automatically deploys!

---

## 📊 Vercel Free Tier Limits

| Feature | Limit |
|---------|-------|
| Bandwidth | 100 GB/month |
| Build Minutes | 6,000 min/month |
| Deployments | Unlimited |
| Projects | Unlimited |

Your ~590 MB of images = **~170 full tours/month** on free tier (plenty!)

---

## 🔧 Useful Commands

```bash
# Local development
npm run dev

# Build locally
npm run build

# Preview build
npm run preview

# Deploy to Vercel
vercel --prod

# Check deployment status
vercel ls
```

---

## 🆘 Troubleshooting

### Images not loading?
- Check `public/exported/` folder exists
- Run `npm run build` locally to verify

### Deploy failed?
- Check build logs: `vercel logs`
- Ensure `npm run build` works locally

### Want custom domain?
1. Go to Vercel Dashboard → Your Project
2. Settings → Domains
3. Add your domain
4. Update DNS records as shown

---

## 🔮 Future Scaling (Optional)

If you need more bandwidth later:
- **Vercel Pro**: $20/month for 1 TB bandwidth
- **Cloudinary**: Free 25 GB, great for image optimization
- **Firebase**: If you need database features

But for most campus tours, **Vercel free tier is enough!**
