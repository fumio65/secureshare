// FILE 1: src/components/legal/TermsOfService.jsx (Updated with phone-like width)
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileCheck, AlertCircle } from 'lucide-react';

const TermsOfService = () => {
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
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
              <FileCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Terms of Service
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
              1. Acceptance of Terms
            </h2>
            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              By accessing and using SecureShare ("the Service"), you accept and agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use the Service. This is an academic project created for 
              educational purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3">
              2. Service Description
            </h2>
            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              SecureShare is a secure file transfer service that provides:
            </p>
            <ul className="list-disc list-inside text-sm md:text-base text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li>End-to-end encrypted file transfers using AES-256 encryption</li>
              <li>Automatic password protection for all file transfers</li>
              <li>Secure download links with password authentication</li>
              <li>File size tiers: Free (≤100MB), Premium ($3 for ≤1GB), Large ($8 for ≤5GB)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3">
              3. User Responsibilities
            </h2>
            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              As a user of SecureShare, you agree to:
            </p>
            <ul className="list-disc list-inside text-sm md:text-base text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li>Provide accurate and complete registration information</li>
              <li>Keep your account credentials secure and confidential</li>
              <li>Not share files that are illegal, harmful, or infringe on others' rights</li>
              <li>Not use the Service to distribute malware, viruses, or harmful code</li>
              <li>Not attempt to breach or circumvent security measures</li>
              <li>Respect the intellectual property rights of others</li>
              <li>Share download passwords through separate, secure channels as recommended</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3">
              4. File Storage and Deletion
            </h2>
            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              Files uploaded to SecureShare are stored in encrypted form on our servers. Files may be automatically 
              deleted after expiration periods (24 hours, 7 days, or 30 days depending on your selection). You are 
              responsible for maintaining your own backups of important files.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3">
              5. Payment Terms
            </h2>
            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              For files larger than 100MB, payment is required before upload:
            </p>
            <ul className="list-disc list-inside text-sm md:text-base text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li>All payments are processed securely through Stripe</li>
              <li>Payments are non-refundable once a file is successfully uploaded</li>
              <li>This is a development/test environment using Stripe test mode</li>
              <li>No real payments are processed in this academic project version</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3">
              6. Privacy and Security
            </h2>
            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              We take your privacy and security seriously. All files are encrypted client-side before upload using 
              AES-256 encryption. We never have access to your unencrypted files. For more details, please refer to 
              our{' '}
              <Link to="/privacy" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 underline">
                Privacy Policy
              </Link>.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3">
              7. Prohibited Content
            </h2>
            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              You may not use SecureShare to share:
            </p>
            <ul className="list-disc list-inside text-sm md:text-base text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li>Illegal content or content that violates laws in your jurisdiction</li>
              <li>Malware, viruses, or other malicious code</li>
              <li>Content that infringes on intellectual property rights</li>
              <li>Content that is harmful, threatening, or abusive</li>
              <li>Personal information of others without consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3">
              8. Limitation of Liability
            </h2>
            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              SecureShare is provided "as is" for educational purposes. While we strive to provide a secure and reliable 
              service, we are not liable for any loss of data, unauthorized access, or other damages resulting from the 
              use of this Service. This is an academic project and should not be used for critical or sensitive file transfers 
              in production environments.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3">
              9. Account Termination
            </h2>
            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              We reserve the right to suspend or terminate accounts that violate these Terms of Service, engage in 
              suspicious activity, or misuse the Service in any way.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3">
              10. Changes to Terms
            </h2>
            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              We may update these Terms of Service from time to time. Continued use of the Service after changes 
              are made constitutes acceptance of the updated terms.
            </p>
          </section>

          <section className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Academic Project Notice
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  SecureShare is an academic/school project created for educational purposes. While it implements 
                  industry-standard security practices, it is not intended for production use with sensitive or critical 
                  data. Use at your own discretion.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Contact Information
            </h2>
            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              If you have questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:support@secureshare.edu" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 underline">
                support@secureshare.edu
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;