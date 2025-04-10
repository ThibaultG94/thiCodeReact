import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
// import ProtectedRoute from "./components/auth/ProtectedRoute";
import Layout from "./components/layout/Layout";
// import Home from "./pages/Home";
// import Chat from "./pages/Chat";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Settings from "./pages/Settings";
// import NotFound from "./pages/NotFound";
import { useState } from "react";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
