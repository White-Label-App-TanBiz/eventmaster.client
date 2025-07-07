import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';

const PublicFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-700 rounded-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">EventMaster</h1>
              </div>
            </div>
            <p className="text-gray-600 dark:text-zinc-400 mb-4">
              Your all-in-one platform for discovering, managing, and attending events that matter to you.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-gray-600 dark:text-zinc-400">
                <Mail className="w-4 h-4" />
                <span>contact@eventmaster.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 dark:text-zinc-400">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 dark:text-zinc-400">
                <MapPin className="w-4 h-4" />
                <span>123 Event Street, San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/events" className="text-gray-600 dark:text-zinc-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 dark:text-zinc-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 dark:text-zinc-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-600 dark:text-zinc-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/checkout/1" className="text-gray-600 dark:text-zinc-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Event Categories */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Event Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/events?category=business" className="text-gray-600 dark:text-zinc-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                  Business & Professional
                </Link>
              </li>
              <li>
                <Link to="/events?category=technology" className="text-gray-600 dark:text-zinc-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                  Technology
                </Link>
              </li>
              <li>
                <Link to="/events?category=entertainment" className="text-gray-600 dark:text-zinc-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                  Entertainment & Media
                </Link>
              </li>
              <li>
                <Link to="/events?category=education" className="text-gray-600 dark:text-zinc-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                  Education
                </Link>
              </li>
              <li>
                <Link to="/events?category=health" className="text-gray-600 dark:text-zinc-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                  Health & Wellness
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-gray-600 dark:text-zinc-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 dark:text-zinc-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-600 dark:text-zinc-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/refunds" className="text-gray-600 dark:text-zinc-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-zinc-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex space-x-4 mb-4 md:mb-0">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-zinc-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-zinc-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-zinc-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-zinc-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
            <div className="text-gray-500 dark:text-zinc-400 text-sm flex items-center">
              <span>© {currentYear} EventMaster. All rights reserved.</span>
              <Heart className="w-4 h-4 mx-1 text-red-500" />
              <span>Made with love</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;