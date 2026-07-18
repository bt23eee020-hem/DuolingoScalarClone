'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Trophy, 
  User as UserIcon, 
  Award, 
  Settings as SettingsIcon, 
  LogOut,
  Sun,
  Moon,
  Compass,
  Store
} from 'lucide-react';
import { useUserStore } from '../store/useUserStore';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useUserStore();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  if (!user) return null;

  const navItems = [
    { href: '/?tab=learn', label: 'Learn', icon: Home, color: 'text-green-500', tab: 'learn' },
    { href: '/?tab=leaderboard', label: 'Leaderboard', icon: Trophy, color: 'text-yellow-500', tab: 'leaderboard' },
    { href: '/?tab=quests', label: 'Quests', icon: Compass, color: 'text-purple-500', tab: 'quests' },
    { href: '/?tab=shop', label: 'Shop', icon: Store, color: 'text-rose-500', tab: 'shop' },
    { href: '/?tab=profile', label: 'Profile', icon: UserIcon, color: 'text-blue-500', tab: 'profile' },
    { href: '/?tab=settings', label: 'Settings', icon: SettingsIcon, color: 'text-gray-500', tab: 'settings' },
  ];

  return (
    <aside className="fixed bottom-0 left-0 z-20 flex h-16 w-full border-t border-gray-200 bg-white dark:bg-[#121214] dark:border-gray-800 px-2 py-1 md:bottom-auto md:left-0 md:top-0 md:h-screen md:w-64 md:flex-col md:border-r md:border-t-0 md:px-4 md:py-6">
      {/* Duolingo Logo */}
      <div className="hidden items-center gap-2 px-4 py-2 md:flex">
        <span className="text-3xl font-black tracking-widest text-[#58cc02]">duolingo</span>
      </div>

      {/* Nav List */}
      <nav className="flex w-full items-center justify-start sm:justify-around gap-1 overflow-x-auto md:overflow-visible md:mt-8 md:flex-col md:justify-start md:gap-2 h-full scrollbar-hide">
        {navItems.map((item) => {
          const currentTab = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('tab') || 'learn' : 'learn';
          const isActive = item.tab === currentTab;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 rounded-xl px-3 sm:px-4 py-2 sm:py-3.5 text-[15px] font-black tracking-wider uppercase transition-all duration-250 w-full justify-center md:justify-start border-2 shrink-0 md:shrink border-transparent ${
                isActive 
                  ? 'border-[#84d8ff] bg-[#ddf4ff] text-[#1899d6] dark:bg-[#1a272e] dark:border-[#1cb0f6] dark:text-white' 
                  : 'border-transparent text-[#778e9c] hover:bg-gray-50 dark:text-[#eef2f3] hover:border-gray-200 dark:hover:bg-gray-800/40 dark:hover:text-white'
              }`}
            >
              <Icon className={`h-5 w-5 shrink-0 ${isActive ? item.color : 'text-[#778e9c] dark:text-[#eef2f3]'}`} />
              <span className="hidden md:inline">{item.label}</span>
            </Link>
          );
        })}

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-4 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm font-bold tracking-wide uppercase text-gray-500 dark:text-gray-400 hover:bg-gray-50 hover:border-gray-200 dark:hover:bg-gray-800/40 border-2 border-transparent transition-all duration-200 w-full justify-center md:justify-start md:mt-auto cursor-pointer shrink-0 md:shrink"
        >
          {isDarkMode ? (
            <>
              <Sun className="h-6 w-6 text-yellow-500" />
              <span className="hidden md:inline">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="h-6 w-6 text-indigo-500" />
              <span className="hidden md:inline">Dark Mode</span>
            </>
          )}
        </button>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="flex items-center gap-4 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm font-bold tracking-wide uppercase text-gray-500 dark:text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20 dark:hover:text-red-400 transition-all duration-200 w-full justify-center md:justify-start cursor-pointer border-2 border-transparent shrink-0 md:shrink"
        >
          <LogOut className="h-6 w-6 text-gray-400 hover:text-red-500" />
          <span className="hidden md:inline">Sign Out</span>
        </button>
      </nav>
    </aside>
  );
}
