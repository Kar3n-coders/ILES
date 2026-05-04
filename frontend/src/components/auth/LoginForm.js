import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { loginUser } from "../../services/api";
import { USER_ROLES } from "../../context/AuthContext";
import "./LoginForm.css";

const PASSWORD_RULES = {
  minLength: 8,
  maxLength: 16,
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasDigit: /[0-9]/,
  hasSpecialChar: /[!@#$%^&*()\-_=+[\]{}|;:'",.<>?/`~]/,
};

function validatePassword(password) {
  return {
    minLength: password.length >= PASSWORD_RULES.minLength,
    maxLength: password.length <= PASSWORD_RULES.maxLength,
    hasUppercase: PASSWORD_RULES.hasUppercase.test(password),
    hasLowercase: PASSWORD_RULES.hasLowercase.test(password),
    hasDigit: PASSWORD_RULES.hasDigit.test(password),
    hasSpecialChar: PASSWORD_RULES.hasSpecialChar.test(password),
  };
}


function getDashboardRoute(role) {
  const routeMap = {
    [USER_ROLES.STUDENT]: "/student/dashboard",
    [USER_ROLES.WORKPLACE_SUPERVISOR]: "/supervisor/dashboard",
    [USER_ROLES.ACADEMIC_SUPERVISOR]: "/supervisor/dashboard",
    [USER_ROLES.ADMIN]: "/admin",
  };
  
  return routeMap[role] ?? "/";
}

function LoginForm({ prefill = { username: "", password: "" } }) {
  const [username, setUsername] = useState(prefill.username || "");
  const [password, setPassword] = useState(prefill.password || "");

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPasswordHints, setShowPasswordHints] = useState(false);

  useEffect(() => {
    if (prefill.username) setUsername(prefill.username);
    if (prefill.password) setPassword(prefill.password);
  }, [prefill]);

  const { login } = useAuth();
  const navigate = useNavigate();

  const passwordValidation = validatePassword(password);
  const formIsValid = username.trim().length > 0 && password.length > 0;

  function handleUsernameChange(event) {
    setUsername(event.target.value);
    if (apiError) setApiError("");
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
    if (apiError) setApiError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!formIsValid || isSubmitting) return;
    setIsSubmitting(true);
    setApiError("");

    try {
      const { user: userData, token } = await loginUser({
        username: username.trim(),
        password,
      });

      login({ user: userData, token });
      navigate(getDashboardRoute(userData.role));
    } catch (error) {
      setApiError(
        error.message || "Login failed. Please check your credentials.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="login-form"
      onSubmit={handleSubmit}
      noValidate
      aria-label="Sign in to ILES"
    >
      <h2 className="login-form__title">Sign In</h2>
      {apiError && (
        <div
          className="login-form__api-Error"
          role="alert"
          aria-live="assertive"
        >
          {apiError}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="username" className="form-label">
          Username
        </label>
        <input
          id="username"
          type="text"
          className="form-input"
          value={username}
          onChange={handleUsernameChange}
          autoComplete="username"
          autoFocus
          required
          aria-required="true"
          disabled={isSubmitting}
          placeholder="Enter your university username"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <div className="password-input-wrapper">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            className="form-input"
            value={password}
            onChange={handlePasswordChange}
            onFocus={() => setShowPasswordHints(true)}
            autoComplete="current-password"
            required
            aria-required="true"
            disabled={isSubmitting}
            aria-describedby="password-requirements"
            minLength={PASSWORD_RULES.minLength}
            maxLength={PASSWORD_RULES.maxLength}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {showPasswordHints && (
          <ul
            id="password-requirements"
            className="password-requirements"
            aria-label="Password requirements"
          >
            <PasswordRule
              satisfied={
                passwordValidation.minLength && passwordValidation.maxLength
              }
              label="8-16 characters"
            />
            <PasswordRule
              satisfied={passwordValidation.hasUppercase}
              label="At least one uppercase letter (A-Z)"
            />
            <PasswordRule
              satisfied={passwordValidation.hasLowercase}
              label="At least one lowercase letter (a-z)"
            />
            <PasswordRule
              satisfied={passwordValidation.hasDigit}
              label="At least one number (0-9)"
            />
            <PasswordRule
              satisfied={passwordValidation.hasSpecialChar}
              label="At least one special character (!@#$%...)"
            />
          </ul>
        )}
      </div>

      <button
        type="submit"
        className="btn btn--primary btn--full-width"
        disabled={!formIsValid || isSubmitting}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}

function PasswordRule({ satisfied, label }) {
  return (
    <li
      className={`password-rule ${satisfied ? "password-rule--satisfied" : ""}`}
      aria-label={`${label}: ${satisfied ? "met" : "not met"}`}
    >
      <span className="password-rule__icon" aria-hidden="true">
        {satisfied ? "\u2713" : "\u25CB"}
      </span>
      {label}
    </li>
  );
}

export default LoginForm;
