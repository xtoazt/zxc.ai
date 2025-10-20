#!/bin/bash

echo "🚀 zxc.ai Vercel Deployment with Login"
echo "====================================="

# Check if build exists
if [ ! -d "build" ]; then
    echo "🔨 Building project first..."
    npm run build
fi

echo "📦 Login to Vercel (this will open a browser)..."
npx vercel login

echo "🚀 Deploying to Vercel..."
npx vercel --prod --yes

echo "✅ Deployment complete!"
