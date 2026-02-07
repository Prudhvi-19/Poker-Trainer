# 🚀 How to Deploy to GitHub Pages

This guide will help you deploy your GTO Poker Trainer to GitHub Pages so anyone can access it online.

## 📋 Prerequisites

- Your code is already pushed to GitHub (✅ Done!)
- You're on branch: `claude/setup-gto-poker-repo-juFol`

---

## 🎯 Option 1: Deploy from Main Branch (Recommended)

### Step 1: Merge to Main Branch

```bash
# Switch to main branch
git checkout main

# Pull latest changes
git pull origin main

# Merge your feature branch
git merge claude/setup-gto-poker-repo-juFol

# Push to main
git push origin main
```

### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub:
   `https://github.com/Prudhvi-19/Poker-Trainer`

2. Click **"Settings"** tab (top right)

3. Scroll down to **"Pages"** in the left sidebar

4. Under **"Source"**, select:
   - **Branch**: `main`
   - **Folder**: `/ (root)`

5. Click **"Save"**

6. Wait 1-2 minutes for deployment

7. Your site will be live at:
   `https://prudhvi-19.github.io/Poker-Trainer/`

---

## 🎯 Option 2: Deploy from Current Branch

If you want to deploy directly from your current branch without merging:

### Step 1: Enable GitHub Pages

1. Go to repository **Settings** → **Pages**

2. Under **"Source"**, select:
   - **Branch**: `claude/setup-gto-poker-repo-juFol`
   - **Folder**: `/ (root)`

3. Click **"Save"**

4. Your site will be live at:
   `https://prudhvi-19.github.io/Poker-Trainer/`

---

## ✅ Verification

After deployment, visit your site:

```
https://prudhvi-19.github.io/Poker-Trainer/
```

You should see the GTO Poker Trainer dashboard!

---

## 🔧 Troubleshooting

### Issue: "404 Page Not Found"

**Solution**: GitHub Pages takes 1-2 minutes to build. Wait and refresh.

### Issue: "Files not loading"

**Possible causes**:
1. **Case sensitivity**: GitHub Pages is case-sensitive. Check file paths.
2. **ES6 modules**: Should work fine (already using `.js` extensions)

### Issue: "Blank page"

1. Open browser console (F12)
2. Check for errors
3. Most likely: Path issues in imports

---

## 🎨 Custom Domain (Optional)

If you have a custom domain (like `pokertrainer.com`):

1. Go to **Settings** → **Pages**
2. Enter your domain in **"Custom domain"**
3. Add CNAME record in your domain registrar pointing to:
   ```
   prudhvi-19.github.io
   ```

---

## 🔄 Updating After Deployment

Every time you push code to the branch you selected for GitHub Pages, it will automatically rebuild and deploy.

```bash
# Make changes
git add .
git commit -m "Update feature X"
git push origin main  # or your selected branch

# Wait 1-2 minutes for automatic deployment
```

---

## 📊 Features Now Live

Once deployed, users can access:

- ✅ **12 Complete Modules** (Dashboard, Trainers, Tools)
- ✅ **Preflop Trainer** (6 modes: RFI, 3-bet, 4-bet, cold call, squeeze, BB defense)
- ✅ **Postflop Trainer** (5 modes: c-bet, facing c-bet, turn, river, board texture)
- ✅ **Multi-Street Trainer** (Full hands from preflop → river)
- ✅ **Equity Calculator** (Hand vs hand equity)
- ✅ **Hand Replayer** (Review past sessions)
- ✅ **Range Visualizer** (13×13 interactive grid)
- ✅ **Charts Reference** (GTO charts for all positions)
- ✅ **Scenarios Library** (20+ curated situations)
- ✅ **Concepts & Theory** (Complete poker curriculum)
- ✅ **Session History** (Track progress)
- ✅ **Settings** (Dark/light theme, export/import data)

---

## 🎯 Quick Start for Users

Once deployed, users should:

1. Visit the site
2. Start with **Dashboard** to see overview
3. Try **Preflop Trainer** → Select RFI mode
4. Practice a few hands
5. Check **Session History** to see tracked progress
6. Use **Equity Calculator** to learn hand strengths
7. Review mistakes with **Hand Replayer**

---

## 📱 Mobile Support

The site is fully responsive and works on:
- ✅ Desktop (Chrome, Firefox, Safari, Edge)
- ✅ Tablet (iPad, Android tablets)
- ✅ Mobile (iPhone, Android phones)

---

## 💾 Data Persistence

All user data is stored in **localStorage**:
- Session history
- Statistics
- Settings
- Progress tracking
- Custom ranges

**Important**: Data is stored per-device/browser. Users can:
- Export data (JSON file)
- Import on another device
- Clear all data via Settings

---

## 🔒 Privacy

- **Zero backend** - everything runs client-side
- **No tracking** - no analytics or cookies
- **No account required** - completely anonymous
- **Offline capable** - works without internet after first load

---

## 📈 Next Steps

After deployment, you can:

1. **Share the link** with friends/poker community
2. **Add to README** as live demo
3. **Submit to poker forums** (2+2, Reddit r/poker)
4. **Create social media posts** with screenshots
5. **Gather feedback** from users

---

## 🎓 Marketing Your App

**Subreddits to share**:
- r/poker
- r/webdev
- r/sideproject
- r/InternetIsBeautiful

**Poker Forums**:
- TwoPlusTwo Strategy Forums
- PokerStrategy.com
- Run It Once Forums

**Product Hunt**:
- Submit as "Free GTO Poker Trainer"
- Great for exposure!

---

## ✨ Congratulations!

You now have a **production-ready**, **feature-complete** GTO poker training platform live on the internet! 🎉

