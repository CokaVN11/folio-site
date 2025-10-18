'use client';

import Link from 'next/link';
import { useState } from 'react';

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/project', label: 'Projects' },
    { href: '/job', label: 'Career' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="relative flex flex-col justify-center items-center w-8 h-8 md:hidden"
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
      >
        <span
          className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ease-in-out ${
            isOpen ? 'rotate-45 translate-y-1.5' : '-translate-y-2'
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ease-in-out my-1 ${
            isOpen ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ease-in-out ${
            isOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-2'
          }`}
        />
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={closeMenu}
            aria-label="Close navigation menu"
          />

          {/* Mobile Menu */}
          <nav className="fixed top-0 right-0 h-full w-64 bg-background border-l border-border z-50 md:hidden">
            <div className="flex flex-col h-full">
              {/* Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button
                  onClick={closeMenu}
                  className="p-2 rounded-md hover:bg-accent transition-colors"
                  aria-label="Close navigation menu"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 p-4">
                <ul className="space-y-2">
                  {navItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className="block w-full px-4 py-3 text-lg rounded-md hover:bg-accent transition-colors text-center"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Menu Footer */}
              <div className="p-4 border-t border-border">
                <div className="text-center text-sm text-muted-foreground">
                  <p>Khanh Nguyen Portfolio</p>
                  <p className="mt-1">© 2025 All rights reserved</p>
                </div>
              </div>
            </div>
          </nav>
        </>
      )}
    </>
  );
}
