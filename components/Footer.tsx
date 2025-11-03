'use client';

import { Github, Mail, Linkedin, Heart } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/Kritika11052005', // Replace with your actual GitHub username
      icon: Github,
      hoverColor: isDark ? 'hover:text-white' : 'hover:text-gray-900'
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/in/kritika-benjwal/', // Replace with your actual LinkedIn username
      icon: Linkedin,
      hoverColor: 'hover:text-blue-400'
    },
    {
      name: 'Email',
      href: 'https://mail.google.com/mail/?view=cm&fs=1&to=ananya.benjwal@gmail.com', // Replace with your actual email
      icon: Mail,
      hoverColor: 'hover:text-yellow-400'
    }
  ];

  return (
    <footer className={`${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'} border-t mt-12 transition-colors`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Made By Section */}
          <div className="flex items-center gap-2">
            <span className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
            <span className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>by</span>
            <span className="text-sm font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Kritika Benjwal
            </span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${isDark ? 'text-zinc-400' : 'text-gray-500'} transition-all duration-300 ${link.hoverColor} transform hover:scale-110`}
                  aria-label={link.name}
                  title={link.name}
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>

          {/* Copyright */}
          <div className={`text-xs ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
            © {currentYear} AariyaTech Analytics
          </div>
        </div>
      </div>
    </footer>
  );
}