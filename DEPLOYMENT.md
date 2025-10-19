# Vercel Deployment Guide

This guide will help you deploy the Instant⚡ Video Generator to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Account**: Connect your GitHub account to Vercel
3. **Node.js 18+**: For local development

## Deployment Steps

### 1. Prepare Your Repository

Make sure your code is in a GitHub repository:

```bash
git init
git add .
git commit -m "Initial commit: Instant Video Generator"
git remote add origin https://github.com/yourusername/instant-video-generator.git
git push -u origin main
```

### 2. Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the settings:
   - **Framework Preset**: Create React App
   - **Root Directory**: `./` (root)
   - **Build Command**: `cd client && npm run build`
   - **Output Directory**: `client/build`

#### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name: instant-video-generator
# - Directory: ./
# - Override settings? N
```

### 3. Configure Environment Variables

In your Vercel dashboard, go to your project settings and add any environment variables if needed:

- No environment variables are required for basic functionality
- The app uses the public Instant Video API

### 4. Build Configuration

Vercel will automatically detect the build settings, but you can verify:

- **Build Command**: `cd client && npm run build`
- **Output Directory**: `client/build`
- **Install Command**: `npm install`

### 5. API Routes Configuration

The app includes these API routes:
- `/api/health` - Health check
- `/api/options` - Get available models
- `/api/generate-video` - Text to video generation
- `/api/generate-video-with-image` - Image + text to video

### 6. Function Configuration

Vercel will automatically handle the serverless functions. The `vercel.json` file configures:
- Maximum execution time: 300 seconds (5 minutes)
- CORS headers for API routes
- Proper routing for SPA

## Local Development

To test the Vercel configuration locally:

```bash
# Install Vercel CLI
npm i -g vercel

# Run locally with Vercel
vercel dev
```

This will start the app at `http://localhost:3000` with Vercel's serverless functions.

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check that all dependencies are in `package.json`
   - Ensure Node.js version is 18+
   - Verify build command is correct

2. **API Route Issues**:
   - Check that API files are in `/api` directory
   - Verify CORS headers are set
   - Check function timeout settings

3. **Static File Issues**:
   - Ensure `homepage: "."` in client package.json
   - Check that build output is in correct directory

### Performance Optimization

1. **Image Processing**: Sharp is optimized for Vercel's serverless environment
2. **File Uploads**: 10MB limit with automatic cleanup
3. **API Timeouts**: Set to 5 minutes for video generation

## Environment-Specific Settings

### Development
- API calls use relative paths (`/api/...`)
- CORS enabled for all origins
- Detailed error logging

### Production
- Same API structure
- Optimized for serverless execution
- Automatic scaling

## Monitoring

Vercel provides built-in monitoring:
- Function execution times
- Error rates
- API usage
- Build logs

## Custom Domain

To add a custom domain:
1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your domain
4. Configure DNS settings as instructed

## Updates and Redeployment

Every push to your main branch will trigger automatic deployment:

```bash
git add .
git commit -m "Update video generator"
git push origin main
```

Vercel will automatically build and deploy the changes.

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **React on Vercel**: [vercel.com/guides/deploying-reactjs-apps-with-vercel](https://vercel.com/guides/deploying-reactjs-apps-with-vercel)
- **Serverless Functions**: [vercel.com/docs/functions](https://vercel.com/docs/functions)
