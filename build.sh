#!/bin/bash

echo "🚀 Building Impostor App for production..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the app
echo "🔨 Building the app..."
npm run build

echo "✅ Build completed!"
echo "📁 Build files are in the 'build' directory"
echo "🌐 You can now deploy the 'build' folder to any static hosting service"
