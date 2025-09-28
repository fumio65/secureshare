import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import CustomButton from '../forms/CustomButton';
import { Shield, Lock, Zap, Globe, CheckCircle } from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: Lock,
      title: 'Military-Grade Encryption',
      description: 'Every file is encrypted with AES-256 before upload. Your data stays private and secure.',
    },
    {
      icon: Shield,
      title: 'Password Protection',
      description: 'All transfers are automatically password-protected. Share links and passwords separately for maximum security.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Upload files up to 5GB with our optimized transfer system. No waiting, just fast, reliable transfers.',
    },
    {
      icon: Globe,
      title: 'Universal Access',
      description: 'Recipients can download files from any device without creating an account. Simple and convenient.',
    },
  ];

  const pricingTiers = [
    {
      size: '≤ 100MB',
      price: 'Free',
      description: 'Perfect for documents and small files',
      color: 'text-green-600 dark:text-green-400',
    },
    {
      size: '100MB - 1GB',
      price: '$3',
      description: 'Great for presentations and media files',
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      size: '1GB - 5GB',
      price: '$8',
      description: 'Ideal for large projects and video files',
      color: 'text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
            Secure File Sharing
            <span className="block text-blue-600 dark:text-blue-400">Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            Share files up to 5GB with military-grade encryption and automatic password protection. 
            Your files are secure, your recipients don't need an account.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <CustomButton variant="primary" size="lg" className="w-full sm:w-auto">
                Start Sharing Securely
              </CustomButton>
            </Link>
            <Link to="/login">
              <CustomButton variant="outline" size="lg" className="w-full sm:w-auto">
                Sign In
              </CustomButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
              Why Choose SecureShare?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Built with security and simplicity in mind
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Pay only for what you need, when you need it
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {tier.size}
                  </h3>
                  <div className={`text-4xl font-extrabold mb-2 ${tier.color}`}>
                    {tier.price}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {tier.description}
                  </p>
                </div>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-600 dark:text-gray-400">AES-256 Encryption</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-600 dark:text-gray-400">Password Protection</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-600 dark:text-gray-400">No Account Required for Recipients</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 dark:bg-blue-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Ready to Start Sharing Securely?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who trust SecureShare with their important files
          </p>
          <Link to="/register">
            <CustomButton variant="secondary" size="lg">
              Create Your Free Account
            </CustomButton>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <Shield className="h-6 w-6 text-blue-400 mr-2" />
            <span className="text-white font-semibold">SecureShare</span>
            <span className="text-gray-400 ml-4">© 2025 - Secure File Transfer Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;