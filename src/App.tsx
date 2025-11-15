import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom"; 
import LoginPage from "./pages/LoginPage"; 
import SignupPage from "./pages/SignupPage"; 
import TodoListPage from "./pages/TodoListPage"; 
import ForgotPasswordPage from "./pages/ForgotPasswordPage"; // NEW PAGE
import ResetPasswordPage from "./pages/ResetPasswordPage"; // NEW PAGE
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; 

const queryClient = new QueryClient(); 

const App: React.FC = () => {
  return (
    // Wrap entire application in the React Query client provider
    <QueryClientProvider client={queryClient}> 
      <div className="App">
        <span className="heading">Task Todo</span>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

          {/* Protected Route (Automatically redirects inside TodoListPage if unauthenticated) */}
          <Route path="/" element={<TodoListPage />} /> 
        </Routes>
      </div>
    </QueryClientProvider>
  );
};

export default App;