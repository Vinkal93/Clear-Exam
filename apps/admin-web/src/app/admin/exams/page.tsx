'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus, RefreshCw, Search, ArrowRight, AlertCircle, FileText } from 'lucide-react';
import { Exam, ExamCategory } from '@clearexam/contracts';

export default function ExamsPage() {
  const { getIdToken } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [categories, setCategories] = useState<ExamCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [title, setTitle] = useState('');
  const [titleHindi, setTitleHindi] = useState('');
  const [code, setCode] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [conductingBody, setConductingBody] = useState('NTA');
  const [durationMinutesDefault, setDurationMinutesDefault] = useState(180);
  const [totalQuestionsDefault, setTotalQuestionsDefault] = useState(90);
  const [isPublished, setIsPublished] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const token = await getIdToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const res = await fetch(`${apiUrl}/v1/admin/catalog/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setCategories(json.data || []);
        if (json.data?.length > 0 && !categoryId) {
          setCategoryId(json.data[0].id);
        }
      }
    } catch {
      // Handled in main error
    }
  };

  const fetchExams = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getIdToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const query = selectedCategory !== 'ALL' ? `?categoryId=${selectedCategory}` : '';

      const res = await fetch(`${apiUrl}/v1/admin/catalog/exams${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error(`Failed to load exams (HTTP ${res.status})`);
      }

      const json = await res.json();
      setExams(json.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchExams();
  }, [selectedCategory]);

  const handleSlugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
      alert('Please select a parent category first.');
      return;
    }

    try {
      setActionLoading(true);
      const token = await getIdToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

      const res = await fetch(`${apiUrl}/v1/admin/catalog/exams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          categoryId,
          title,
          titleHindi: titleHindi || undefined,
          code: code.toUpperCase(),
          slug,
          shortDescription,
          conductingBody: conductingBody || undefined,
          durationMinutesDefault: Number(durationMinutesDefault),
          totalQuestionsDefault: Number(totalQuestionsDefault),
          isPublished
        })
      });

      if (!res.ok) {
        const errorJson = await res.json();
        throw new Error(errorJson.message || 'Failed to create exam');
      }

      setModalOpen(false);
      setTitle('');
      setTitleHindi('');
      setCode('');
      setSlug('');
      setShortDescription('');
      await fetchExams();
    } catch (err: any) {
      alert(`Error creating exam: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const togglePublish = async (exam: Exam) => {
    try {
      const token = await getIdToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

      const res = await fetch(`${apiUrl}/v1/admin/catalog/exams/${exam.id}/publish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isPublished: !exam.isPublished })
      });

      if (!res.ok) {
        throw new Error('Failed to toggle status');
      }

      await fetchExams();
    } catch (err: any) {
      alert(`Update failed: ${err.message}`);
    }
  };

  const filtered = exams.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.code.toLowerCase().includes(search.toLowerCase()) ||
      (e.titleHindi && e.titleHindi.includes(search))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Exams & Competitive Tests</h1>
          <p className="text-slate-600 text-sm mt-1">
            Configure dynamic exams, papers, conducting bodies, and default question counts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => setModalOpen(true)} className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add Exam
          </Button>
          <button
            onClick={fetchExams}
            title="Refresh"
            className="p-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exam by title, code (e.g. JEE_MAIN)..."
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="ALL">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <Card className="border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-semibold text-amber-900 text-sm">Notice</h4>
              <p className="text-xs text-amber-800 mt-1">{error}</p>
            </div>
          </div>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="text-center py-12">
          <BookOpen className="h-10 w-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900">No Exams Configured</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Zero hardcoded data. Create your first dynamic exam (e.g., JEE Main, NEET-UG, UPSC Prelims, SSC CGL) using the button above.
          </p>
        </Card>
      ) : (
        <div className="bg-white rounded-card border border-neutral-border overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold text-left">
              <tr>
                <th className="px-6 py-3">Exam Name & Code</th>
                <th className="px-6 py-3">Conducting Body</th>
                <th className="px-6 py-3">Duration / Questions</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {filtered.map((exam) => (
                <tr key={exam.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{exam.title}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-semibold">
                        {exam.code}
                      </span>
                      {exam.titleHindi && (
                        <span className="text-xs text-slate-500">{exam.titleHindi}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-xs text-slate-600">
                    {exam.conductingBody || 'General'}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600">
                    <div>{exam.durationMinutesDefault} mins</div>
                    <div className="text-slate-400">{exam.totalQuestionsDefault} questions</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={exam.isPublished ? 'success' : 'warning'}>
                      {exam.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link href={`/admin/exams/${exam.id}/syllabus`}>
                      <Button size="sm" variant="outline" className="text-xs gap-1">
                        <FileText className="h-3.5 w-3.5" />
                        Syllabus
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => togglePublish(exam)}
                      className="text-xs"
                    >
                      {exam.isPublished ? 'Unpublish' : 'Publish'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Exam Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-card border border-slate-200 max-w-xl w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-lg text-slate-900">Add New Competitive Exam</h3>

            <form onSubmit={handleCreateExam} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Parent Category *
                </label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Exam Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!slug) setSlug(handleSlugify(e.target.value));
                    }}
                    placeholder="e.g. JEE Main"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Exam Title (Hindi)
                  </label>
                  <input
                    type="text"
                    value={titleHindi}
                    onChange={(e) => setTitleHindi(e.target.value)}
                    placeholder="उदा. जेईई मेन"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Exam Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. JEE_MAIN"
                    className="w-full px-3 py-2 font-mono text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(handleSlugify(e.target.value))}
                    placeholder="jee-main"
                    className="w-full px-3 py-2 font-mono text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Conducting Body
                  </label>
                  <input
                    type="text"
                    value={conductingBody}
                    onChange={(e) => setConductingBody(e.target.value)}
                    placeholder="e.g. NTA, UPSC"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    value={durationMinutesDefault}
                    onChange={(e) => setDurationMinutesDefault(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Default Questions
                  </label>
                  <input
                    type="number"
                    value={totalQuestionsDefault}
                    onChange={(e) => setTotalQuestionsDefault(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Short Description *
                </label>
                <textarea
                  required
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Overview of the examination..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center">
                <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                  Publish immediately to student app
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                  disabled={actionLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={actionLoading}>
                  {actionLoading ? 'Creating...' : 'Create Exam'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
