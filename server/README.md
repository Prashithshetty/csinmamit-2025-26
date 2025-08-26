# CSI NMAMIT Backend Server

## Important Security Notes

This backend server is **REQUIRED** for production deployment to handle:
- Payment verification (Razorpay signature verification)
- Secure API key management
- Database write operations for sensitive data
- User authentication and authorization
- Rate limiting and DDoS protection

## Setup Instructions

1. **Install Dependencies**
```bash
cd server
npm install
```

2. **Environment Variables**
Create a `.env` file in the server directory:
```env
# Server Configuration
PORT=3001
NODE_ENV=production

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="your_private_key"
FIREBASE_CLIENT_EMAIL=your_client_email

# Razorpay (NEVER expose these in frontend)
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Database
DATABASE_URL=your_database_url

# Security
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=https://your-domain.com
```

3. **Run the Server**
```bash
# Development
npm run dev

# Production
npm start
```

## Security Features Implemented

### 1. Payment Security
- Server-side payment verification
- Signature validation
- Amount tampering prevention
- Transaction logging

### 2. API Security
- Rate limiting (100 requests per 15 minutes)
- CORS configuration
- Helmet.js for security headers
- Input validation and sanitization
- SQL injection prevention
- XSS protection

### 3. Authentication
- Firebase Admin SDK integration
- JWT token verification
- Session management
- Role-based access control

### 4. Data Protection
- Environment variable management
- Encrypted sensitive data
- Secure database queries
- Audit logging

## API Endpoints

### Payment Endpoints
- `POST /api/create-order` - Create Razorpay order
- `POST /api/verify-payment` - Verify payment signature
- `POST /api/webhook/razorpay` - Handle Razorpay webhooks

### User Endpoints
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `POST /api/user/membership` - Update membership status

### Admin Endpoints
- `GET /api/admin/users` - List all users (admin only)
- `GET /api/admin/payments` - List all payments (admin only)
- `POST /api/admin/verify-member` - Verify member manually

## Deployment

### Using Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts
4. Set environment variables in Vercel dashboard

### Using Heroku
1. Create Heroku app: `heroku create csi-nmamit-api`
2. Set environment variables: `heroku config:set KEY=value`
3. Deploy: `git push heroku main`

### Using Railway
1. Connect GitHub repository
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

## Security Checklist

- [ ] All API keys in environment variables
- [ ] HTTPS enabled
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak sensitive info
- [ ] Logging configured (but not logging sensitive data)
- [ ] Regular security updates for dependencies
- [ ] Firestore security rules deployed
- [ ] Payment webhook endpoint secured
- [ ] Admin routes protected
- [ ] Database backups configured

## Monitoring

- Use services like Sentry for error tracking
- Set up alerts for failed payments
- Monitor rate limit violations
- Track API response times
- Set up uptime monitoring

## Support

For security issues, please email: security@csi-nmamit.com
Do NOT create public issues for security vulnerabilities.
