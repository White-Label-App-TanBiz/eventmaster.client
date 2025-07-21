import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Package, CreditCard, BarChart3, Settings, Key, Building2, X, Shield, Receipt, Calendar, UserCheck, Palette, User } from 'lucide-react';
import type { UserRole } from '@/contexts/types';
import type { SidebarProps, MenuItem } from './types';

import { useLanguage } from '@/contexts/hooks';

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, userRole }) => {
  const { t } = useLanguage();
  const location = useLocation();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const getMenuItems = () => {
    const items = [
      { id: 'dashboard', label: t('nav.dashboard'), icon: Home, path: '/dashboard', roles: ['super_admin', 'client_admin', 'provider', 'admin', 'customer'] },
      { id: 'client-admins', label: t('nav.clientAdmins'), icon: Users, path: '/dashboard/client-admins', roles: ['super_admin'] },
      { id: 'plans', label: t('nav.plans'), icon: Package, path: '/dashboard/plans', roles: ['super_admin', 'client_admin'] },
      { id: 'payments', label: t('nav.payments'), icon: CreditCard, path: '/dashboard/payments', roles: ['super_admin', 'client_admin'] },
      { id: 'transactions', label: t('nav.transactions'), icon: Receipt, path: '/dashboard/transactions', roles: ['super_admin', 'client_admin'] },
      { id: 'analytics', label: t('nav.analytics'), icon: BarChart3, path: '/dashboard/analytics', roles: ['super_admin', 'client_admin', 'provider'] },
      { id: 'licenses', label: t('nav.licenses'), icon: Key, path: '/dashboard/licenses', roles: ['super_admin'] },
      { id: 'settings', label: t('nav.settings'), icon: Settings, path: '/dashboard/settings', roles: ['super_admin'] },
      { id: 'providers', label: 'Providers', icon: Users, path: '/dashboard/providers', roles: ['client_admin'] },
      { id: 'white-label', label: 'White-label', icon: Palette, path: '/dashboard/white-label', roles: ['client_admin'] },
      { id: 'events', label: 'Events', icon: Calendar, path: '/dashboard/events', roles: ['provider', 'admin'] },
      { id: 'customers', label: 'Customers', icon: UserCheck, path: '/dashboard/customers', roles: ['provider', 'admin'] },
      { id: 'admins', label: 'Sub Admins', icon: Users, path: '/dashboard/admins', roles: ['provider'] },
      { id: 'my-events', label: 'My Events', icon: Calendar, path: '/dashboard/my-events', roles: ['customer'] },
      { id: 'account-settings', label: 'Account Settings', icon: User, path: '/dashboard/account-settings', roles: ['super_admin', 'client_admin', 'provider', 'admin', 'customer'] },
    ];

    return items.filter((item) => item.roles.includes(userRole));
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'client_admin':
        return 'Client Admin';
      case 'provider':
        return 'Provider';
      case 'admin':
        return 'Admin';
      case 'customer':
        return 'Customer';
      default:
        return role;
    }
  };

  const isActiveRoute = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }

    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const items = getMenuItems();
    setMenuItems(items);
  }, [userRole]);

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />}
      <div
        className={`
        fixed top-0 left-0 h-full w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 
        flex flex-col z-50 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-700 rounded-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Younivent</h1>
                <p className="text-sm text-gray-500 dark:text-zinc-400 flex items-center space-x-1">
                  <Shield className="w-4 h-4 text-blue-700 dark:text-blue-700" />
                  <span>{getRoleDisplayName(userRole)}</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.path);
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={handleLinkClick}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                    : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
