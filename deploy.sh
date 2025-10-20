#!/bin/bash

echo "🚀 Starting zxc.ai deployment process..."

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
else
    echo "❌ Build failed!"
    exit 1
fi

echo "🎉 Ready for deployment!"
