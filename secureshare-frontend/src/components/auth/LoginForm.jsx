import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CustomInput from '../forms/CustomInput';
import PasswordInput from '../forms/PasswordInput';
import CustomButton from '../forms/CustomButton';
import AuthStatus from './AuthStatus';
import { LogIn, ArrowLeft } from 'lucide-react';

const LoginForm = () => {
  const { login, isAuthenticated, authError, clearAuthError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the page user was trying to access before login
  const from = location.state?.from?.pathname || '/dashboard';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember_me: false,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Clear auth errors when component mounts
  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear global auth error
    if (authError) {
      clearAuthError();
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    validateField(name, formData[name]);
  };

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'email':
        if (!value) error = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(value)) error = 'Email is invalid';
        break;
      
      case 'password':
        if (!value) error = 'Password is required';
        break;
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));

    return !error;
  };

  const validateForm = () => {
    const fieldsToValidate = ['email', 'password'];
    let isValid = true;

    fieldsToValidate.forEach(field => {
      const fieldValid = validateField(field, formData[field]);
      if (!fieldValid) isValid = false;
    });

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      if (key !== 'remember_me') acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const credentials = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };

      await login(credentials);
      // Navigation will happen via useEffect when isAuthenticated becomes true
    } catch (error) {
      console.error('Login error:', error);
      // Error is handled by AuthContext and displayed via AuthStatus
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back button */}
        <div className="flex justify-start">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to home
          </Link>
        </div>

        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <UserPlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Join SecureShare for secure file transfers
          </p>
        </div>

        {/* Auth Status Display */}
        <AuthStatus />

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CustomInput
                label="First Name"
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.first_name}
                touched={touched.first_name}
                placeholder="John"
                required
                autoComplete="given-name"
              />

              <CustomInput
                label="Last Name"
                name="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.last_name}
                touched={touched.last_name}
                placeholder="Doe"
                required
                autoComplete="family-name"
              />
            </div>

            <CustomInput
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              touched={touched.email}
              placeholder="john@example.com"
              required
              autoComplete="email"
            />

            <PasswordInput
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
              touched={touched.password}
              placeholder="Create a strong password"
              showStrengthIndicator
              required
              autoComplete="new-password"
            />

            <PasswordInput
              label="Confirm Password"
              name="password_confirm"
              value={formData.password_confirm}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password_confirm}
              touched={touched.password_confirm}
              placeholder="Confirm your password"
              required
              autoComplete="new-password"
            />
          </div>

          <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <p className="font-medium mb-1">By creating an account, you agree to our:</p>
            <ul className="space-y-1">
              <li>• Password requirements: 8+ characters with uppercase, lowercase, and number</li>
              <li>• File encryption: All uploads are automatically encrypted with AES-256</li>
              <li>• Privacy: We never access your decrypted files</li>
            </ul>
          </div>

          <CustomButton
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </CustomButton>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;