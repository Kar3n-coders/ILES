import React from "react";
import LoginForm from "../components/auth/LoginForm";

function LoginPage() {
  return (
    <main className="login-page">
      <div className="login-container">
        <h1>ILES - Internship, Logging & Evaluation System</h1>
        <p className="login-subtitle">Sign in to your account</p>
        <LoginForm />
      </div>
    </main>
  );
}

export default LoginPage;
