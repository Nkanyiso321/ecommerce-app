# Setup Instructions

## Quick Start Guide

### Step 1: Install PostgreSQL

Download and install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/)

After installation, create a database:
```bash
createdb ecommerce_db
```

### Step 2: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your configuration
# Then start the server
npm run dev
```

Server will run at `http://localhost:5000`

### Step 3: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your API URL and Stripe key
# Then start the app
npm start
```

App will open at `http://localhost:3000`

### Step 4: Get Required API Keys

1. **OpenAI API Key**: https://platform.openai.com/api-keys
2. **Stripe Keys**: https://dashboard.stripe.com/apikeys
3. **Gmail App Password** (for email): https://myaccount.google.com/apppasswords

## API Keys Setup

### 1. Register with OpenAI
- Go to https://platform.openai.com
- Create an account
- Navigate to API Keys
- Create a new API key
- Add to `.env`: `OPENAI_API_KEY=sk_...`

### 2. Set up Stripe
- Go to https://stripe.com
- Create an account
- Navigate to API Keys section
- Copy your Secret and Public keys
- Add to `.env`:
  ```env
  STRIPE_SECRET_KEY=sk_test_...
  STRIPE_PUBLIC_KEY=pk_test_...
  ```

### 3. Configure Database
Update `.env` with your PostgreSQL credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_db
DB_USER=postgres
DB_PASSWORD=your_password
```

### 4. Generate JWT Secret
Create a random string for JWT:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add to `.env`:
```env
JWT_SECRET=your_generated_secret_here
```

## Testing the Application

### Test Auth
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"password123"}'
```

### Test Products
```bash
curl http://localhost:5000/api/products
```

### Test AI Chatbot
```bash
curl -X POST http://localhost:5000/api/ai/chatbot \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"What is your return policy?"}'
```

## Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running
- Check DB credentials in `.env`
- Ensure database exists: `createdb ecommerce_db`

### API Key Errors
- Verify API keys are valid and active
- Check `.env` file for correct key names
- Make sure keys have necessary permissions

### CORS Errors
- Backend should have CORS enabled
- Check frontend API URL in `.env`
- Verify API URL doesn't have trailing slash

### Stripe Errors
- Use test keys for development
- Ensure Stripe is configured in backend
- Check webhook configuration

## Production Deployment

### Important Notes
1. Use environment variables for sensitive data
2. Enable HTTPS in production
3. Set NODE_ENV=production
4. Use production API keys from services
5. Set up proper logging and monitoring
6. Implement rate limiting
7. Set up automated backups

### Example: Deploy to Heroku

Backend:
```bash
cd backend
heroku create ecommerce-backend
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

Frontend:
```bash
cd frontend
npm run build
# Deploy build folder to hosting service
```

## Next Steps

1. Test all features locally
2. Create sample products in database
3. Test checkout flow end-to-end
4. Set up error monitoring
5. Deploy to hosting platform
6. Set up CI/CD pipeline

## Support Resources

- [Express.js Documentation](https://expressjs.com)
- [React Documentation](https://react.dev)
- [Stripe Documentation](https://stripe.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)

## Common Commands

```bash
# Backend
npm run dev              # Start development server
npm test                 # Run tests
npm run test:watch      # Watch mode testing

# Frontend
npm start               # Start dev server
npm run build          # Build for production
npm test               # Run tests
```

---

Enjoy building with this eCommerce platform! 🚀
