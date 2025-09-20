import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../contexts/AuthContext';
import { loginSchema } from '../utils/validators';
import { LoginRequest } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { Gamepad2, Eye, EyeOff } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginRequest) => {
    try {
      await login(data);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gaming-dark-950 via-gaming-dark-900 to-gaming-dark-800">
      <div className="max-w-md w-full mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Gamepad2 className="w-12 h-12 text-accent-primary" />
          </div>
          <h1 className="text-3xl font-bold gaming-text-gradient">
            Welcome Back
          </h1>
          <p className="text-text-muted mt-2">
            Sign in to your Gaming Club account
          </p>
        </div>

        {/* Login Form */}
        <div className="card-glow">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-text-primary mb-2">
                Phone Number
              </label>
              <input
                {...register('phoneNumber')}
                type="tel"
                id="phoneNumber"
                placeholder="1234567890"
                className="input-field"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-400">{errors.phoneNumber.message}</p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-text-primary mb-2">
                Account Type
              </label>
              <select
                {...register('role')}
                id="role"
                className="input-field"
              >
                <option value="">Select account type</option>
                <option value="USER">User Account</option>
                <option value="ADMIN">Admin Account</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-400">{errors.role.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-text-muted">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-accent-primary hover:text-accent-primary/80 font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Accounts */}
        <div className="mt-6 card">
          <h3 className="text-sm font-medium text-text-primary mb-3">Demo Accounts</h3>
          <div className="space-y-2 text-xs text-text-muted">
            <div><strong>Admin:</strong> 1234567890</div>
            <div><strong>User:</strong> 9876543210</div>
            <div><strong>User:</strong> 5555555555</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
