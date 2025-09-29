import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CustomInput from '../forms/CustomInput';
import PasswordInput from '../forms/PasswordInput';
import CustomButton from '../forms/CustomButton';
import AuthStatus from './AuthStatus';
import { UserPlus, ArrowLeft, Shield, CheckCircle } from 'lucide-react';

const RegistrationForm = () => {
  const { register, isAuthenticated, authError, clearAuthError } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirm: '',
    agree_terms: false,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

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

    // Real-time password confirmation validation
    if (name === 'password_confirm' || (name === 'password' && formData.password_confirm)) {
      const passwordToCheck = name === 'password' ? value : formData.password;
      const confirmPasswordToCheck = name === 'password_confirm' ? value : formData.password_confirm;
      
      if (confirmPasswordToCheck && passwordToCheck !== confirmPasswordToCheck) {
        setErrors(prev => ({
          ...prev,
          password_confirm: 'Passwords do not match'
        }));
      } else if (confirmPasswordToCheck) {
        setErrors(prev => ({
          ...prev,
          password_confirm: ''
        }));
      }
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
      case 'first_name':
        if (!value.trim()) error = 'First name is required';
        else if (value.trim().length < 2) error = 'First name must be at least 2 characters';
        else if (value.trim().length > 30) error = 'First name must be less than 30 characters';
        else if (!/^[a-zA-Z\s'.-]+$/.test(value.trim())) error = 'First name contains invalid characters';
        break;
      
      case 'last_name':
        if (!value.trim()) error = 'Last name is required';
        else if (value.trim().length < 2) error = 'Last name must be at least 2 characters';
        else if (value.trim().length > 30) error = 'Last name must be less than 30 characters';
        else if (!/^[a-zA-Z\s'.-]+$/.test(value.trim())) error = 'Last name contains invalid characters';
        break;
      
      case 'email':
        if (!value) error = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(value)) error = 'Email format is invalid';
        else if (value.length > 254) error = 'Email is too long';
        break;
      
      case 'password':
        if (!value) error = 'Password is required';
        else if (value.length < 8) error = 'Password must be at least 8 characters';
        else if (value.length > 128) error = 'Password is too long';
        else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          error = 'Password must contain at least one lowercase letter, one uppercase letter, and one number';
        }
        break;
      
      case 'password_confirm':
        if (!value) error = 'Please confirm your password';
        else if (value !== formData.password) error = 'Passwords do not match';
        break;
      
      case 'agree_terms':
        if (!value) error = 'You must agree to the terms and conditions';
        break;
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));

    return !error;
  };

  const validateForm = () => {
    const fieldsToValidate = ['first_name', 'last_name', 'email', 'password', 'password_confirm', 'agree_terms'];
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
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    setIsLoading(true);
    
    try {
      const userData = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        password_confirm: formData.password_confirm,
      };

      console.log('Attempting registration with:', { ...userData, password: '[HIDDEN]', password_confirm: '[HIDDEN]' });
      await register(userData);
      console.log('Registration successful');
      // Navigation will happen via useEffect when isAuthenticated becomes true
    } catch (error) {
      console.error('Registration error:', error);
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

            {/* Terms and Conditions */}
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <input
                  id="agree_terms"
                  name="agree_terms"
                  type="checkbox"
                  checked={formData.agree_terms}
                  onChange={handleChange}
                  className={`
                    mt-0.5 h-4 w-4 rounded border focus:ring-2 focus:ring-blue-500 transition-colors
                    ${errors.agree_terms && touched.agree_terms 
                      ? 'border-red-300 text-red-600' 
                      : 'border-gray-300 text-blue-600 dark:border-gray-600'
                    }
                  `}
                />
                <label htmlFor="agree_terms" className="text-sm text-gray-700 dark:text-gray-300">
                  I agree to the{' '}
                  <Link to="/terms" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.agree_terms && touched.agree_terms && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.agree_terms}
                </p>
              )}
            </div>
          </div>

          {/* Security Features Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Your Security is Our Priority
                </h4>
                <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3" />
                    <span>All files are encrypted with AES-256 before upload</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3" />
                    <span>Every transfer is automatically password-protected</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3" />
                    <span>We never have access to your unencrypted files</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <CustomButton
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoading}
            disabled={isLoading || !formData.agree_terms}
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

export default RegistrationForm;