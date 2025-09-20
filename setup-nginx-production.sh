#!/bin/bash

# NGINX Setup script for Production Next.js Stock Management App
# Run this script on your server to configure NGINX

echo "🔧 Setting up NGINX for Production Next.js Stock Management App..."

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

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run this script as root (use sudo)"
    exit 1
fi

# Check if NGINX is installed
if ! command -v nginx &> /dev/null; then
    print_error "NGINX is not installed. Please install NGINX first:"
    echo "Ubuntu/Debian: sudo apt update && sudo apt install nginx"
    echo "CentOS/RHEL: sudo yum install nginx"
    exit 1
fi

# Create NGINX sites-available directory if it doesn't exist
mkdir -p /etc/nginx/sites-available
mkdir -p /etc/nginx/sites-enabled

# Copy NGINX configuration
print_status "Copying NGINX configuration..."
cp nginx.conf /etc/nginx/sites-available/next-mongo-stock

# Create symbolic link to enable the site
print_status "Enabling the site..."
ln -sf /etc/nginx/sites-available/next-mongo-stock /etc/nginx/sites-enabled/

# Remove default NGINX site if it exists
if [ -f /etc/nginx/sites-enabled/default ]; then
    print_status "Removing default NGINX site..."
    rm /etc/nginx/sites-enabled/default
fi

# Test NGINX configuration
print_status "Testing NGINX configuration..."
nginx -t

if [ $? -eq 0 ]; then
    print_status "✅ NGINX configuration is valid!"
    
    # Reload NGINX
    print_status "Reloading NGINX..."
    systemctl reload nginx
    
    if [ $? -eq 0 ]; then
        print_status "✅ NGINX reloaded successfully!"
        print_status "Your app is now accessible at:"
        print_status "   Main: http://20.197.21.63:3001/app/stock"
        print_status "   Products: http://20.197.21.63:3001/app/stock/product"
        print_status "   Categories: http://20.197.21.63:3001/app/stock/category"
        print_status "   Stock Management: http://20.197.21.63:3001/app/stock/stock"
    else
        print_error "Failed to reload NGINX. Please check the logs:"
        echo "sudo journalctl -u nginx -f"
    fi
else
    print_error "NGINX configuration test failed. Please check the configuration."
    exit 1
fi

# Show NGINX status
print_status "NGINX Status:"
systemctl status nginx --no-pager

print_status "🎉 NGINX setup completed!"
print_status "Configuration file: /etc/nginx/sites-available/next-mongo-stock"
print_status "Enabled site: /etc/nginx/sites-enabled/next-mongo-stock"
