# thiCodeAI React Frontend Project Guide

## Overview

The frontend is built with React and uses Zustand for state management. It provides a modern chat interface with real-time updates and loading states.

### Key Features
- User authentication flow
- Real-time chat interface
- Conversation management
- Typing indicators for AI responses
- Dark mode support

### Important Notes
- The project uses `react-router` instead of `react-router-dom`
- All code (comments, variables, etc.) should be in English
- The UI supports both light and dark themes

## Project Structure

```
thiCodeReact/
├── .env                    # Environment variables
├── .gitignore             # Git ignore rules
├── index.html             # Entry HTML file
├── package.json           # Project dependencies and scripts
├── vite.config.js         # Vite configuration
├── eslint.config.js       # ESLint configuration
│
├── src/                   # Source code
│   ├── assets/           # Static assets (images, fonts)
│   ├── components/       # Reusable React components
│   │   ├── auth/        # Authentication components
│   │   ├── chat/        # Chat interface components
│   │   ├── layout/      # Layout components
│   │   └── ui/          # UI components
│   │
│   ├── contexts/        # React context providers
│   │   ├── AuthContext.jsx    # Authentication context
│   │   └── ThemeContext.jsx   # Theme management
│   │
│   ├── lib/             # Utilities and services
│   │   ├── api.js       # API client configuration
│   │   └── store.js     # State management
│   │
│   ├── pages/           # Application pages
│   │   ├── Chat.jsx     # Chat interface
│   │   ├── Home.jsx     # Landing page
│   │   ├── Login.jsx    # Authentication pages
│   │   └── ...          # Other pages
│   │
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles
│
└── public/              # Public static files
```

## Key Technologies

- **React 19.0.0**: Core UI library
- **Vite 6.2.0**: Build tool and development server
- **React Router 7.5.0**: Client-side routing
- **TailwindCSS 4.1.3**: Utility-first CSS framework
- **@tanstack/react-query**: Data fetching and caching
- **Axios**: HTTP client
- **Zustand**: State management
- **Framer Motion**: Animations
- **React Markdown**: Markdown rendering

## Core Components

### Authentication System

The authentication system is built around the `AuthContext` provider, which manages:
- User authentication state
- Login/Register functionality
- Password reset flow
- Token management
- Protected route handling

### Chat Interface

The chat system consists of several components:
- Conversation management
- Message history
- Real-time message updates
- AI response handling
- Markdown message rendering

### Theme System

The application includes a theme system (`ThemeContext`) that provides:
- Light/Dark mode switching
- Persistent theme preferences
- Dynamic styling

## State Management

### Chat Store (chatStore.js)

Manages all chat-related state using Zustand:

```javascript
const useChatStore = create((set, get) => ({
  // State
  conversations: [],
  messages: [],
  isLoading: false,
  isTyping: false,
  error: null,

  // Actions
  sendMessage: async (conversationId, message) => {
    set({ isTyping: true })
    // Send message and handle response...
  },

  checkMessageStatus: async (conversationId, messageId) => {
    // Poll for message status...
  }
}))
```

### Message Flow

1. User sends a message:
   - Message is immediately displayed
   - Typing indicator appears
   - Backend is called asynchronously

2. Backend processing:
   - Frontend polls status endpoint
   - Typing indicator remains until response
   - AI response is displayed when ready

3. Error handling:
   - Network errors show error message
   - Retry mechanism for failed requests
   - Clear error state on new actions

The application uses a combination of state management solutions:
- **Zustand**: For global application state
- **React Query**: For server state and data fetching
- **Context API**: For theme and authentication state

## API Integration

The `api.js` module provides:
- Configured Axios instance
- API endpoint definitions
- Request/response interceptors
- Error handling
- Authentication header management

## Routing Structure

```javascript
<Router>
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password/:token" element={<ResetPassword />} />
      
      {/* Documentation and Legal */}
      <Route path="documentation" element={<Documentation />} />
      <Route path="conditions" element={<TermsOfService />} />
      <Route path="confidentialite" element={<PrivacyPolicy />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="chat" element={<Chat />} />
        <Route path="chat/:conversationId" element={<Chat />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Route>
  </Routes>
</Router>
```

## Development Workflow

1. **Local Development**
   ```bash
   npm run dev    # Start development server
   npm run lint   # Run ESLint
   ```

2. **Building for Production**
   ```bash
   npm run build    # Create production build
   npm run preview  # Preview production build
   ```

## Best Practices

1. **Component Organization**
   - Functional components with hooks
   - Component-specific styles with Tailwind
   - Proper prop-types usage
   - Meaningful component file structure

2. **State Management**
   - Use Zustand for global state
   - React Query for server state
   - Local state for component-specific data
   - Context for theme and auth

3. **Performance**
   - Lazy loading of routes
   - Proper use of React.memo
   - Optimized re-renders
   - Efficient data fetching with React Query

4. **Security**
   - Protected routes implementation
   - Secure token handling
   - XSS prevention
   - CSRF protection

## Environment Configuration

The application uses environment variables for configuration:
```env
VITE_API_URL=http://localhost:8000
VITE_WEBSOCKET_URL=ws://localhost:8000
VITE_ENV=development
```

## Error Handling

The application implements comprehensive error handling:
- API error interceptors
- Global error boundaries
- Form validation errors
- Network error handling
- Friendly error messages

## Styling Guidelines

The project uses TailwindCSS with:
- Consistent color palette
- Responsive design patterns
- Dark mode support
- Custom utility classes
- Component-specific styles

## Testing

The project supports:
- Unit testing with Jest
- Component testing with React Testing Library
- E2E testing capability
- API mocking
