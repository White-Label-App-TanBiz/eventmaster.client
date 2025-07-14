import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sun, Moon, Bell, ChevronDown, Menu, Settings, LogOut } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { UserRole, useAuth } from "../contexts/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
  };

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case "super_admin":
        return "Super Admin";
      case "client_admin":
        return "Client Admin";
      case "provider":
        return "Provider";
      case "admin":
        return "Admin";
      case "customer":
        return "Customer";
      default:
        return role;
    }
  };

  return (
    <header className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-4 lg:px-6 py-4 relative z-30">
      <div className="flex items-center justify-between">
        {/* Left Section - Mobile Menu */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button onClick={onToggleSidebar} className="lg:hidden p-2 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
            <Menu className="w-5 h-5" />
          </button>
        </div>
        {/* Right Section */}
        <div className="flex items-center space-x-2 lg:space-x-4 ml-auto">
          {/* Language Switcher */}
          <LanguageSwitcher />
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="p-2 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
            {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          {/* User Avatar and Info */}
          <div className="flex items-center space-x-2 lg:space-x-3 pl-2 lg:pl-4 border-l border-gray-200 dark:border-zinc-700">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</div>
              <div className="text-xs text-gray-500 dark:text-zinc-400">{getRoleDisplayName(user?.role || "super_admin")}</div>
            </div>
            <div className="relative" ref={userMenuRef}>
              <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center space-x-1 lg:space-x-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">{user?.avatar}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500 dark:text-zinc-400 hidden sm:block" />
              </button>
              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg shadow-lg py-1 z-50 animate-fade-in">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-zinc-800">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</div>
                    <div className="text-xs text-gray-500 dark:text-zinc-400">{user?.email}</div>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/dashboard/account-settings"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Account Settings</span>
                    </Link>
                    <hr className="my-1 border-gray-200 dark:border-zinc-700" />
                    <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
