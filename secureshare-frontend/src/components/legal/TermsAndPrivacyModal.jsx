// FILE: src/components/legal/TermsAndPrivacyModal.jsx
import React, { useState, useRef, useEffect } from 'react';
import { X, FileCheck, Shield, AlertCircle, Lock, CheckCircle } from 'lucide-react';

const TermsAndPrivacyModal = ({ isOpen, onClose, onAccept }) => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Reset scroll state when modal opens
      setHasScrolledToBottom(false);
      // Reset scroll position to top when modal opens
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.scrollTop = 0;
        }
      }, 0);
    }
  }, [isOpen]);

  const handleScroll = (e) => {
    const element = e.target;
    const scrolledToBottom = 
      Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 5;
    
    if (scrolledToBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };

  const handleAccept = () => {
    if (hasScrolledToBottom) {
      onAccept();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-4 sm:inset-8 md:inset-16 lg:inset-20 flex items-center justify-center">
        <div className="relative w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <FileCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Terms of Service & Privacy Policy
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Please read carefully before accepting
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div
            ref={contentRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-6 py-6 scroll-smooth"
          >
            <CombinedContent />
          </div>

          {/* Footer with Scroll Indicator and Accept Button */}
          <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-900">
            {!hasScrolledToBottom ? (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-3">
                <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-200 text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 animate-pulse" />
                  <p>
                    Please scroll to the bottom to read the complete Terms of Service and Privacy Policy
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-3">
                <div className="flex items-center space-x-2 text-green-800 dark:text-green-200 text-sm">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <p>You have read the complete document. You can now accept.</p>
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAccept}
                disabled={!hasScrolledToBottom}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                  hasScrolledToBottom
                    ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed opacity-50'
                }`}
              >
                I Accept Terms & Privacy Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Combined Terms and Privacy Content Component
const CombinedContent = () => (
  <div className="space-y-8 text-gray-700 dark:text-gray-300">
    {/* TERMS OF SERVICE SECTION */}
    <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
      <div className="flex items-center space-x-2 mb-2">
        <FileCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
          TERMS OF SERVICE
        </h2>
      </div>
      <p className="text-sm text-blue-800 dark:text-blue-200">
        Last updated: October 12, 2025
      </p>
    </div>

    <section>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
        1. Acceptance of Terms
      </h3>
      <p className="leading-relaxed">
        By accessing and using SecureShare ("the Service"), you accept and agree to be bound by these Terms of Service. 
        If you do not agree to these terms, please do not use the Service. This is an academic project created for 
        educational purposes.
      </p>
    </section>

    <section>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
        2. Service Description
      </h3>
      <p className="leading-relaxed mb-3">
        SecureShare is a secure file transfer service that provides:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li>End-to-end encrypted file transfers using AES-256 encryption</li>
        <li>Automatic password protection for all file transfers</li>
        <li>Secure download links with password authentication</li>
        <li>File size tiers: Free (≤100MB), Premium ($3 for ≤1GB), Large ($8 for ≤5GB)</li>
      </ul>
    </section>

    <section>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
        3. User Responsibilities
      </h3>
      <p className="leading-relaxed mb-3">
        As a user of SecureShare, you agree to:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4">
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
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
        4. File Storage and Deletion
      </h3>
      <p className="leading-relaxed">
        Files uploaded to SecureShare are stored in encrypted form on our servers. Files may be automatically 
        deleted after expiration periods (24 hours, 7 days, or 30 days depending on your selection). You are 
        responsible for maintaining your own backups of important files.
      </p>
    </section>

    <section>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
        5. Payment Terms
      </h3>
      <p className="leading-relaxed mb-3">
        For files larger than 100MB, payment is required before upload:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li>All payments are processed securely through Stripe</li>
        <li>Payments are non-refundable once a file is successfully uploaded</li>
        <li>This is a development/test environment using Stripe test mode</li>
        <li>No real payments are processed in this academic project version</li>
      </ul>
    </section>

    <section>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
        6. Prohibited Content
      </h3>
      <p className="leading-relaxed mb-3">
        You may not use SecureShare to share:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li>Illegal content or content that violates laws in your jurisdiction</li>
        <li>Malware, viruses, or other malicious code</li>
        <li>Content that infringes on intellectual property rights</li>
        <li>Content that is harmful, threatening, or abusive</li>
        <li>Personal information of others without consent</li>
      </ul>
    </section>

    <section>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
        7. Limitation of Liability
      </h3>
      <p className="leading-relaxed">
        SecureShare is provided "as is" for educational purposes. While we strive to provide a secure and reliable 
        service, we are not liable for any loss of data, unauthorized access, or other damages resulting from the 
        use of this Service. This is an academic project and should not be used for critical or sensitive file transfers 
        in production environments.
      </p>
    </section>

    <section>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
        8. Account Termination
      </h3>
      <p className="leading-relaxed">
        We reserve the right to suspend or terminate accounts that violate these Terms of Service, engage in 
        suspicious activity, or misuse the Service in any way.
      </p>
    </section>

    <section>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
        9. Changes to Terms
      </h3>
      <p className="leading-relaxed">
        We may update these Terms of Service from time to time. Continued use of the Service after changes 
        are made constitutes acceptance of the updated terms.
      </p>
    </section>

    {/* DIVIDER */}
    <div className="border-t-4 border-gray-300 dark:border-gray-600 my-8"></div>

    {/* PRIVACY POLICY SECTION */}
    <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded">
      <div className="flex items-center space-x-2 mb-2">
        <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
        <h2 className="text-2xl font-bold text-green-900 dark:text-green-100">
          PRIVACY POLICY
        </h2>
      </div>
      <p className="text-sm text-green-800 dark:text-green-200">
        Last updated: October 12, 2025
      </p>
    </div>

    <section>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
        1. Introduction
      </h3>
      <p className="leading-relaxed">
        Welcome to SecureShare's Privacy Policy. We are committed to protecting your privacy and ensuring the 
        security of your data. This policy explains how we collect, use, and protect your information when you 
        use our secure file transfer service.
      </p>
    </section>

    <section>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
        2. Information We Collect
      </h3>
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
            Account Information
          </h4>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Name (first and last name)</li>
            <li>Email address</li>
            <li>Password (stored securely with hashing)</li>
            <li>Account creation date</li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
            File Transfer Information
          </h4>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>File metadata (name, size, type, upload date)</li>
            <li>Transfer history and download statistics</li>
            <li>Generated passwords for file protection</li>
            <li>File expiration dates</li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
            Payment Information
          </h4>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Payment transaction details (processed by Stripe)</li>
            <li>Payment history and receipts</li>
            <li>Note: We do not store credit card information</li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
            Technical Information
          </h4>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>IP address and browser information</li>
            <li>Session data for authentication</li>
            <li>Theme preferences (dark/light mode)</li>
            <li>Device and browser type</li>
          </ul>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
        3. How We Use Your Information
      </h3>
      <p className="leading-relaxed mb-3">
        We use the collected information for the following purposes:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4">
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

    <section className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
      <div className="flex items-start space-x-3">
        <Lock className="h-6 w-6 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
            Our Encryption Commitment
          </h4>
          <p className="text-green-800 dark:text-green-200 leading-relaxed mb-2">
            <strong>We never have access to your unencrypted files.</strong> All files are encrypted client-side 
            using AES-256 encryption before being uploaded to our servers. The encryption happens in your browser, 
            and only encrypted data is transmitted and stored.
          </p>
          <ul className="list-disc list-inside text-green-800 dark:text-green-200 space-y-1 ml-4">
            <li>Client-side AES-256 encryption before upload</li>
            <li>Unique encryption key generated for each file</li>
            <li>Encrypted files stored on our servers</li>
            <li>Password protection for all downloads</li>
            <li>We only see encrypted data and metadata</li>
          </ul>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
        4. Data Sharing and Disclosure
      </h3>
      <p className="leading-relaxed mb-3">
        We do not sell, trade, or rent your personal information to third parties. We may share information only in 
        the following circumstances:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li><strong>With your consent:</strong> When you authorize us to share specific information</li>
        <li><strong>Service providers:</strong> Stripe for payment processing (they have their own privacy policies)</li>
        <li><strong>Legal requirements:</strong> When required by law or to protect our rights</li>
        <li><strong>Academic purposes:</strong> Anonymized usage statistics for educational research</li>
      </ul>
    </section>

    <section>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
        5. Data Retention
      </h3>
      <p className="leading-relaxed mb-3">
        We retain your information for the following periods:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li><strong>Account data:</strong> Retained until you delete your account</li>
        <li><strong>Files:</strong> Automatically deleted after expiration period (24 hours, 7 days, or 30 days)</li>
        <li><strong>Transfer history:</strong> Retained for your reference until account deletion</li>
        <li><strong>Payment records:</strong> Retained for accounting and legal compliance</li>
      </ul>
    </section>

    <section>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
        6. Your Rights
      </h3>
      <p className="leading-relaxed mb-3">
        You have the following rights regarding your personal data:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li><strong>Access:</strong> Request a copy of your personal data</li>
        <li><strong>Correction:</strong> Update or correct your account information</li>
        <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
        <li><strong>Export:</strong> Download your transfer history and file metadata</li>
        <li><strong>Opt-out:</strong> Unsubscribe from non-essential communications</li>
      </ul>
    </section>

    <section>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
        7. Security Measures
      </h3>
      <p className="leading-relaxed mb-3">
        We implement multiple layers of security to protect your data:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li>Client-side AES-256 file encryption</li>
        <li>Secure password hashing (bcrypt/Argon2)</li>
        <li>JWT token-based authentication</li>
        <li>HTTPS encryption for all data transmission</li>
        <li>Session tracking and monitoring</li>
        <li>Automatic password protection for all transfers</li>
        <li>Regular security audits and updates</li>
      </ul>
    </section>

    <section>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
        8. Cookies and Local Storage
      </h3>
      <p className="leading-relaxed mb-3">
        We use localStorage to enhance your experience:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li><strong>Authentication tokens:</strong> To keep you logged in between sessions</li>
        <li><strong>Theme preference:</strong> To remember your dark/light mode choice</li>
        <li><strong>Session data:</strong> To maintain your session state</li>
      </ul>
    </section>

    <section>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
        9. Third-Party Services
      </h3>
      <p className="leading-relaxed mb-3">
        We use the following third-party services:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li>
          <strong>Stripe:</strong> For secure payment processing. Stripe has its own privacy policy at{' '}
          <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" 
             className="text-blue-600 hover:text-blue-500 dark:text-blue-400 underline">
            stripe.com/privacy
          </a>
        </li>
        <li><strong>Note:</strong> We are currently using Stripe in test mode for this academic project</li>
      </ul>
    </section>

    <section>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
        10. Children's Privacy
      </h3>
      <p className="leading-relaxed">
        SecureShare is not intended for use by children under the age of 13. We do not knowingly collect personal 
        information from children. If you believe we have collected information from a child, please contact us 
        immediately.
      </p>
    </section>

    <section>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
        11. Changes to Privacy Policy
      </h3>
      <p className="leading-relaxed">
        We may update this Privacy Policy from time to time. We will notify users of significant changes via email 
        or through the service. Continued use of SecureShare after changes constitutes acceptance of the updated policy.
      </p>
    </section>

    {/* ACADEMIC PROJECT NOTICE */}
    <section className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
            Academic Project Notice
          </h4>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            SecureShare is an academic project created for educational purposes. While we implement industry-standard 
            security and privacy practices, this is not a production service. Use discretion when sharing sensitive 
            information, and consider this an educational demonstration of secure file transfer principles.
          </p>
        </div>
      </div>
    </section>

    {/* CONTACT INFORMATION */}
    <section>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
        Contact Us
      </h3>
      <p className="leading-relaxed mb-3">
        If you have questions about these Terms of Service or Privacy Policy, please contact us:
      </p>
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
        <p>
          <strong>Email:</strong>{' '}
          <a href="mailto:support@secureshare.edu" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 underline">
            support@secureshare.edu
          </a>
        </p>
        <p><strong>Project:</strong> SecureShare Academic File Transfer Service</p>
        <p><strong>Type:</strong> Educational/Academic Project</p>
      </div>
    </section>

    {/* END MARKER - User must scroll here */}
    <div className="text-center py-8 border-t-2 border-gray-300 dark:border-gray-600">
      <div className="inline-flex items-center space-x-2 text-green-600 dark:text-green-400">
        <CheckCircle className="h-6 w-6" />
        <p className="text-lg font-semibold">
          End of Document - You can now accept
        </p>
      </div>
    </div>
  </div>
);

export default TermsAndPrivacyModal;