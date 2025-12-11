# Propmediate - VPS Deployment Guide

This guide will help you deploy the Propmediate application to your VPS server with MongoDB.

## Prerequisites

- VPS server with Ubuntu 20.04+ or similar Linux distribution
- Root or sudo access
- Domain name pointed to your VPS IP address
- Basic knowledge of Linux command line

## Step 1: Server Setup

### Update System Packages

\`\`\`bash
sudo apt update
sudo apt upgrade -y
\`\`\`

### Install Node.js (v18 or higher)

\`\`\`bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Verify installation
\`\`\`

### Install MongoDB

\`\`\`bash
# Import MongoDB public GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install MongoDB
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod
sudo systemctl status mongod
\`\`\`

### Install PM2 (Process Manager)

\`\`\`bash
sudo npm install -g pm2
\`\`\`

### Install Nginx

\`\`\`bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
\`\`\`

## Step 2: Application Deployment

### Clone or Upload Your Application

\`\`\`bash
# Create application directory
sudo mkdir -p /var/www/propmediate
cd /var/www/propmediate

# Upload your application files here
# You can use scp, rsync, or git clone
\`\`\`

### Configure Environment Variables

\`\`\`bash
# Create .env file
nano .env
\`\`\`

Add the following content:

\`\`\`env
MONGODB_URI=mongodb://localhost:27017/propmediate
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3000
NODE_ENV=production
\`\`\`

### Install Dependencies and Build

\`\`\`bash
npm install
npm run build
\`\`\`

### Seed the Database

\`\`\`bash
npm run seed
\`\`\`

This will create:
- Default admin user (admin@propmediate.com / password123)
- Sample properties
- Sample agents
- Site settings

### Start Application with PM2

\`\`\`bash
pm2 start npm --name "propmediate" -- start
pm2 save
pm2 startup
\`\`\`

## Step 3: Configure Nginx

### Create Nginx Configuration

\`\`\`bash
sudo nano /etc/nginx/sites-available/propmediate
\`\`\`

Add the following configuration:

\`\`\`nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
\`\`\`

### Enable the Site

\`\`\`bash
sudo ln -s /etc/nginx/sites-available/propmediate /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
\`\`\`

## Step 4: SSL Certificate (Optional but Recommended)

### Install Certbot

\`\`\`bash
sudo apt install -y certbot python3-certbot-nginx
\`\`\`

### Obtain SSL Certificate

\`\`\`bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
\`\`\`

Follow the prompts to complete the SSL setup.

## Step 5: MongoDB Security (Production)

### Create MongoDB Admin User

\`\`\`bash
mongosh
\`\`\`

In MongoDB shell:

\`\`\`javascript
use admin
db.createUser({
  user: "admin",
  pwd: "your-strong-password",
  roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
})

use bnrhomes
db.createUser({
  user: "bnrhomes_user",
  pwd: "your-strong-password",
  roles: [ { role: "readWrite", db: "bnrhomes" } ]
})
exit
\`\`\`

### Enable MongoDB Authentication

\`\`\`bash
sudo nano /etc/mongod.conf
\`\`\`

Add or modify:

\`\`\`yaml
security:
  authorization: enabled
\`\`\`

Restart MongoDB:

\`\`\`bash
sudo systemctl restart mongod
\`\`\`

### Update Connection String

Update your `.env` file:

\`\`\`env
MONGODB_URI=mongodb+srv://bnrhomes_db_user:Bnr123@bnrhomes.pg7pjqw.mongodb.net/?appName=bnrhomes
\`\`\`

Restart the application:

\`\`\`bash
pm2 restart propmediate
\`\`\`

## Maintenance Commands

### View Application Logs

\`\`\`bash
pm2 logs propmediate
\`\`\`

### Restart Application

\`\`\`bash
pm2 restart propmediate
\`\`\`

### Stop Application

\`\`\`bash
pm2 stop propmediate
\`\`\`

### Monitor Application

\`\`\`bash
pm2 monit
\`\`\`

### Update Application

\`\`\`bash
cd /var/www/propmediate
git pull  # or upload new files
npm install
npm run build
pm2 restart propmediate
\`\`\`

## Backup MongoDB

### Create Backup Script

\`\`\`bash
sudo nano /usr/local/bin/backup-mongodb.sh
\`\`\`

Add:

\`\`\`bash
#!/bin/bash
BACKUP_DIR="/var/backups/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
mongodump --out $BACKUP_DIR/backup_$DATE
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} +
\`\`\`

Make executable:

\`\`\`bash
sudo chmod +x /usr/local/bin/backup-mongodb.sh
\`\`\`

### Schedule Daily Backups

\`\`\`bash
sudo crontab -e
\`\`\`

Add:

\`\`\`
0 2 * * * /usr/local/bin/backup-mongodb.sh
\`\`\`

## Troubleshooting

### Check Application Status

\`\`\`bash
pm2 status
pm2 logs propmediate --lines 100
\`\`\`

### Check MongoDB Status

\`\`\`bash
sudo systemctl status mongod
mongosh --eval "db.adminCommand('ping')"
\`\`\`

### Check Nginx Status

\`\`\`bash
sudo systemctl status nginx
sudo nginx -t
\`\`\`

### Check Firewall

\`\`\`bash
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
\`\`\`

## Default Credentials

After seeding the database, you can login with:

- **Email:** admin@propmediate.com
- **Password:** password123

**Important:** Change the default password immediately after first login!

## Support

For issues or questions, please refer to the main README.md or contact support.
