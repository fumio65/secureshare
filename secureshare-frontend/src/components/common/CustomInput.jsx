import { forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

const CustomInput = forwardRef(({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  success,
  helperText,
  required = false,
  disabled = false,
  fullWidth = true,
  size = 'md',
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const baseInputClasses = 'block w-full border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 placeholder:text-gray-400 dark:placeholder:text-gray-500';

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-5 py-4 text-base'
  };

  const stateClasses = {
    default: 'border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 focus:ring-primary-500 focus:border-transparent',
    error: 'border-red-300 dark:border-red-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 focus:ring-red-500 focus:border-transparent',
    success: 'border-success-300 dark:border-success-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 focus:ring-success-500 focus:border-transparent',
    disabled: 'border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-900 text-gray-500 dark:text-gray-500 cursor-not-allowed'
  };

  const getStateClass = () => {
    if (disabled) return stateClasses.disabled;
    if (error) return stateClasses.error;
    if (success) return stateClasses.success;
    return stateClasses.default;
  };

  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <div className="h-4 w-4 text-gray-400">
              {leftIcon}
            </div>
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`
            ${baseInputClasses} 
            ${getStateClass()} 
            ${sizeClasses[size]} 
            ${leftIcon ? 'pl-12' : ''} 
            ${isPassword || rightIcon ? 'pr-12' : ''}
          `}
          {...props}
        />

        {/* Password Toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            disabled={disabled}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}

        {/* Right Icon (not password) */}
        {rightIcon && !isPassword && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <div className="h-4 w-4 text-gray-400">
              {rightIcon}
            </div>
          </div>
        )}

        {/* Status Icons */}
        {error && !isPassword && !rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <AlertCircle className="h-4 w-4 text-red-500" />
          </div>
        )}

        {success && !isPassword && !rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <CheckCircle className="h-4 w-4 text-success-500" />
          </div>
        )}
      </div>

      {/* Helper Text */}
      {(error || success || helperText) && (
        <div className="mt-2 text-xs">
          {error && (
            <p className="text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {error}
            </p>
          )}
          {success && !error && (
            <p className="text-success-500 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              {success}
            </p>
          )}
          {helperText && !error && !success && (
            <p className="text-gray-500 dark:text-gray-400">
              {helperText}
            </p>
          )}
        </div>
      )}
    </div>
  );
});

CustomInput.displayName = 'CustomInput';

export default CustomInput; 