'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  FolderTree,
  BookOpen,
  HelpCircle,
  Users,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function AdminSidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { user, role, signOut } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Exam Categories', href: '/admin/categories', icon: FolderTree },
    { name: 'Exams & Syllabus', href: '/admin/exams', icon: BookOpen },
    { name: 'Question Bank', href: '/admin/questions', icon: HelpCircle },
    { name: 'Staff & Roles (RBAC)', href: '/admin/users', icon: Users },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-white w-64 border-r border-slate-800">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
        <Link href="/" className="flex items-center space-x-3">
          <img
            src="/logo.png"
            alt="ClearExam Logo"
            className="h-8 w-8 rounded-lg object-contain bg-white p-0.5 shadow-sm"
          />
          <div>
            <span className="font-bold text-base tracking-tight">ClearExam</span>
            <span className="block text-[10px] text-indigo-400 font-medium uppercase tracking-wider">
              Control Plane
            </span>
          </div>
        </Link>
      </div>

      {/* Nav Menu */}
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Catalog & Question Engine
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </div>
              {isActive && <ChevronRight className="h-3.5 w-3.5 text-indigo-200" />}
            </Link>
          );
        })}
      </div>

      {/* Current User & Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <div className="overflow-hidden mr-2">
            <div className="text-xs font-semibold text-white truncate">
              {user?.displayName || user?.email || 'Administrator'}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Badge variant={role === 'SUPER_ADMIN' ? 'danger' : 'warning'} className="text-[10px] px-1.5 py-0">
                {role || 'GUEST'}
              </Badge>
            </div>
          </div>
          {user && (
            <button
              onClick={() => signOut()}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden lg:flex lg:flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 shadow-xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
