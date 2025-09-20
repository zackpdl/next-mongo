#!/bin/bash

# Deployment script for Next.js Stock Management App
# Run this script to deploy the application

echo "🚀 Starting deployment of Next.js Stock Management App..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    print_error "PM2 is not installed. Please install PM2 first:"
    echo "npm install -g pm2"
    exit 1
fi

# Check if NGINX is installed
if ! command -v nginx &> /dev/null; then
    print_warning "NGINX is not installed. Please install NGINX first."
fi

# Build the Next.js application
print_status "Building Next.js application..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Build failed. Please check the errors above."
    exit 1
fi

# Stop existing PM2 process if running
print_status "Stopping existing PM2 processes..."
pm2 stop next-mongo-stock 2>/dev/null || true
pm2 delete next-mongo-stock 2>/dev/null || true

# Start the application with PM2
print_status "Starting application with PM2..."
pm2 start ecosystem.config.js

if [ $? -eq 0 ]; then
    print_status "✅ Application started successfully!"
    print_status "App is running on: http://20.197.21.63:3001/app/stock"
    
    # Show PM2 status
    print_status "PM2 Status:"
    pm2 status
    
    # Save PM2 configuration
    print_status "Saving PM2 configuration..."
    pm2 save
    
    # Setup PM2 startup script
    print_status "Setting up PM2 startup script..."
    pm2 startup
    
    print_status "🎉 Deployment completed successfully!"
    print_status "Your app should be accessible at: http://20.197.21.63:3001/app/stock"
else
    print_error "Failed to start the application with PM2."
    exit 1
fi
