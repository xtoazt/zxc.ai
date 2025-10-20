#!/bin/bash

echo "🚀 zxc.ai Deployment Script"
echo "=========================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf build/
rm -rf node_modules/.vite/

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ -d "build" ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Build directory contents:"
    ls -la build/
    echo ""
    echo "🚀 Deploying to Vercel..."
    vercel --prod
else
    echo "❌ Build failed!"
    exit 1
fi