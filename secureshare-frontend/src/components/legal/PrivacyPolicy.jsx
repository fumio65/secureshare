// FILE 2: src/components/legal/PrivacyPolicy.jsx (Updated with phone-like width)
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, AlertCircle } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      {/* Centered container with phone-like max width */}
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/register"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to registration
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Privacy Policy
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Last updated: October 12, 2025
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
          <section>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3">
              1. Introduction
            </h2>
            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              Welcome to SecureShare's Privacy Policy. We are committed to protecting your privacy and ensuring the 
              security of your data. This policy explains how we collect, use, and protect your information when you 
              use our secure file transfer service.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3">
              2. Information We Collect
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-base md:text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Account Information
                </h3>
                <ul className="list-disc list-inside text-sm md:text-base text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                  <li>Name (first and last name)</li>
                  <li>Email address</li>
                  <li>Password (stored securely with hashing)</li>
                  <li>Account creation date</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base md:text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                  File Transfer Information
                </h3>
                <ul className="list-disc list-inside text-sm md:text-base text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                  <li>File metadata (name, size, type, upload date)</li>
                  <li>Transfer history and download statistics</li>
                  <li>Generated passwords for file protection</li>
                  <li>File expiration dates</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base md:text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Payment Information
                </h3>
                <ul className="list-disc list-inside text-sm md:text-base text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                  <li>Payment transaction details (processed by Stripe)</li>
                  <li>Payment history and receipts</li>
                  <li>Note: We do not store credit card information</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base md:text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Technical Information
                </h3>
                <ul className="list-disc list-inside text-sm md:text-base text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                  <li>IP address and browser information</li>
                  <li>Session data for authentication</li>
                  <li>Theme preferences (dark/light mode)</li>
                  <li>Device and browser type</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3">
              3. How We Use Your Information
            </h2>
            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc list-inside text-sm md:text-base text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li>To provide and maintain the SecureShare service</li>
              <li>To authenticate users and manage accounts</li>
              <li>To process file transfers and downloads</li>
              <li>To process payments for premium file transfers</li>
              <li>To improve service performance and user experience</li>
              <li>To send important service-related notifications</li>
              <li>To detect and prevent fraud or misuse of the service</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Lock className="h-6 w-6 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-base md:text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                  Our Encryption Commitment
                </h3>
                <p className="text-sm text-green-800 dark:text-green-200 leading-relaxed mb-2">
                  <strong>We never have access to your unencrypted files.</strong> All files are encrypted client-side 
                  using AES-256 encryption before being uploaded to our servers.
                </p>
                <ul className="list-disc list-inside text-sm text-green-800 dark:text-green-200 space-y-1 ml-4">
                  <li>Client-side AES-256 encryption before upload</li>
                  <li>Unique encryption key generated for each file</li>
                  <li>Encrypted files stored on our servers</li>
                  <li>Password protection for all downloads</li>
                  <li>We only see encrypted data and metadata</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Additional sections would continue here with similar responsive styling */}
          
          <section className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Academic Project Notice
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  SecureShare is an academic project created for educational purposes. While we implement industry-standard 
                  security and privacy practices, this is not a production service.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Contact Us
            </h2>
            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              If you have questions about this Privacy Policy, please contact us:
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                <strong>Email:</strong>{' '}
                <a href="mailto:privacy@secureshare.edu" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 underline">
                  privacy@secureshare.edu
                </a>
              </p>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                <strong>Project:</strong> SecureShare Academic File Transfer Service
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;