'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import {
  MessageSquare,
  History,
  Plus,
  ChevronLeft,
  ChevronRight,
  Settings,
  Sparkles,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const navItems: NavItem[] = [
  { id: 'nav-chat', label: 'New Chat', href: '/', icon: MessageSquare },
  { id: 'nav-history', label: 'Chat History', href: '/CHAT-HISTORY', icon: History },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const isCollapsed = collapsed && !mobileOpen;

  return (
    <aside
      className={`sidebar-transition fixed inset-y-0 left-0 z-40 flex w-60 flex-shrink-0 flex-col bg-card border-r border-border lg:static lg:z-auto lg:translate-x-0 ${
        collapsed ? 'lg:w-16' : 'lg:w-60'
      } ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      {/* Logo */}
      <div
        className={`flex items-center h-14 px-3 border-b border-border flex-shrink-0 ${isCollapsed ? 'justify-center' : 'gap-2'}`}
      >
        <AppLogo size={28} />
        {!isCollapsed && (
          <span className="font-semibold text-foreground text-base tracking-tight truncate">
            ChatAI
          </span>
        )}
      </div>

      {/* New Chat Button */}
      <div className={`px-2 py-3 flex-shrink-0 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <Link
          href="/"
          onClick={onMobileClose}
          className={`flex items-center gap-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors duration-150 font-medium text-sm ${
            isCollapsed ? 'w-10 h-10 justify-center' : 'px-3 py-2 w-full'
          }`}
          title={isCollapsed ? 'New Chat' : undefined}
        >
          <Plus size={16} className="flex-shrink-0" />
          {!isCollapsed && <span>New Chat</span>}
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={onMobileClose}
              className={`flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors duration-150 group relative ${
                isCollapsed ? 'justify-center w-10 mx-auto' : 'w-full'
              } ${
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
              {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                <span className="ml-auto bg-primary/20 text-primary text-xs font-medium px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Model Indicator */}
      {!isCollapsed && (
        <div className="px-3 py-2 mx-2 mb-2 rounded-lg bg-muted/50 border border-border flex items-center gap-2 flex-shrink-0">
          <Sparkles size={13} className="text-primary flex-shrink-0" />
          <span className="text-xs text-muted-foreground truncate">GPT-4 · OpenAI</span>
        </div>
      )}

      {/* Settings */}
      <div
        className={`px-2 pb-3 flex-shrink-0 border-t border-border pt-2 ${isCollapsed ? 'flex justify-center' : ''}`}
      >
        <button
          className={`flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150 ${
            isCollapsed ? 'w-10 justify-center' : 'w-full'
          }`}
          title={isCollapsed ? 'Settings' : undefined}
        >
          <Settings size={18} className="flex-shrink-0" />
          {!isCollapsed && <span>Settings</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors duration-150 z-10 hover:bg-muted hover:text-foreground lg:flex"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
