# CSI NMAMIT Website v2.0

A modern, feature-rich website for the Computer Society of India - NMAMIT Student Branch, built with React, Vite, and Tailwind CSS.

## 🚀 Features

### ✨ Modern Design
- **Glassmorphism Effects**: Beautiful glass-like UI components
- **Gradient Animations**: Smooth, eye-catching gradient transitions
- **Dark/Light Mode**: Seamless theme switching
- **Responsive Design**: Mobile-first approach for all devices
- **Micro-interactions**: Subtle animations for better UX
- **Parallax Effects**: 3D card effects and scroll animations

### 🎯 Core Functionality
- **Authentication**: Google Sign-in with Firebase Auth
- **User Profiles**: Complete profile management system
- **Event Management**: Browse and register for events
- **Team Showcase**: Faculty and student team display
- **Membership System**: Online registration with payment integration
- **Payment Gateway**: Razorpay integration for membership fees
- **Certificate Generation**: Download membership certificates

### 🛠️ Technical Stack
- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS with custom animations
- **Icons**: Lucide React (replaced all emojis)
- **Animations**: Framer Motion
- **3D Effects**: React Parallax Tilt
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **Payments**: Razorpay

## 📦 Installation

1. **Clone the repository**
```bash
cd website-version-2
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=your-razorpay-key
VITE_RAZORPAY_KEY_SECRET=your-razorpay-secret

# API Configuration
VITE_API_URL=http://localhost:3000/api
```

4. **Run the development server**
```bash
npm run dev
```

5. **Build for production**
```bash
npm run build
```

## 🎨 Design Improvements

### Color Scheme
- **Primary**: Blue (#3b82f6)
- **Cyber Blue**: #00d4ff
- **Cyber Purple**: #a855f7
- **Cyber Pink**: #ec4899
- **Gradients**: Smooth transitions between colors

### Typography
- **Display Font**: Orbitron (futuristic headers)
- **Body Font**: Inter (clean, readable)
- **Mono Font**: JetBrains Mono (code blocks)

### Components
- Glass-morphic cards with backdrop blur
- Neon glow effects on hover
- Animated gradient backgrounds
- Particle.js interactive background
- Smooth page transitions
- Loading skeletons for better UX

## 📱 Pages

1. **Home**: Hero section, About, Features, Highlights, Testimonials, CTA
2. **Events**: Event listing with filters, search, and categories
3. **Team**: Faculty and student team with modal views
4. **Profile**: User dashboard with membership status
5. **Recruit**: Membership registration with payment
6. **404**: Custom not found page

## 🔧 Key Components

### Layout
- `Navbar`: Modern navigation with glassmorphism
- `Footer`: Comprehensive footer with newsletter
- `ScrollToTop`: Smooth scroll to top button
- `ParticlesBackground`: Interactive particle animation

### Home Components
- `Hero`: Animated hero with typing effect
- `About`: 3D card effects with tilt
- `Features`: Technology showcase grid
- `Highlights`: Image gallery with lightbox
- `Testimonials`: Carousel with animations
- `CTA`: Call-to-action with gradient background

### UI Components
- Glass cards with blur effects
- Animated buttons with hover states
- Custom input fields with icons
- Loading states and skeletons
- Toast notifications

## 🔐 Security

- Firebase Authentication for secure sign-in
- Protected routes for authenticated users
- Secure payment processing with Razorpay
- Environment variables for sensitive data
- Input validation and sanitization

## 🚀 Performance

- Vite for fast development and optimized builds
- Lazy loading for images and components
- Code splitting for better load times
- Optimized animations with Framer Motion
- Responsive images with proper sizing

## 📈 Future Enhancements

- [ ] PWA support for offline access
- [ ] Push notifications for events
- [ ] Advanced search and filters
- [ ] Social media integration
- [ ] Blog/News section
- [ ] Forum for discussions
- [ ] Project showcase gallery
- [ ] Alumni network
- [ ] Job board
- [ ] Resource library

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👥 Credits

Developed by the CSI NMAMIT Tech Team with ❤️

---

**Note**: This is version 2.0 of the CSI NMAMIT website, featuring a complete redesign with modern technologies and enhanced user experience.
