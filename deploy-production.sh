#!/bin/bash

# Production Deployment Script for Next.js Stock Management App
# This script builds and deploys the app to production

echo "🚀 Deploying Next.js Stock Management App to Production..."

# Server configuration
SERVER_IP="20.197.21.63"
SERVER_USER="root"
SERVER_PATH="/var/www/next-mongo-stock"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Step 1: Build the application
print_status "Step 1: Building Next.js application for production..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Build failed. Please check the errors above."
    exit 1
fi

# Step 2: Create production environment file
print_status "Step 2: Creating production environment file..."
cat > .env.production << EOF
NODE_ENV=production
PORT=3001
NEXT_PUBLIC_API_URL=http://20.197.21.63:3001
MONGODB_URI=\${MONGODB_URI}
EOF

# Step 3: Create deployment package
print_status "Step 3: Creating deployment package..."
tar -czf next-mongo-stock-production.tar.gz \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=.next/cache \
    --exclude=*.log \
    --exclude=.env.local \
    --exclude=.env.development.local \
    --exclude=.env.test.local \
    --exclude=.env.production.local \
    .

# Step 4: Upload to server
print_status "Step 4: Uploading to server..."
echo "Uploading package to server..."
scp next-mongo-stock-production.tar.gz ${SERVER_USER}@${SERVER_IP}:/tmp/

if [ $? -ne 0 ]; then
    print_error "Failed to upload to server. Please check your SSH connection."
    exit 1
fi

# Step 5: Deploy on server
print_status "Step 5: Deploying on server..."
ssh ${SERVER_USER}@${SERVER_IP} << 'EOF'
    # Create application directory
    mkdir -p /var/www/next-mongo-stock
    mkdir -p /var/www/next-mongo-stock/logs
    
    # Extract application
    cd /var/www/next-mongo-stock
    tar -xzf /tmp/next-mongo-stock-production.tar.gz
    
    # Install dependencies
    npm install --production
    
    # Install PM2 globally if not installed
    if ! command -v pm2 &> /dev/null; then
        npm install -g pm2
    fi
    
    # Stop existing PM2 process
    pm2 stop next-mongo-stock 2>/dev/null || true
    pm2 delete next-mongo-stock 2>/dev/null || true
    
    # Start application
    pm2 start ecosystem.config.js
    
    # Save PM2 configuration
    pm2 save
    
    # Setup PM2 startup
    pm2 startup
    
    # Clean up
    rm /tmp/next-mongo-stock-production.tar.gz
    
    echo "✅ Production deployment completed on server!"
    echo "App is running on: http://20.197.21.63:3001/app/stock"
    echo "Products: http://20.197.21.63:3001/app/stock/product"
    echo "Categories: http://20.197.21.63:3001/app/stock/category"
    echo "Stock Management: http://20.197.21.63:3001/app/stock/stock"
EOF

if [ $? -eq 0 ]; then
    print_status "✅ Successfully deployed to production!"
    print_status "🎉 Your app is now live at:"
    print_status "   Main: http://20.197.21.63:3001/app/stock"
    print_status "   Products: http://20.197.21.63:3001/app/stock/product"
    print_status "   Categories: http://20.197.21.63:3001/app/stock/category"
    print_status "   Stock Management: http://20.197.21.63:3001/app/stock/stock"
    
    # Clean up local files
    rm next-mongo-stock-production.tar.gz
    rm .env.production
    
    print_status "🎉 Production deployment completed successfully!"
else
    print_error "Failed to deploy on server."
    exit 1
fi
