#!/bin/bash

echo "🌐 Static Deployment for zxc.ai"
echo "==============================="

# Clean and build
echo "🧹 Cleaning and building..."
rm -rf build/
npm run build

# Create a simple static server setup
echo "📁 Creating static deployment files..."

# Create a simple index.html redirect for SPA
cat > build/_redirects << EOF
/*    /index.html   200
EOF

# Create netlify.toml for Netlify deployment
cat > netlify.toml << EOF
[build]
  publish = "build"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
EOF

echo "✅ Static deployment files created!"
echo ""
echo "🚀 Deployment Options:"
echo "1. Netlify: Drag and drop the 'build' folder to netlify.com"
echo "2. GitHub Pages: Push to GitHub and enable Pages"
echo "3. Vercel: Use 'vercel --prod' command"
echo "4. Any static hosting: Upload 'build' folder contents"
