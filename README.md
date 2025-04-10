# ThiCodeAI - React user interface

Modern user interface for ThiCodeAI, an intelligent assistant for web development that uses advanced AI models to generate code, analyze accessibility and process mock-ups.

## 🚀 Features

- Intuitive user interface with responsive design
- Light/dark theme and user preferences
- Real-time conversations with typing animations
- User management (authentication, profiles)
- Conversation history
- Support for different AI models

## 🛠️ Technologies

- **Framework** : React 19 with Vite
- **Styles** : Tailwind CSS v4
- **Router** : React Router v7
- **State** : Zustand
- **API requests** : Axios, React Query
- **Animations** : Framer Motion
- **UI** : Custom components with theme support

## 📋 Prerequisites

- Node.js 18.0 or higher
- npm 9.0 or higher

## 🔧 Installation

1. Clone repository

```bash
git clone https://github.com/ThibaultG94/thicodeAI-web.git
cd thicodeAI-web
```

2. Install dependencies

```bash
npm install
```

3. Configure environment variables

Create a `.env.local` file at the root of the project and add the necessary variables:

```
VITE_API_URL=http://localhost:8000
VITE_APP_ENV=development
```

4. Start development server

```bash
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173).

## 🚀 Deployment

To create a production version :

```bash
npm run build
```

Optimized files will be generated in the `dist` folder.

## 📝 Project structure

```
src/
├── components/           # Reusable components
│   ├── auth/             # Authentication components
│   ├── chat/             # Chat interface components
│   ├── layout/           # Page layout components
│   └── ui/               # User interface components
├── contexts/             # React contexts
├── lib/                  # Utilities and services
├── pages/                # Main pages
└── App.jsx               # Application entry point
```

## 🔄 Backend integration

This application is designed to work with the ThiCodeAI API built with Django. See the [main repository](https://github.com/ThibaultG94/thicodeAi) for more information on backend configuration.

## 📄 License

This project is licensed under the MIT license. See the LICENSE file for more details.
