'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  FolderTree,
  BookOpen,
  Award,
  Layers,
  ArrowRight,
  Plus,
  RefreshCw,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { DashboardStats } from '@clearexam/contracts';

export default function AdminDashboardPage() {
  const { user, role, getIdToken } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getIdToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

      const res = await fetch(`${apiUrl}/v1/admin/catalog/stats`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error('Administrative login required to load live system metrics.');
        }
        throw new Error(`Failed to load system metrics (HTTP ${res.status})`);
      }

      const json = await res.json();
      setStats(json.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const metricCards = [
    {
      title: 'Registered Users',
      value: stats ? stats.registeredUsers : 0,
      icon: Users,
      color: 'bg-indigo-50 text-brand-indigo',
      description: 'Verified student and staff accounts'
    },
    {
      title: 'Exam Categories',
      value: stats ? stats.totalCategories : 0,
      icon: FolderTree,
      color: 'bg-sky-50 text-brand-teal',
      description: 'Active dynamic curriculum categories'
    },
    {
      title: 'Published Exams',
      value: stats ? stats.publishedExams : 0,
      icon: BookOpen,
      color: 'bg-emerald-50 text-feedback-success',
      description: `Live on student app (${stats ? stats.totalExams : 0} total created)`
    },
    {
      title: 'Approved Questions',
      value: stats ? stats.approvedQuestions : 0,
      icon: Layers,
      color: 'bg-amber-50 text-feedback-warning',
      description: 'Reviewer-approved question items'
    },
    {
      title: 'Completed Attempts',
      value: stats ? stats.completedAttempts : 0,
      icon: Award,
      color: 'bg-purple-50 text-purple-600',
      description: 'Graded student mock tests'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Platform Overview</h1>
            <Badge variant="success">Phase 02 Live</Badge>
          </div>
          <p className="text-slate-600 text-sm mt-1">
            Real database aggregates. Unlimited dynamic exam catalog.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/categories">
            <Button size="sm" variant="outline" className="gap-1.5">
              <Plus className="h-4 w-4" />
              New Category
            </Button>
          </Link>
          <Link href="/admin/exams">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              New Exam
            </Button>
          </Link>
          <button
            onClick={fetchStats}
            title="Refresh Metrics"
            className="p-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <Card className="border-amber-200 bg-amber-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-900 text-sm">Authentication Gateway</h3>
              <p className="text-xs text-amber-800 mt-1">{error}</p>
              <div className="mt-3">
                <Link href="/login">
                  <Button size="sm" variant="secondary">
                    Sign In as Administrator
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Real Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {metricCards.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-lg ${metric.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Live Count</span>
                </div>
                <div className="text-3xl font-extrabold text-slate-900">
                  {loading ? '...' : metric.value.toLocaleString()}
                </div>
                <h4 className="text-sm font-semibold text-slate-700 mt-1">{metric.title}</h4>
              </div>
              <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
                {metric.description}
              </p>
            </Card>
          );
        })}
      </div>

      {/* Management Quick Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-slate-900">Dynamic Exam Catalog</h3>
              <p className="text-xs text-slate-500">
                Configure unlimited exams (JEE, NEET, UPSC, SSC, Banking, Railways, School Boards) without changing app code.
              </p>
            </div>
            <Link href="/admin/exams">
              <Button size="sm" variant="outline" className="gap-1">
                Manage
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-slate-900">Staff Access & Permissions (RBAC)</h3>
              <p className="text-xs text-slate-500">
                Manage Editors, Reviewers, Content Admins, and Super Admins with audited claim verification.
              </p>
            </div>
            <Link href="/admin/users">
              <Button size="sm" variant="outline" className="gap-1">
                Manage
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
