'use client';

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="app-shell flex h-screen bg-background overflow-hidden">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((v) => !v)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      {mobileSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-label="Close navigation"
        />
      )}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <button
          type="button"
          className="fixed left-3 top-3 z-50 flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground shadow-sm lg:hidden"
          onClick={() => setMobileSidebarOpen((open) => !open)}
          aria-expanded={mobileSidebarOpen}
          aria-label={mobileSidebarOpen ? 'Close navigation' : 'Open navigation'}
        >
          {mobileSidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        {children}
      </main>
    </div>
  );
}
