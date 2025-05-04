import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { apiRequest } from './utils/api'; 
import './Login.css';

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!form.email || !form.password) {
      toast.error('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await apiRequest({
        method: 'POST',
        route: '/users/sign-in-user',
        body: {
          email: form.email,
          password: form.password,
        },
      });

      console.log('Login Response:', data);

      if (data.success && data.data?._id) {
        localStorage.setItem('authToken', data.data._id);
        toast.success('Login successful! Redirecting...');
        setTimeout(() => navigate('/profile'), 1000);
      } else {
        toast.error(data.message || 'Login failed.');
      }
    } catch (error) {
      console.error('Login Error:', error);
      toast.error('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* Left image */}
      <div className="login-left">
        <img src="/image6.png" alt="image" className="login-image" />
      </div>
      
      {/* Right section */}
      <div className="login-right">
        <div className="logo">
          <img src="/vericapture.png" alt="Logo" className="logo-image" />
        </div>
        <h2>Welcome Back</h2>
        <p>Welcome back, please enter your detail</p>

         {/* Social Buttons */}
         <div className="social-buttons">
            <button className="social-button" aria-label="Sign in with Google">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <path fill="#fbc02d" d="M43.6 20.5H42V20H24v8h11.3c-1.7 4.5-6 7.5-11.3 7.5-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l6-6C33.4 5.1 28.9 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 19.9-8.9 19.9-20 0-1.3-.1-2.7-.3-3.5z"/>
    <path fill="#e53935" d="M6.3 14.7l6.6 4.8c1.8-3.5 5.1-6.1 9.1-6.9V4.2C14.4 5.3 8.9 9.2 6.3 14.7z"/>
    <path fill="#4caf50" d="M24 44c4.8 0 9.2-1.6 12.7-4.3l-5.9-4.8C28.6 36.2 26.4 37 24 37c-5.3 0-9.6-3-11.4-7.5l-6.5 5c3 6.1 9.3 10.5 17.9 10.5z"/>
    <path fill="#1565c0" d="M43.6 20.5H42V20H24v8h11.3c-0.7 1.8-1.9 3.5-3.3 4.8l5.9 4.8c-0.4 0.3 7.1-6.6 7.1-17.1 0-1.3-.1-2.7-.3-3.5z"/>
    </svg>
    </button>

    
    <button className="social-button">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <path fill="#3b5998" d="M29 0H3C1.4 0 0 1.4 0 3v26c0 1.6 1.4 3 3 3h13V20h-4v-5h4v-3c0-4 2.4-6.3 6-6.3 1.7 0 3.1.1 3.5.2v4h-2.4c-1.9 0-2.3.9-2.3 2.2V15h5l-1 5h-4v12h8c1.6 0 3-1.4 3-3V3c0-1.6-1.4-3-3-3z"/>
</svg>
  </button>

  <button className="social-button">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1227">
  <path fill="#000" d="M723 568L1169 0H1070L677 500 349 0H0L471 711 0 1227H99L518 694l351 533h349L723 568zM568 619l-51-76L136 74h166l273 410 51 76 417 625H877L568 619z"/>
</svg>
</button>
</div>

<div className="divider">
        <span>OR</span> 
        </div>

      <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            className="input-box"
            required
          />
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              className="input-box"
              required
            />
            <span
              className="toggle-password"
              onClick={togglePasswordVisibility}>
              {showPassword ? <EyeIcon className="eye-icon" size={20} /> : <EyeOffIcon className="eye-icon" size={20} />}
            </span>
          </div>

          <div className="options">
            <label>
              <input type="checkbox" /> Keep me signed in
            </label>
            <Link to = "/forgot-password" className="forgot-link">Forgot Password</Link>
          </div>

          <button type="submit" className="sign-in-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {message && (
          <p style={{ marginTop: '1rem', color: message.includes('success') ? 'green' : 'crimson' }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
