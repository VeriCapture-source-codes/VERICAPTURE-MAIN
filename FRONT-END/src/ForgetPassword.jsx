import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiRequest } from './utils/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    emailOrUsername: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.emailOrUsername) {
      toast.error('Please enter your email address or username.');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await apiRequest({
        method: 'POST',
        route: '/users/password-reset-otp',
        body: {
          email: form.emailOrUsername,
        },
      });

      console.log('Request OTP Response:', data);

      if (data.success) {
        toast.success('Request successful! Redirecting...');
        setTimeout(() => {
          navigate(`/verify-otp?email=${form.emailOrUsername}`, {
            state: { email: form.emailOrUsername },
          });
        }, 1000);
      } else {
        toast.error(data.message || 'There was an issue processing your request. Please try again later.');
      }
    } catch (error) {
      console.error(error);
      toast.error('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 relative">
      {/* Logo */}
      <div className="absolute top-4 left-4">
        <img src="/vericapture img.png" alt="Logo" className="h-8" />
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md text-center">
        <h1 className="text-4xl font-bold mb-4">Forgot Password?</h1>

        {/* Lock Image */}
        <div className="flex justify-center mb-6">
          <img src="/forgetPassword img.png" alt="Lock Icon" className="h-12" />
        </div>

        <p className="text-gray-600 mb-8 text-[20px] font-normal">
          We'll Send you an Email to <br /> Reset your Password
        </p>

        {/* Email Input */}
        <form onSubmit={handleSubmit}>
          <div className="relative mb-6">
            <input
              type="email"
              name="emailOrUsername"
              id="email"
              value={form.emailOrUsername}
              onChange={handleChange}
              placeholder="Your Email"
              className="w-full py-3 pl-10 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            {/* Email Icon inside input */}
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <img src="/message img.png" alt="Email Icon" className="w-5 h-5" />
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-cyan-400 hover:bg-cyan-500 text-white font-semibold rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending...' : 'Submit'}
          </button>
        </form>

        {/* Back to Login */}
        <div className="mt-6">
          <Link
            to="/login"
            className="text-sm text-gray-700 hover:underline flex items-center justify-center gap-1"
          >
            <span>←</span> BACK TO LOGIN
          </Link>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar newestOnTop />
    </div>
  );
};

export default ForgotPassword;
