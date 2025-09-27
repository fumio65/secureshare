const Card = ({
  children,
  className = '',
  hover = false,
  padding = 'default',
  variant = 'default',
  onClick,
  ...props
}) => {
  const baseClasses = 'bg-white dark:bg-dark-800 rounded-2xl border border-gray-100 dark:border-dark-700 transition-all duration-200';

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const variantClasses = {
    default: 'shadow-soft dark:shadow-dark-soft',
    elevated: 'shadow-medium dark:shadow-dark-soft',
    outlined: 'border-gray-200 dark:border-dark-600 shadow-none',
    flat: 'shadow-none border-transparent'
  };

  const hoverClasses = hover ? 'hover:shadow-medium dark:hover:shadow-dark-soft hover:-translate-y-0.5 cursor-pointer' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';

  const paddingClass = paddingClasses[padding] || paddingClasses.default;
  const variantClass = variantClasses[variant] || variantClasses.default;

  return (
    <div
      className={`${baseClasses} ${variantClass} ${paddingClass} ${hoverClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

// Card subcomponents for better composition
export const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-6 ${className}`}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-6 pt-6 border-t border-gray-100 dark:border-dark-700 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-xl font-semibold text-gray-900 dark:text-white ${className}`}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '' }) => (
  <p className={`text-gray-600 dark:text-gray-400 ${className}`}>
    {children}
  </p>
);

export default Card;