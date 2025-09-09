import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Zap, Globe, ArrowRight, Upload, Key, Download } from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: Shield,
      title: 'Military-Grade Security',
      description: 'Every file is encrypted with AES-256 encryption before leaving your device. Your data stays private.'
    },
    {
      icon: Key,
      title: 'Auto Password Protection',
      description: 'Each transfer gets a unique password automatically. No file is ever accessible without it.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Upload files up to 5GB with optimized performance and real-time progress tracking.'
    },
    {
      icon: Globe,
      title: 'No Account Required',
      description: 'Recipients can download files instantly with just a link and password. No registration needed.'
    }
  ];

  const steps = [
    {
      icon: Upload,
      title: 'Upload Your File',
      description: 'Drag & drop or select files up to 5GB. Free for files under 100MB.'
    },
    {
      icon: Lock,
      title: 'Auto Encryption',
      description: 'Files are encrypted client-side and get unique passwords automatically.'
    },
    {
      icon: Download,
      title: 'Secure Sharing',
      description: 'Share the link and password through separate channels for maximum security.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-primary-50 to-success-50 dark:from-dark-900 dark:to-dark-800">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Share Files
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-success-600">
                {' '}Securely
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              The most secure file transfer service on the web. Every upload is automatically 
              encrypted and password-protected. No exceptions, no compromises.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="btn btn-primary text-lg px-8 py-4 group"
              >
                Start Sharing Securely
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="btn btn-secondary text-lg px-8 py-4"
              >
                Sign In
              </Link>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Free for files up to 100MB • No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-dark-900">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Security by Design
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Built from the ground up with security as the top priority. Every feature 
              is designed to keep your files safe.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="card p-8 text-center card-hover">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-950/30 rounded-2xl mb-6">
                    <Icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50 dark:bg-dark-800">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Simple. Secure. Fast.
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Share files securely in three simple steps. No complex setup, 
              no compromised security.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="relative">
                  <div className="card p-8 text-center h-full">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-success-100 dark:bg-success-950/30 rounded-2xl mb-6">
                      <Icon className="h-8 w-8 text-success-600 dark:text-success-400" />
                    </div>
                    <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-success-600">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Share Files Securely?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of users who trust SecureShare with their most important files.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl group"
            >
              Get Started for Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;