import React from 'react';
import { Shield, Github, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = [
    {
      title: 'Product',
      items: [
        { name: 'Features', href: '#features' },
        { name: 'Security', href: '#security' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'FAQ', href: '#faq' }
      ]
    },
    {
      title: 'Support',
      items: [
        { name: 'Documentation', href: '#docs' },
        { name: 'Help Center', href: '#help' },
        { name: 'Contact', href: '#contact' },
        { name: 'Status', href: '#status' }
      ]
    },
    {
      title: 'Company',
      items: [
        { name: 'About', href: '#about' },
        { name: 'Blog', href: '#blog' },
        { name: 'Careers', href: '#careers' },
        { name: 'Press', href: '#press' }
      ]
    }
  ];

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: '#github' },
    { name: 'Twitter', icon: Twitter, href: '#twitter' },
    { name: 'Email', icon: Mail, href: 'mailto:contact@secureshare.com' }
  ];

  return (
    <footer className="bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-dark-700 transition-theme">
      <div className="container-custom">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-primary-500 rounded-xl">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  SecureShare
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md mb-6">
                The most secure way to share files online. Every transfer is encrypted 
                and password-protected by default, ensuring your data stays private.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className="p-2 text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                      aria-label={item.name}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Links Sections */}
            {links.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.items.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-dark-700">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                © {currentYear} SecureShare. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <a
                  href="#privacy"
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="#terms"
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Terms of Service
                </a>
                <span className="text-sm text-gray-400 dark:text-gray-500">
                  Academic Project
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;