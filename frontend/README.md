# Gaming Club Frontend

A modern, responsive React frontend for the Gaming Club Spring Boot + MongoDB backend. Features a gaming-themed UI with dark/light mode toggle, multi-role authentication (User/Admin), and full integration with backend APIs.

## 🚀 Features

- **Modern UI/UX**: Gaming-themed design with dark/light mode toggle
- **Multi-Role Authentication**: User and Admin roles with protected routes
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: React Query for efficient data fetching and caching
- **Type Safety**: Full TypeScript implementation
- **Form Validation**: React Hook Form with Yup validation
- **Component Library**: Reusable components with consistent styling

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** + **Bootstrap** for styling
- **React Router** for navigation
- **React Query** for server state management
- **React Hook Form** for form handling
- **Lucide React** for icons
- **Framer Motion** for animations
- **React Hot Toast** for notifications

## 📦 Installation

1. **Prerequisites**: Make sure you have Node.js (v18+) installed

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   VITE_USE_MOCK_API=false
   VITE_APP_NAME=Gaming Club
   VITE_APP_VERSION=1.0.0
   VITE_DEBUG_MODE=true
   ```

## 🚀 Development

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Open your browser** and navigate to `http://localhost:3000`

3. **Available Scripts**:
   - `npm run dev` - Start development server
   - `npm run build` - Build for production
   - `npm run preview` - Preview production build
   - `npm run lint` - Run ESLint
   - `npm run test` - Run unit tests
   - `npm run test:e2e` - Run E2E tests

## 🔐 Authentication

The app uses mock authentication for development. Demo accounts:

- **Admin Account**: Phone: `1234567890`, Role: `ADMIN`
- **User Account**: Phone: `9876543210`, Role: `USER`
- **User Account**: Phone: `5555555555`, Role: `USER`

### Switching to Real Backend Authentication

To integrate with real backend authentication:

1. Update `src/services/auth.ts` to use real API endpoints
2. Modify the authentication flow in `AuthContext`
3. Update API service to handle real JWT tokens
4. Remove mock user data and implement proper login/logout

## 🎨 Theming

The app supports both light and dark themes with a gaming aesthetic:

- **Dark Theme**: Default with neon accents (cyan, magenta, purple)
- **Light Theme**: Clean design with subtle gaming elements
- **Theme Toggle**: Persistent across sessions
- **Design Tokens**: Consistent color palette and spacing

### Customizing Themes

Edit `src/styles/index.css` to modify:
- Color variables (`--bg-primary`, `--accent-primary`, etc.)
- Component styles (`.btn-primary`, `.card`, etc.)
- Animation keyframes and effects

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Collapsible Sidebar**: Auto-collapses on mobile
- **Touch Friendly**: Large touch targets and gestures

## 🔌 API Integration

The frontend integrates with the Spring Boot backend through:

- **Base URL**: Configurable via environment variables
- **Proxy Setup**: Development proxy to avoid CORS issues
- **Error Handling**: Global error boundary and toast notifications
- **Loading States**: Skeleton loaders and spinners
- **Caching**: React Query for efficient data management

### API Endpoints Used

- **Members**: `/members` (CRUD operations)
- **Games**: `/games` (CRUD operations)
- **Products**: `/products` (CRUD operations)
- **Recharges**: `/recharges` (Create, Read by member)
- **Transactions**: `/transactions` (Create, Read by member)

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Test Coverage
- Component testing with React Testing Library
- Integration tests for API services
- E2E tests for critical user flows

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure environment variables

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout wrapper
│   ├── Navbar.tsx      # Top navigation
│   ├── Sidebar.tsx     # Side navigation
│   └── ...
├── pages/              # Page components
│   ├── DashboardPage.tsx
│   ├── GamesPage.tsx
│   ├── admin/          # Admin-specific pages
│   └── ...
├── contexts/           # React contexts
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── services/           # API services
│   ├── api.ts
│   └── auth.ts
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── styles/             # Global styles
└── hooks/              # Custom React hooks
```

## 🔧 Configuration

### Environment Variables
- `VITE_API_BASE_URL`: Backend API base URL
- `VITE_USE_MOCK_API`: Use mock API instead of real backend
- `VITE_APP_NAME`: Application name
- `VITE_DEBUG_MODE`: Enable debug logging

### Tailwind Configuration
- Custom color palette for gaming theme
- Responsive breakpoints
- Animation utilities
- Component classes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API discovery file (`api-discovery.json`)

## 🔄 Backend Integration

This frontend is designed to work with the Gaming Club Spring Boot backend. Make sure:

1. Backend is running on `http://localhost:8080`
2. MongoDB is connected and running
3. CORS is configured for frontend domain
4. All required endpoints are implemented

For backend setup, refer to the main project README.
