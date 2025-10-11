import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Modal from '../common/Modal';
import PasswordInput from '../forms/PasswordInput';
import CustomButton from '../forms/CustomButton';
import { CheckCircle, AlertCircle } from 'lucide-react';

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const { changePassword } = useAuth();
  
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    new_password_confirm: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    if (successMessage) {
      setSuccessMessage('');
    }

    if (name === 'new_password_confirm' || (name === 'new_password' && formData.new_password_confirm)) {
      const passwordToCheck = name === 'new_password' ? value : formData.new_password;
      const confirmPasswordToCheck = name === 'new_password_confirm' ? value : formData.new_password_confirm;
      
      if (confirmPasswordToCheck && passwordToCheck !== confirmPasswordToCheck) {
        setErrors(prev => ({
          ...prev,
          new_password_confirm: 'Passwords do not match'
        }));
      } else if (confirmPasswordToCheck) {
        setErrors(prev => ({
          ...prev,
          new_password_confirm: ''
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
      case 'old_password':
        if (!value) error = 'Current password is required';
        break;
      
      case 'new_password':
        if (!value) error = 'New password is required';
        else if (value.length < 8) error = 'Password must be at least 8 characters';
        else if (value.length > 128) error = 'Password is too long';
        else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          error = 'Password must contain at least one lowercase letter, one uppercase letter, and one number';
        }
        else if (value === formData.old_password) {
          error = 'New password must be different from current password';
        }
        break;
      
      case 'new_password_confirm':
        if (!value) error = 'Please confirm your new password';
        else if (value !== formData.new_password) error = 'Passwords do not match';
        break;
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));

    return !error;
  };

  const validateForm = () => {
    const fieldsToValidate = ['old_password', 'new_password', 'new_password_confirm'];
    let isValid = true;

    fieldsToValidate.forEach(field => {
      const fieldValid = validateField(field, formData[field]);
      if (!fieldValid) isValid = false;
    });

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🔐 ChangePasswordModal: Form submitted');
    
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    if (!validateForm()) {
      console.log('❌ ChangePasswordModal: Form validation failed');
      return;
    }

    console.log('✅ ChangePasswordModal: Form validation passed');
    setIsLoading(true);
    
    try {
      const passwordData = {
        old_password: formData.old_password,
        new_password: formData.new_password,
      };

      console.log('🔐 ChangePasswordModal: Calling changePassword...');
      const result = await changePassword(passwordData);
      console.log('✅ ChangePasswordModal: Password changed successfully!', result);
      
      setSuccessMessage('Password changed successfully!');
      
      // Reset form
      setFormData({
        old_password: '',
        new_password: '',
        new_password_confirm: '',
      });
      setTouched({});
      setErrors({});
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('❌ ChangePasswordModal: Error caught:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      
      setErrors({ 
        submit: error.message || 'Failed to change password. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      old_password: '',
      new_password: '',
      new_password_confirm: '',
    });
    setErrors({});
    setTouched({});
    setSuccessMessage('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Change Password"
      size="md"
      closable={!isLoading && !successMessage}
      showCloseButton={!isLoading && !successMessage}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {successMessage && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                {successMessage}
              </p>
            </div>
          </div>
        )}

        {errors.submit && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900 dark:text-red-100 mb-1">
                  Password Change Failed
                </p>
                <p className="text-sm text-red-700 dark:text-red-400">
                  {errors.submit}
                </p>
              </div>
            </div>
          </div>
        )}

        <PasswordInput
          label="Current Password"
          name="old_password"
          value={formData.old_password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.old_password}
          touched={touched.old_password}
          placeholder="Enter your current password"
          required
          autoComplete="current-password"
          disabled={isLoading || !!successMessage}
        />

        <PasswordInput
          label="New Password"
          name="new_password"
          value={formData.new_password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.new_password}
          touched={touched.new_password}
          placeholder="Enter your new password"
          showStrengthIndicator
          required
          autoComplete="new-password"
          disabled={isLoading || !!successMessage}
        />

        <PasswordInput
          label="Confirm New Password"
          name="new_password_confirm"
          value={formData.new_password_confirm}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.new_password_confirm}
          touched={touched.new_password_confirm}
          placeholder="Confirm your new password"
          required
          autoComplete="new-password"
          disabled={isLoading || !!successMessage}
        />

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <p className="text-xs font-medium text-blue-900 dark:text-blue-100 mb-2">
            Password Requirements:
          </p>
          <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
            <li>• At least 8 characters long</li>
            <li>• Contains at least one uppercase letter</li>
            <li>• Contains at least one lowercase letter</li>
            <li>• Contains at least one number</li>
            <li>• Must be different from current password</li>
          </ul>
        </div>

        <div className="flex space-x-3 pt-4">
          <CustomButton
            type="button"
            variant="outline"
            size="md"
            fullWidth
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </CustomButton>
          <CustomButton
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            loading={isLoading}
            disabled={isLoading || !!successMessage}
          >
            {isLoading ? 'Changing Password...' : 'Change Password'}
          </CustomButton>
        </div>
      </form>
    </Modal>
  );
};

export default ChangePasswordModal;