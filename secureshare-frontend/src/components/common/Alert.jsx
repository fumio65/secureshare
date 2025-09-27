import { useState } from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

const Alert = ({
  variant = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
  className = '',
  icon: CustomIcon
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };

  if (!isVisible) return null;

  const variants = {
    success: {
      containerClass: 'bg-success-50 dark:bg-success-950/20 border-success-200 dark:border-success-800',
      iconClass: 'text-success-600 dark:text-success-400',
      titleClass: 'text-success-800 dark:text-success-200',
      textClass: 'text-success-700 dark:text-success-300',
      icon: CheckCircle
    },
    error: {
      containerClass: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800',
      iconClass: 'text-red-600 dark:text-red-400',
      titleClass: 'text-red-800 dark:text-red-200',
      textClass: 'text-red-700 dark:text-red-300',
      icon: AlertCircle
    },
    warning: {
      containerClass: 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800',
      iconClass: 'text-yellow-600 dark:text-yellow-400',
      titleClass: 'text-yellow-800 dark:text-yellow-200',
      textClass: 'text-yellow-700 dark:text-yellow-300',
      icon: AlertTriangle
    },
    info: {
      containerClass: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800',
      iconClass: 'text-blue-600 dark:text-blue-400',
      titleClass: 'text-blue-800 dark:text-blue-200',
      textClass: 'text-blue-700 dark:text-blue-300',
      icon: Info
    }
  };

  const config = variants[variant] || variants.info;
  const IconComponent = CustomIcon || config.icon;

  return (
    <div className={`p-4 rounded-xl border transition-theme ${config.containerClass} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <IconComponent className={`h-5 w-5 ${config.iconClass}`} />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-semibold ${config.titleClass} mb-1`}>
              {title}
            </h3>
          )}
          <div className={`text-sm ${config.textClass}`}>
            {children}
          </div>
        </div>
        {dismissible && (
          <div className="ml-auto pl-3">
            <button
              type="button"
              onClick={handleDismiss}
              className={`inline-flex rounded-md p-1.5 hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-10 transition-colors ${config.iconClass}`}
              aria-label="Dismiss alert"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;