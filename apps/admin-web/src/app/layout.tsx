import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'ClearExam Super Admin Portal',
  description: 'Authoritative Exam, Catalog, Question Bank & Analytics Management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900">
        <AuthProvider>
          <header className="bg-slate-900 text-white border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <Link href="/" className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow">
                    CE
                  </div>
                  <div>
                    <span className="font-bold text-lg tracking-tight">ClearExam</span>
                    <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                      Super Admin
                    </span>
                  </div>
                </Link>

                <nav className="hidden md:flex items-center space-x-4 text-sm font-medium">
                  <Link href="/" className="text-slate-300 hover:text-white transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/admin/users" className="text-slate-300 hover:text-white transition-colors">
                    Staff & Users (RBAC)
                  </Link>
                </nav>
              </div>

              <div className="flex items-center space-x-4 text-sm">
                <Link
                  href="/login"
                  className="px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-200 transition-colors"
                >
                  Admin Login
                </Link>
              </div>
            </div>
          </header>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
