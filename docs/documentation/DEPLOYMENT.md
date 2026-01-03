# Deployment Guide

## Overview

This project is deployed to Cloudflare Pages, a static site hosting service that automatically deploys from GitHub.

## Prerequisites

- GitHub repository configured
- Cloudflare account with Pages enabled
- Access to repository and Cloudflare dashboard

## Deployment Setup

### 1. Cloudflare Pages Configuration

1. Log in to Cloudflare Dashboard
2. Navigate to **Pages** → **Create a project**
3. Connect your GitHub repository
4. Configure build settings:
   - **Framework preset**: None (Static Site)
   - **Build command**: (leave empty - no build step)
   - **Build output directory**: `public`
   - **Root directory**: (leave empty)

### 2. Environment Variables

If using LLM API for image generation, configure environment variables in Cloudflare Pages:

1. Go to **Settings** → **Environment variables**
2. Add variables:
   - `QWEN_API_KEY`: API key for Qwen Text2Image
   - `QWEN_URL_IMAGE`: Full endpoint URL for image generation (e.g., `https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis`)
   - `QWEN_MODEL_IMAGE`: Model to use (e.g., `qwen-image-plus`)
   - Any other required variables

**Important**: Never commit `.env` files. Use Cloudflare Pages environment variables for production secrets.

### 3. Custom Domain (Optional)

1. Go to **Custom domains** in project settings
2. Add your domain
3. Follow DNS configuration instructions
4. Cloudflare will automatically provision SSL certificate

## Deployment Process

### Automatic Deployment

Deployment is automatic on push to `main` branch:

1. Push changes to `main` branch on GitHub
2. Cloudflare Pages detects the push
3. Build process starts (no build step, files are served directly)
4. Site is deployed to production URL
5. Preview deployments created for Pull Requests

### Manual Deployment

1. Go to Cloudflare Pages dashboard
2. Select your project
3. Click **Retry deployment** for a specific commit

### Preview Deployments

- Automatically created for each Pull Request
- Preview URL provided in PR comments
- Perfect for testing changes before merge

## Build Configuration

### Output Directory

All static files must be in `public/` directory. This is the only directory deployed.

### File Structure

```
public/
├── index.html
├── css/
├── js/
├── images/
├── icons/
├── manifest.json
└── sw.js
```

## Post-Deployment

### Verification Checklist

- [ ] Site loads correctly
- [ ] All pages accessible
- [ ] CSS and JS files load
- [ ] Images display correctly
- [ ] PWA manifest works
- [ ] Service Worker registers
- [ ] HTTPS enabled (automatic)
- [ ] Custom domain works (if configured)

### Monitoring

- Check Cloudflare Pages dashboard for deployment status
- Monitor build logs for errors
- Test site functionality after deployment

## Rollback

If issues occur after deployment:

1. Go to Cloudflare Pages dashboard
2. Navigate to **Deployments**
3. Find previous working deployment
4. Click **Retry deployment** or **Create deployment**

## Production Considerations

### Performance

- Cloudflare provides global CDN automatically
- Static files cached at edge
- HTTPS enabled by default
- Compression enabled automatically

### Security Headers

Configure in Cloudflare Pages settings or via `_headers` file (if supported):

- Content-Security-Policy
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Referrer-Policy: strict-origin-when-cross-origin

### Cache Strategy

- HTML files: Short cache (browser + Cloudflare)
- CSS/JS: Long cache with versioning
- Images: Long cache
- Service Worker: Always check for updates

## Troubleshooting

### Build Failures

- Check build logs in Cloudflare dashboard
- Verify file structure matches expected output
- Ensure no syntax errors in HTML/CSS/JS

### Missing Files

- Verify files are in `public/` directory
- Check `.gitignore` doesn't exclude needed files
- Ensure files are committed to repository

### Environment Variables

- Verify variables are set in Cloudflare dashboard
- Check variable names match code expectations
- Restart deployment after adding variables

## Continuous Integration

### GitHub Actions (Optional)

You can add GitHub Actions for pre-deployment checks:

```yaml
name: Pre-deploy Checks
on:
  pull_request:
    branches: [main]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: HTML Validation
        run: # Add HTML validation
      - name: CSS Validation
        run: # Add CSS validation
```

## Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [GitHub Integration Guide](https://developers.cloudflare.com/pages/platform/git-integration/)

