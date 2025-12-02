<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1T0arqfnaYw9Onab46-AWia89l4BLYgr1

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## GitHub Pages Deployment

This app is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

**Live URL:** https://ddsoftMario.github.io/NUL-FLOW/

### How it works

- A GitHub Actions workflow (`.github/workflows/deploy.yml`) builds the app on every push to `main`
- The built `dist/` folder is deployed to the `gh-pages` branch using `peaceiris/actions-gh-pages`
- A `.nojekyll` file is added to ensure GitHub Pages serves files/folders starting with underscores correctly

### Manual Deployment

To build the app manually:
```bash
npm ci
npm run build
```

The production build will be in the `dist/` folder.
