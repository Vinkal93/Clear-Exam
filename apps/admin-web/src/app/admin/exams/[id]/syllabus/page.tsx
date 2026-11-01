'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Plus,
  ArrowLeft,
  ChevronRight,
  FolderOpen,
  BookOpen,
  Layers,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { Subject, Chapter, Exam } from '@clearexam/contracts';

interface SubjectWithChapters extends Subject {
  chapters?: Chapter[];
}

export default function ExamSyllabusPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { getIdToken } = useAuth();

  const [exam, setExam] = useState<Exam | null>(null);
  const [subjects, setSubjects] = useState<SubjectWithChapters[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Subject Modal State
  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [subjectTitle, setSubjectTitle] = useState('');
  const [subjectTitleHindi, setSubjectTitleHindi] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [subjectOrder, setSubjectOrder] = useState(1);

  // Chapter Modal State
  const [chapterModalOpen, setChapterModalOpen] = useState(false);
  const [targetSubjectId, setTargetSubjectId] = useState<string>('');
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterTitleHindi, setChapterTitleHindi] = useState('');
  const [chapterOrder, setChapterOrder] = useState(1);

  const [actionLoading, setActionLoading] = useState(false);

  const fetchExamAndHierarchy = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getIdToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

      // 1. Fetch Exam Details
      const examRes = await fetch(`${apiUrl}/v1/catalog/exams/${id}`);
      if (examRes.ok) {
        const json = await examRes.json();
        setExam(json.data);
      }

      // 2. Fetch Subjects & Chapters
      const subRes = await fetch(`${apiUrl}/v1/catalog/exams/${id}/subjects`);
      if (subRes.ok) {
        const json = await subRes.json();
        setSubjects(json.data || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExamAndHierarchy();
  }, [id]);

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const token = await getIdToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

      const res = await fetch(`${apiUrl}/v1/admin/catalog/subjects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          examId: id,
          title: subjectTitle,
          titleHindi: subjectTitleHindi || undefined,
          code: subjectCode.toUpperCase(),
          displayOrder: Number(subjectOrder),
          isPublished: true
        })
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.message || 'Failed to create subject');
      }

      setSubjectModalOpen(false);
      setSubjectTitle('');
      setSubjectTitleHindi('');
      setSubjectCode('');
      await fetchExamAndHierarchy();
    } catch (err: any) {
      alert(`Subject error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const token = await getIdToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

      const res = await fetch(`${apiUrl}/v1/admin/catalog/chapters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          examId: id,
          subjectId: targetSubjectId,
          title: chapterTitle,
          titleHindi: chapterTitleHindi || undefined,
          displayOrder: Number(chapterOrder),
          isPublished: true
        })
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.message || 'Failed to create chapter');
      }

      setChapterModalOpen(false);
      setChapterTitle('');
      setChapterTitleHindi('');
      await fetchExamAndHierarchy();
    } catch (err: any) {
      alert(`Chapter error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link href="/admin/exams">
          <button className="p-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </button>
        </Link>
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase">
            <span>Exams</span>
            <ChevronRight className="h-3 w-3" />
            <span>Syllabus Taxonomy</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {exam ? `${exam.title} (${exam.code})` : 'Exam Syllabus'}
          </h1>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-slate-600 text-sm">
          Structure Papers/Subjects and Chapter/Topic hierarchy for this exam.
        </p>
        <div className="flex items-center gap-2">
          <Button onClick={() => setSubjectModalOpen(true)} className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add Subject / Paper
          </Button>
          <button
            onClick={fetchExamAndHierarchy}
            title="Refresh"
            className="p-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {subjects.length === 0 ? (
        <Card className="text-center py-12">
          <Layers className="h-10 w-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900">No Subjects or Papers Configured</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Zero hardcoded syllabus. Add subjects (e.g., Physics, Chemistry, Mathematics, General Studies) using the button above.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {subjects.map((sub) => (
            <Card key={sub.id} className="p-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-base">{sub.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-semibold">{sub.code}</span>
                      {sub.titleHindi && <span>• {sub.titleHindi}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs gap-1"
                    onClick={() => {
                      setTargetSubjectId(sub.id);
                      setChapterModalOpen(true);
                    }}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Chapter
                  </Button>
                </div>
              </div>

              {/* Chapters List */}
              <div className="pt-3">
                {!sub.chapters || sub.chapters.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">
                    No chapters added yet to this subject.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {sub.chapters.map((ch, idx) => (
                      <div
                        key={ch.id}
                        className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50/60 text-xs text-slate-800"
                      >
                        <span className="font-bold text-slate-400">{(idx + 1).toString().padStart(2, '0')}.</span>
                        <div className="truncate flex-1">
                          <span className="font-medium">{ch.title}</span>
                          {ch.titleHindi && (
                            <span className="block text-[10px] text-slate-500 truncate">{ch.titleHindi}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Subject Modal */}
      {subjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-card border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-lg text-slate-900">Add Subject / Paper</h3>
            <form onSubmit={handleAddSubject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Subject Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={subjectTitle}
                  onChange={(e) => setSubjectTitle(e.target.value)}
                  placeholder="e.g. Physics"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Subject Title (Hindi)
                </label>
                <input
                  type="text"
                  value={subjectTitleHindi}
                  onChange={(e) => setSubjectTitleHindi(e.target.value)}
                  placeholder="उदा. भौतिक विज्ञान"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Subject Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value.toUpperCase())}
                    placeholder="PHY"
                    className="w-full px-3 py-2 font-mono text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={subjectOrder}
                    onChange={(e) => setSubjectOrder(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSubjectModalOpen(false)}
                  disabled={actionLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={actionLoading}>
                  {actionLoading ? 'Saving...' : 'Add Subject'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Chapter Modal */}
      {chapterModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-card border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-lg text-slate-900">Add Chapter / Topic</h3>
            <form onSubmit={handleAddChapter} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Chapter Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={chapterTitle}
                  onChange={(e) => setChapterTitle(e.target.value)}
                  placeholder="e.g. Thermodynamics"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Chapter Title (Hindi)
                </label>
                <input
                  type="text"
                  value={chapterTitleHindi}
                  onChange={(e) => setChapterTitleHindi(e.target.value)}
                  placeholder="उदा. ऊष्मागतिकी"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Order Index
                </label>
                <input
                  type="number"
                  value={chapterOrder}
                  onChange={(e) => setChapterOrder(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setChapterModalOpen(false)}
                  disabled={actionLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={actionLoading}>
                  {actionLoading ? 'Saving...' : 'Add Chapter'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
