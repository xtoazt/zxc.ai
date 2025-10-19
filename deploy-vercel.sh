#!/bin/bash

echo "🚀 Deploying Instant Video Generator to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please log in to Vercel:"
    vercel login
fi

echo "📦 Installing dependencies..."
npm install

echo "🏗️ Building client..."
cd client
npm install
npm run build
cd ..

echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo ""
echo "Your app is now live on Vercel!"
echo "Check your Vercel dashboard for the deployment URL."
