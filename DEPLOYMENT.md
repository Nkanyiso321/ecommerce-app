# Deployment Guide

## Production Deployment

This guide covers deploying the eCommerce application to production environments.

## Table of Contents
1. [Backend Deployment](#backend-deployment)
2. [Frontend Deployment](#frontend-deployment)
3. [Database Setup](#database-setup)
4. [Environment Configuration](#environment-configuration)
5. [Security Checklist](#security-checklist)
6. [Monitoring](#monitoring)
7. [Scaling](#scaling)

---

## Backend Deployment

### Option 1: Heroku

**Prerequisites:**
- Heroku CLI installed
- GitHub account connected to Heroku

**Steps:**

1. **Create Heroku app:**
   ```bash
   cd backend
   heroku create your-app-name
   heroku addons:create heroku-postgresql:hobby-dev
   ```

2. **Set environment variables:**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=$(openssl rand -hex 32)
   heroku config:set STRIPE_SECRET_KEY=sk_live_xxx
   heroku config:set OPENAI_API_KEY=sk_xxx
   ```

3. **Deploy:**
   ```bash
   git push heroku main
   ```

4. **Run migrations:**
   ```bash
   heroku run npm run migrate
   ```

### Option 2: AWS EC2

1. **Launch EC2 Instance:**
   - AMI: Ubuntu 20.04 LTS
   - Instance Type: t2.medium
   - Storage: 30GB SSD

2. **Install Node.js and PostgreSQL:**
   ```bash
   sudo apt update
   sudo apt install nodejs npm postgresql postgresql-contrib
   ```

3. **Clone and setup:**
   ```bash
   git clone your-repo
   cd backend
   npm install
   ```

4. **Configure Nginx reverse proxy:**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
       }
   }
   ```

5. **Setup PM2:**
   ```bash
   npm install -g pm2
   pm2 start src/index.js --name "ecommerce-api"
   pm2 startup
   pm2 save
   ```

### Option 3: Docker

1. **Create Dockerfile:**
   ```dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   RUN npm ci --only=production
   
   COPY . .
   
   EXPOSE 5000
   CMD ["node", "src/index.js"]
   ```

2. **Build and run:**
   ```bash
   docker build -t ecommerce-api .
   docker run -p 5000:5000 --env-file .env ecommerce-api
   ```

3. **Docker Compose:**
   ```yaml
   version: '3.8'
   
   services:
     api:
       build: .
       ports:
         - "5000:5000"
       environment:
         - DB_HOST=postgres
       depends_on:
         - postgres
   
     postgres:
       image: postgres:14
       environment:
         - POSTGRES_DB=ecommerce_db
         - POSTGRES_PASSWORD=password
       volumes:
         - postgres_data:/var/lib/postgresql/data
   
   volumes:
     postgres_data:
   ```

---

## Frontend Deployment

### Option 1: Netlify

1. **Build the app:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Connect to Netlify:**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod --dir=build
   ```

3. **Set environment variables in Netlify:**
   - Go to Site Settings → Build & Deploy → Environment
   - Add `REACT_APP_API_URL` and `REACT_APP_STRIPE_PUBLIC_KEY`

### Option 2: Vercel

1. **Deploy from Git:**
   - Push to GitHub
   - Connect repository to Vercel
   - Vercel auto-builds and deploys

2. **Set environment variables:**
   - Project Settings → Environment Variables
   - Add frontend environment variables

### Option 3: AWS S3 + CloudFront

1. **Build app:**
   ```bash
   npm run build
   ```

2. **Upload to S3:**
   ```bash
   aws s3 sync build/ s3://your-bucket-name/
   ```

3. **Create CloudFront distribution:**
   - Origin: S3 bucket
   - Default root object: index.html
   - Enable compression
   - Set cache policies

---

## Database Setup

### PostgreSQL on AWS RDS

1. **Create RDS instance:**
   - Engine: PostgreSQL 14
   - Instance class: db.t3.micro
   - Storage: 20GB
   - Enable Multi-AZ

2. **Configure security groups:**
   - Allow inbound on port 5432 from app security group

3. **Create database:**
   ```bash
   psql -h your-rds-endpoint.amazonaws.com -U postgres
   CREATE DATABASE ecommerce_db;
   ```

### PostgreSQL Backups

1. **Automated backups:**
   - RDS handles automatic backups
   - Retention period: 30 days

2. **Manual backup:**
   ```bash
   pg_dump -h host -U user -d ecommerce_db > backup.sql
   ```

3. **Restore:**
   ```bash
   psql -h host -U user -d ecommerce_db < backup.sql
   ```

---

## Environment Configuration

### Production .env for Backend

```env
# Database
DB_HOST=your-rds-endpoint.amazonaws.com
DB_PORT=5432
DB_NAME=ecommerce_db
DB_USER=postgres
DB_PASSWORD=strong_password_here

# Server
NODE_ENV=production
PORT=5000

# JWT
JWT_SECRET=generate_long_random_string_here
JWT_EXPIRE=7d

# Payment
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLIC_KEY=pk_live_xxx

# AI
OPENAI_API_KEY=sk_xxx

# Cache
REDIS_URL=redis://your-redis-endpoint:6379

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Logging
LOG_LEVEL=info

# Sentry (Error tracking)
SENTRY_DSN=your_sentry_dsn
```

### Production .env for Frontend

```env
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_STRIPE_PUBLIC_KEY=pk_live_xxx
```

---

## Security Checklist

### Backend Security

- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secret (32+ chars)
- [ ] Enable HTTPS only
- [ ] Set secure CORS headers
- [ ] Implement rate limiting
- [ ] Use helmet for security headers
- [ ] Validate all inputs
- [ ] Hash passwords with bcrypt
- [ ] Use environment variables
- [ ] Enable HTTPS/TLS
- [ ] Setup Web Application Firewall (WAF)
- [ ] Regular security audits

### Frontend Security

- [ ] Remove development tools
- [ ] Enable HTTPS
- [ ] Use Content Security Policy
- [ ] Sanitize user inputs
- [ ] Protect against XSS
- [ ] Validate CSRF tokens
- [ ] Update dependencies regularly
- [ ] No sensitive data in localStorage

### Database Security

- [ ] Use strong passwords
- [ ] Enable encryption at rest
- [ ] Enable encryption in transit
- [ ] Regular backups
- [ ] Enable audit logging
- [ ] Restrict network access
- [ ] Use IAM roles

---

## Monitoring

### Application Performance

1. **New Relic:**
   ```bash
   npm install newrelic
   ```
   Add to start of `index.js`:
   ```javascript
   require('newrelic');
   ```

2. **DataDog:**
   ```bash
   npm install dd-trace
   ```

3. **Prometheus:**
   - Scrape metrics from `/metrics`
   - Set up Grafana dashboards

### Error Tracking

1. **Sentry:**
   ```bash
   npm install @sentry/node
   ```
   ```javascript
   const Sentry = require("@sentry/node");
   Sentry.init({ dsn: process.env.SENTRY_DSN });
   ```

2. **Rollbar:**
   ```bash
   npm install rollbar
   ```

### Logging

1. **Winston:**
   ```bash
   npm install winston
   ```

2. **CloudWatch:**
   - Send logs to AWS CloudWatch
   - Set up alarms

---

## Scaling

### Horizontal Scaling

1. **Load Balancing:**
   - Use AWS ALB or Nginx
   - Route traffic across multiple instances

2. **Database Scaling:**
   - Read replicas for read-heavy operations
   - Connection pooling with PgBouncer

3. **Caching:**
   - Redis for session storage
   - CloudFront for static assets

### Vertical Scaling

- Upgrade instance type
- Increase database resources
- Increase cache memory

### Auto-scaling

1. **AWS Auto Scaling Group:**
   ```yaml
   MinSize: 2
   MaxSize: 10
   DesiredCapacity: 2
   ScaleUpThreshold: 70% CPU
   ScaleDownThreshold: 30% CPU
   ```

---

## Performance Optimization

1. **Database:**
   - Add indexes
   - Query optimization
   - Connection pooling

2. **Frontend:**
   - Code splitting
   - Lazy loading
   - Image optimization
   - Gzip compression

3. **API:**
   - Cache responses
   - Implement pagination
   - Use CDN

---

## CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Run Tests
        run: |
          cd backend
          npm install
          npm test
      
      - name: Deploy Backend
        run: git push heroku main
      
      - name: Deploy Frontend
        run: |
          cd frontend
          npm install
          npm run build
          netlify deploy --prod
```

---

## Post-Deployment

1. **Verification:**
   - Test all endpoints
   - Verify SSL certificate
   - Check database connectivity
   - Monitor error logs

2. **Monitoring Setup:**
   - Set up uptime monitoring
   - Configure alerts
   - Enable performance tracking

3. **Backups:**
   - Enable automated backups
   - Test restore procedures
   - Document backup policy

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Database connection timeout | Check security groups, verify credentials |
| High response times | Check database indexes, enable caching |
| Memory leaks | Review process logs, restart service |
| SSL certificate issues | Renew certificate, verify DNS |

---

For more information, see [README.md](./README.md) and [SETUP.md](./SETUP.md)
