'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  HelpCircle,
  Plus,
  Upload,
  RefreshCw,
  Search,
  Filter,
  Copy,
  Archive,
  Edit,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { AdminQuestionItem, QuestionStatus, QuestionType } from '@clearexam/contracts';

export default function QuestionsDirectoryPage() {
  const { getIdToken, role } = useAuth();
  const [questions, setQuestions] = useState<AdminQuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getIdToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      if (typeFilter !== 'ALL') params.set('type', typeFilter);
      if (search.trim()) params.set('search', search.trim());

      const res = await fetch(`${apiUrl}/v1/admin/questions?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error(`Failed to load questions (HTTP ${res.status})`);
      }

      const json = await res.json();
      setQuestions(json.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [statusFilter, typeFilter]);

  const handleClone = async (id: string) => {
    try {
      setActionLoadingId(id);
      const token = await getIdToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

      const res = await fetch(`${apiUrl}/v1/admin/questions/${id}/clone`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error('Failed to clone question');
      }

      await fetchQuestions();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleArchive = async (id: string) => {
    if (!confirm('Are you sure you want to archive this question?')) return;
    try {
      setActionLoadingId(id);
      const token = await getIdToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

      const res = await fetch(`${apiUrl}/v1/admin/questions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error('Failed to archive question');
      }

      await fetchQuestions();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusBadge = (status: QuestionStatus) => {
    switch (status) {
      case 'PUBLISHED':
        return <Badge variant="success">PUBLISHED</Badge>;
      case 'APPROVED':
        return <Badge variant="default" className="bg-emerald-600 text-white">APPROVED</Badge>;
      case 'IN_REVIEW':
        return <Badge variant="warning">IN REVIEW</Badge>;
      case 'REJECTED':
        return <Badge variant="danger">REJECTED</Badge>;
      case 'ARCHIVED':
        return <Badge variant="outline" className="text-slate-400">ARCHIVED</Badge>;
      case 'DRAFT':
      default:
        return <Badge variant="outline" className="bg-slate-100 text-slate-700">DRAFT</Badge>;
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'HARD':
        return <Badge variant="danger" className="text-[10px] px-1.5 py-0">HARD</Badge>;
      case 'MEDIUM':
        return <Badge variant="warning" className="text-[10px] px-1.5 py-0">MEDIUM</Badge>;
      case 'EASY':
      default:
        return <Badge variant="success" className="text-[10px] px-1.5 py-0">EASY</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Question Bank
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Author, review, and manage multi-type questions with LaTeX, bilingual stems, and protected answer keys.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/questions/import">
            <Button variant="outline" className="flex items-center gap-1.5">
              <Upload className="h-4 w-4" />
              <span>Bulk Import CSV</span>
            </Button>
          </Link>
          <Link href="/admin/questions/new">
            <Button className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700">
              <Plus className="h-4 w-4" />
              <span>Author Question</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 bg-white shadow-sm border-slate-200">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by question text or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchQuestions()}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="h-4 w-4 text-slate-400 hidden sm:block" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-auto"
            >
              <option value="ALL">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="APPROVED">Approved</option>
              <option value="PUBLISHED">Published</option>
              <option value="REJECTED">Rejected</option>
              <option value="ARCHIVED">Archived</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-auto"
            >
              <option value="ALL">All Types</option>
              <option value="SINGLE_CHOICE">Single Choice</option>
              <option value="MULTI_CHOICE">Multi Choice</option>
              <option value="TRUE_FALSE">True / False</option>
              <option value="ASSERTION_REASON">Assertion - Reason</option>
              <option value="NUMERICAL">Numerical</option>
              <option value="PASSAGE_GROUP">Passage Group</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={fetchQuestions}
              disabled={loading}
              title="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </Card>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Questions Listing */}
      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-indigo-500" />
          <p className="text-sm">Loading question bank...</p>
        </div>
      ) : questions.length === 0 ? (
        <Card className="py-16 text-center border-dashed border-2 border-slate-200">
          <HelpCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No Questions Found</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-4">
            {search || statusFilter !== 'ALL' || typeFilter !== 'ALL'
              ? 'No questions match your current filter criteria. Try clearing filters.'
              : 'The question bank is currently empty. Start by authoring your first question or import via CSV.'}
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/admin/questions/new">
              <Button className="bg-indigo-600 hover:bg-indigo-700">Author Question</Button>
            </Link>
            <Link href="/admin/questions/import">
              <Button variant="outline">Bulk Import CSV</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {questions.map((q) => (
            <Card
              key={q.id}
              className="p-5 bg-white shadow-sm border-slate-200 hover:border-indigo-200 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {getStatusBadge(q.status)}
                    <Badge variant="outline" className="text-slate-600 font-mono text-xs">
                      {q.type.replace('_', ' ')}
                    </Badge>
                    {getDifficultyBadge(q.difficulty)}
                    <span className="text-xs text-slate-400">
                      v{q.version} • Updated {new Date(q.updatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Question Stem */}
                  <div className="text-sm font-semibold text-slate-900 leading-relaxed">
                    {q.stemRichText}
                  </div>

                  {q.stemHindi && (
                    <div className="text-xs text-slate-600 font-hindi">
                      {q.stemHindi}
                    </div>
                  )}

                  {/* Options count & tags */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                      {q.options?.length || 0} Options
                    </span>
                    {q.tags?.map((tag) => (
                      <span key={tag} className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-[11px]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end md:self-start flex-shrink-0">
                  <Link href={`/admin/questions/${q.id}`}>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Edit className="h-3.5 w-3.5" />
                      <span>Review / Edit</span>
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleClone(q.id)}
                    disabled={actionLoadingId === q.id}
                    title="Clone as draft"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  {['CONTENT_ADMIN', 'SUPER_ADMIN'].includes(role || '') && q.status !== 'ARCHIVED' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleArchive(q.id)}
                      disabled={actionLoadingId === q.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Archive question"
                    >
                      <Archive className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
