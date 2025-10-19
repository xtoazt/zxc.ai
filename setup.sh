#!/bin/bash

echo "🚀 Setting up Instant Video Generator..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install
cd ..

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install
cd ..

echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "1. Start the backend: cd server && npm run dev"
echo "2. Start the frontend: cd client && npm start"
echo "3. Or run both: npm run dev"
echo ""
echo "The app will be available at:"
echo "- Frontend: http://localhost:3000"
echo "- Backend: http://localhost:5000"
