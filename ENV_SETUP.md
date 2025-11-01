# 🔐 Environment Variables Setup Guide

## Required API Keys

To use the Advanced Video Generator features, you need to set up the following environment variables:

### 1. Hugging Face Token
- **Get your token**: Visit https://huggingface.co/settings/tokens
- **Create a new token** with read permissions
- **Set in Vercel**: Go to your project settings → Environment Variables → Add `HUGGING_FACE_TOKEN`

### 2. Replicate Token
- **Get your token**: Visit https://replicate.com/account/api-tokens
- **Create a new token**
- **Set in Vercel**: Go to your project settings → Environment Variables → Add `REPLICATE_TOKEN`

### 3. Pexels API Key
- **Get your API key**: Visit https://www.pexels.com/api/
- **Sign up** for a free account
- **Set in Vercel**: Go to your project settings → Environment Variables → Add `PEXELS_API_KEY`

### 4. Gemini API Key (NEW)
- **Get your API key**: Visit https://makersuite.google.com/app/apikey
- **Sign up** for Google AI Studio
- **Set in Vercel**: Go to your project settings → Environment Variables → Add `GEMINI_API_KEY`
- **Note**: Gemini enhances prompts for better video generation results

## Local Development Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your API keys in `.env`:
   ```
   HUGGING_FACE_TOKEN=your_token_here
   REPLICATE_TOKEN=your_token_here
   PEXELS_API_KEY=your_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. Restart your development server

## Vercel Deployment Setup

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - `HUGGING_FACE_TOKEN`
   - `REPLICATE_TOKEN`
   - `PEXELS_API_KEY`
   - `GEMINI_API_KEY`
4. Redeploy your application

## Security Notes

- ⚠️ **Never commit** `.env` files to Git
- ⚠️ **Never expose** API keys in client-side code
- ✅ All API keys are stored server-side only
- ✅ `.gitignore` is configured to exclude `.env` files