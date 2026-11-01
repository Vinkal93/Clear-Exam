'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  XCircle,
  Send,
  Globe,
  Archive,
  Copy,
  AlertCircle,
  RefreshCw,
  Plus,
  Trash2,
  Clock,
  ShieldCheck
} from 'lucide-react';
import {
  QuestionType,
  QuestionDifficulty,
  QuestionOption,
  QuestionStatus
} from '@clearexam/contracts';

export default function QuestionDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { getIdToken, role } = useAuth();

  // Full question state
  const [question, setQuestion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states
  const [stemRichText, setStemRichText] = useState('');
  const [stemHindi, setStemHindi] = useState('');
  const [stemLatex, setStemLatex] = useState('');
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>('MEDIUM');
  const [options, setOptions] = useState<QuestionOption[]>([]);
  const [correctOptionIds, setCorrectOptionIds] = useState<string[]>([]);
  const [explanationRichText, setExplanationRichText] = useState('');
  const [explanationHindi, setExplanationHindi] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  // Review modal / prompt
  const [reviewNotes, setReviewNotes] = useState('');

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getIdToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

      const res = await fetch(`${apiUrl}/v1/admin/questions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error(`Failed to load question (HTTP ${res.status})`);
      }

      const json = await res.json();
      const q = json.data;
      setQuestion(q);
      setStemRichText(q.stemRichText || '');
      setStemHindi(q.stemHindi || '');
      setStemLatex(q.stemLatex || '');
      setDifficulty(q.difficulty || 'MEDIUM');
      setOptions(q.options || []);
      setCorrectOptionIds(q.correctOptionIds || []);
      setExplanationRichText(q.explanationRichText || '');
      setExplanationHindi(q.explanationHindi || '');
      setTagsInput(q.tags?.join(', ') || '');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchQuestion();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);
      const token = await getIdToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

      const payload = {
        stemRichText: stemRichText.trim(),
        stemHindi: stemHindi.trim() || undefined,
        stemLatex: stemLatex.trim() || null,
        difficulty,
        options,
        correctOptionIds,
        explanationRichText: explanationRichText.trim(),
        explanationHindi: explanationHindi.trim() || undefined,
        tags: tagsInput ? tagsInput.split(',').map((t) => t.trim()).filter(Boolean) : []
      };

      const res = await fetch(`${apiUrl}/v1/admin/questions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.message || 'Failed to update question');
      }

      const json = await res.json();
      setQuestion(json.data);
      setSuccessMessage('Question and protected answer enclave updated successfully (v' + json.data.version + ').');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReviewAction = async (action: 'SUBMIT_FOR_REVIEW' | 'APPROVE' | 'REJECT' | 'PUBLISH' | 'ARCHIVE') => {
    try {
      setActionLoading(true);
      setError(null);
      setSuccessMessage(null);
      const token = await getIdToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

      const res = await fetch(`${apiUrl}/v1/admin/questions/${id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ action, reviewNotes: reviewNotes.trim() || undefined })
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.message || `Failed to execute action ${action}`);
      }

      const json = await res.json();
      setQuestion((prev: any) => ({ ...prev, ...json.data }));
      setSuccessMessage(`Question successfully updated to status ${json.data.status}`);
      setReviewNotes('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleClone = async () => {
    try {
      setActionLoading(true);
      const token = await getIdToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

      const res = await fetch(`${apiUrl}/v1/admin/questions/${id}/clone`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Failed to duplicate question');
      const json = await res.json();
      router.push(`/admin/questions/${json.data.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
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

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-400">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-indigo-500" />
        <p className="text-sm">Loading question details...</p>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-600">Question not found.</p>
        <Link href="/admin/questions" className="mt-4 inline-block text-indigo-600 hover:underline">
          Return to Question Bank
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/questions">
            <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-lg">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Question Details
              </h1>
              {getStatusBadge(question.status)}
              <Badge variant="outline" className="font-mono text-xs">
                v{question.version}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              ID: {question.id} • Exam: {question.examId} • Subject: {question.subjectId}
            </p>
          </div>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClone}
            disabled={actionLoading}
            className="flex items-center gap-1.5"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>Duplicate</span>
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-600" />
          <span className="text-sm font-medium">{successMessage}</span>
        </div>
      )}

      {/* Workflow Action Bar */}
      <Card className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-300">
              <ShieldCheck className="h-4 w-4" />
              Workflow Lifecycle Status: {question.status}
            </div>
            <div className="text-xs text-slate-300">
              {question.status === 'DRAFT' && 'Ready for editorial review submission.'}
              {question.status === 'IN_REVIEW' && 'Under peer verification. Reviewers can approve or reject with feedback.'}
              {question.status === 'APPROVED' && 'Approved by reviewer. Ready for live publication into test engines.'}
              {question.status === 'PUBLISHED' && 'Live. Available for authoring test papers and question banks.'}
              {question.status === 'REJECTED' && 'Changes requested by reviewer. See review notes below.'}
            </div>
            {question.reviewNotes && (
              <div className="mt-2 p-2 rounded bg-white/10 text-xs text-indigo-100 border border-white/10">
                <span className="font-bold">Review Notes:</span> {question.reviewNotes}
              </div>
            )}
          </div>

          {/* Workflow Action Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {(question.status === 'DRAFT' || question.status === 'REJECTED') && (
              <Button
                size="sm"
                onClick={() => handleReviewAction('SUBMIT_FOR_REVIEW')}
                disabled={actionLoading}
                className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5"
              >
                <Send className="h-3.5 w-3.5" />
                Submit For Review
              </Button>
            )}

            {question.status === 'IN_REVIEW' && ['REVIEWER', 'CONTENT_ADMIN', 'SUPER_ADMIN'].includes(role || '') && (
              <>
                <Button
                  size="sm"
                  onClick={() => handleReviewAction('APPROVE')}
                  disabled={actionLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Approve Question
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const notes = prompt('Enter rejection reasons / required fixes:');
                    if (notes) {
                      setReviewNotes(notes);
                      handleReviewAction('REJECT');
                    }
                  }}
                  disabled={actionLoading}
                  className="border-red-400 text-red-300 hover:bg-red-950/40 flex items-center gap-1.5"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Request Fixes (Reject)
                </Button>
              </>
            )}

            {question.status === 'APPROVED' && ['CONTENT_ADMIN', 'SUPER_ADMIN'].includes(role || '') && (
              <Button
                size="sm"
                onClick={() => handleReviewAction('PUBLISH')}
                disabled={actionLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5"
              >
                <Globe className="h-3.5 w-3.5" />
                Publish Live
              </Button>
            )}

            {question.status !== 'ARCHIVED' && ['CONTENT_ADMIN', 'SUPER_ADMIN'].includes(role || '') && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (confirm('Archive this question?')) handleReviewAction('ARCHIVE');
                }}
                disabled={actionLoading}
                className="border-slate-700 text-slate-300 hover:bg-slate-800 flex items-center gap-1.5"
              >
                <Archive className="h-3.5 w-3.5" />
                Archive
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Edit Form */}
      <form onSubmit={handleUpdate} className="space-y-6">
        <Card className="p-6 bg-white shadow-sm border-slate-200 space-y-4">
          <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
            Question Problem Statement (Stem)
          </h2>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              English Problem Text *
            </label>
            <textarea
              rows={3}
              value={stemRichText}
              onChange={(e) => setStemRichText(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Hindi Translation (हिन्दी)
            </label>
            <textarea
              rows={2}
              value={stemHindi}
              onChange={(e) => setStemHindi(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-hindi"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              LaTeX Equation (Optional)
            </label>
            <input
              type="text"
              value={stemLatex}
              onChange={(e) => setStemLatex(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as QuestionDifficulty)}
              className="w-full max-w-xs px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
            >
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
        </Card>

        {/* Options */}
        {question.type !== 'NUMERICAL' && (
          <Card className="p-6 bg-white shadow-sm border-slate-200 space-y-4">
            <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
              Options & Correct Answer Selection
            </h2>

            <div className="space-y-3">
              {options.map((opt, idx) => {
                const isCorrect = correctOptionIds.includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                      isCorrect ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200 bg-slate-50/50'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (question.type === 'MULTI_CHOICE') {
                          if (isCorrect) setCorrectOptionIds(correctOptionIds.filter((id) => id !== opt.id));
                          else setCorrectOptionIds([...correctOptionIds, opt.id]);
                        } else {
                          setCorrectOptionIds([opt.id]);
                        }
                      }}
                      className={`mt-1 h-5 w-5 rounded-full flex items-center justify-center border ${
                        isCorrect
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 bg-white hover:border-slate-400'
                      }`}
                    >
                      {isCorrect && <CheckCircle2 className="h-4 w-4" />}
                    </button>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-600">
                          Option {String.fromCharCode(65 + idx)}
                        </span>
                        {isCorrect && (
                          <Badge variant="success" className="text-[10px] px-1.5 py-0">
                            CORRECT ANSWER
                          </Badge>
                        )}
                      </div>
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => {
                          const updated = [...options];
                          updated[idx].text = e.target.value;
                          setOptions(updated);
                        }}
                        className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm bg-white"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Protected Enclave */}
        <Card className="p-6 bg-white shadow-sm border-slate-200 space-y-4">
          <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Solution & Explanation (Protected Keys Enclave)
          </h2>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Detailed Solution (English)
            </label>
            <textarea
              rows={3}
              value={explanationRichText}
              onChange={(e) => setExplanationRichText(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Explanation (Hindi)
            </label>
            <textarea
              rows={2}
              value={explanationHindi}
              onChange={(e) => setExplanationHindi(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-hindi"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </Card>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href="/admin/questions">
            <Button type="button" variant="outline">
              Back to List
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Updates'}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
