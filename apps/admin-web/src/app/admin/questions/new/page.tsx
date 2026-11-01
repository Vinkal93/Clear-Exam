'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import {
  QuestionType,
  QuestionDifficulty,
  QuestionOption,
  Exam,
  Subject
} from '@clearexam/contracts';

export default function AuthorQuestionPage() {
  const router = useRouter();
  const { getIdToken } = useAuth();

  // Catalog selectors
  const [exams, setExams] = useState<Exam[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');

  // Form states
  const [type, setType] = useState<QuestionType>('SINGLE_CHOICE');
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>('MEDIUM');
  const [stemRichText, setStemRichText] = useState('');
  const [stemHindi, setStemHindi] = useState('');
  const [stemLatex, setStemLatex] = useState('');

  // Options
  const [options, setOptions] = useState<QuestionOption[]>([
    { id: 'opt_1', text: '' },
    { id: 'opt_2', text: '' },
    { id: 'opt_3', text: '' },
    { id: 'opt_4', text: '' }
  ]);
  const [correctOptionIds, setCorrectOptionIds] = useState<string[]>(['opt_1']);

  // Numerical Tolerance
  const [numValue, setNumValue] = useState<number>(0);
  const [numMin, setNumMin] = useState<number>(0);
  const [numMax, setNumMax] = useState<number>(0);

  // Solution Enclave
  const [explanationRichText, setExplanationRichText] = useState('');
  const [explanationHindi, setExplanationHindi] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch exams on mount
  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const res = await fetch(`${apiUrl}/v1/catalog/exams`);
        if (res.ok) {
          const json = await res.json();
          const examList: Exam[] = json.data || [];
          setExams(examList);
          if (examList.length > 0) {
            setSelectedExamId(examList[0].id);
          }
        }
      } catch (err: any) {
        setError('Failed to load exams: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  // Fetch subjects when selectedExamId changes
  useEffect(() => {
    if (!selectedExamId) {
      setSubjects([]);
      return;
    }
    const fetchSubjects = async () => {
      try {
        const token = await getIdToken();
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const res = await fetch(`${apiUrl}/v1/admin/catalog/exams/${selectedExamId}/subjects`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const json = await res.json();
          const subjectList: Subject[] = json.data || [];
          setSubjects(subjectList);
          if (subjectList.length > 0) {
            setSelectedSubjectId(subjectList[0].id);
          } else {
            setSelectedSubjectId('');
          }
        }
      } catch (err: any) {
        console.error(err);
      }
    };
    fetchSubjects();
  }, [selectedExamId]);

  // Adjust defaults when Question Type changes
  const handleTypeChange = (newType: QuestionType) => {
    setType(newType);
    if (newType === 'TRUE_FALSE') {
      const tfOptions = [
        { id: 'opt_true', text: 'True', textHindi: 'सत्य' },
        { id: 'opt_false', text: 'False', textHindi: 'असत्य' }
      ];
      setOptions(tfOptions);
      setCorrectOptionIds(['opt_true']);
    } else if (newType === 'ASSERTION_REASON') {
      const arOptions = [
        { id: 'opt_1', text: 'Both A and R are true and R is the correct explanation of A' },
        { id: 'opt_2', text: 'Both A and R are true but R is NOT the correct explanation of A' },
        { id: 'opt_3', text: 'A is true but R is false' },
        { id: 'opt_4', text: 'A is false but R is true' }
      ];
      setOptions(arOptions);
      setCorrectOptionIds(['opt_1']);
    } else if (newType === 'NUMERICAL') {
      setOptions([]);
      setCorrectOptionIds([]);
    } else {
      if (options.length < 2) {
        setOptions([
          { id: 'opt_1', text: '' },
          { id: 'opt_2', text: '' },
          { id: 'opt_3', text: '' },
          { id: 'opt_4', text: '' }
        ]);
        setCorrectOptionIds(['opt_1']);
      }
    }
  };

  const handleAddOption = () => {
    const nextId = `opt_${Date.now()}`;
    setOptions([...options, { id: nextId, text: '' }]);
  };

  const handleRemoveOption = (id: string) => {
    if (options.length <= 2) {
      alert('A question must have at least 2 options.');
      return;
    }
    setOptions(options.filter((o) => o.id !== id));
    setCorrectOptionIds(correctOptionIds.filter((cid) => cid !== id));
  };

  const handleToggleCorrectOption = (id: string) => {
    if (type === 'SINGLE_CHOICE' || type === 'TRUE_FALSE' || type === 'ASSERTION_REASON') {
      setCorrectOptionIds([id]);
    } else if (type === 'MULTI_CHOICE') {
      if (correctOptionIds.includes(id)) {
        if (correctOptionIds.length === 1) {
          alert('At least one option must be selected as correct.');
          return;
        }
        setCorrectOptionIds(correctOptionIds.filter((cid) => cid !== id));
      } else {
        setCorrectOptionIds([...correctOptionIds, id]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedExamId || !selectedSubjectId) {
      setError('Please select both an Exam and a Subject.');
      return;
    }

    if (stemRichText.trim().length < 3) {
      setError('Question text must be at least 3 characters long.');
      return;
    }

    if (type !== 'NUMERICAL') {
      if (options.length < 2) {
        setError('At least 2 options are required.');
        return;
      }
      for (let i = 0; i < options.length; i++) {
        if (!options[i].text.trim()) {
          setError(`Option ${i + 1} text cannot be empty.`);
          return;
        }
      }
      if (correctOptionIds.length === 0) {
        setError('Please designate at least one correct option.');
        return;
      }
    }

    try {
      setSubmitting(true);
      const token = await getIdToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

      const payload = {
        examId: selectedExamId,
        subjectId: selectedSubjectId,
        type,
        difficulty,
        stemRichText: stemRichText.trim(),
        stemHindi: stemHindi.trim() || undefined,
        stemLatex: stemLatex.trim() || null,
        options: type === 'NUMERICAL' ? [] : options,
        correctOptionIds: type === 'NUMERICAL' ? [] : correctOptionIds,
        numericalTolerance:
          type === 'NUMERICAL'
            ? { value: Number(numValue), min: Number(numMin), max: Number(numMax) }
            : null,
        explanationRichText: explanationRichText.trim(),
        explanationHindi: explanationHindi.trim() || undefined,
        tags: tagsInput
          ? tagsInput.split(',').map((t) => t.trim()).filter(Boolean)
          : []
      };

      const res = await fetch(`${apiUrl}/v1/admin/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorJson = await res.json();
        throw new Error(errorJson.message || 'Failed to save question');
      }

      router.push('/admin/questions');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/questions">
            <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-lg">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Author Question
            </h1>
            <p className="text-xs text-slate-500">
              Create an authoritative versioned question with isolated answer enclave.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Classification & Context */}
        <Card className="p-6 bg-white shadow-sm border-slate-200 space-y-4">
          <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-indigo-600" />
            1. Classification & Scope
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Exam *
              </label>
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {exams.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.title} ({ex.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Subject *
              </label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {subjects.length === 0 ? (
                  <option value="">No subjects found for exam</option>
                ) : (
                  subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Question Type *
              </label>
              <select
                value={type}
                onChange={(e) => handleTypeChange(e.target.value as QuestionType)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="SINGLE_CHOICE">Single Choice (MCQ)</option>
                <option value="MULTI_CHOICE">Multiple Choice (Multiple Correct)</option>
                <option value="TRUE_FALSE">True / False</option>
                <option value="ASSERTION_REASON">Assertion & Reason</option>
                <option value="NUMERICAL">Numerical Answer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Difficulty Level *
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as QuestionDifficulty)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Section 2: Question Stem */}
        <Card className="p-6 bg-white shadow-sm border-slate-200 space-y-4">
          <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-indigo-600" />
            2. Question Content (Stem)
          </h2>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Stem (English) *
            </label>
            <textarea
              rows={3}
              placeholder="Enter the complete question problem statement in English..."
              value={stemRichText}
              onChange={(e) => setStemRichText(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Stem (Hindi / हिन्दी) — Optional
            </label>
            <textarea
              rows={2}
              placeholder="प्रश्न का हिन्दी अनुवाद दर्ज करें..."
              value={stemHindi}
              onChange={(e) => setStemHindi(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-hindi"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              LaTeX Equation / Math Formulation (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. \int_{0}^{\pi} \sin(x) dx"
              value={stemLatex}
              onChange={(e) => setStemLatex(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {stemLatex && (
              <div className="mt-2 p-2.5 rounded bg-slate-50 border border-slate-200 font-mono text-xs text-indigo-600">
                Preview formula: {stemLatex}
              </div>
            )}
          </div>
        </Card>

        {/* Section 3: Options / Numerical Input */}
        <Card className="p-6 bg-white shadow-sm border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-indigo-600" />
              3. Answer Options & Key Marking
            </h2>
            {type !== 'NUMERICAL' && type !== 'TRUE_FALSE' && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddOption}
                className="flex items-center gap-1 text-xs"
              >
                <Plus className="h-3 w-3" />
                Add Option
              </Button>
            )}
          </div>

          {type === 'NUMERICAL' ? (
            <div className="p-4 rounded-lg bg-indigo-50/50 border border-indigo-100 space-y-3">
              <div className="text-xs text-indigo-900 font-medium">
                Numerical Tolerances & Correct Value
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Exact Value</label>
                  <input
                    type="number"
                    step="any"
                    value={numValue}
                    onChange={(e) => setNumValue(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Min Acceptable</label>
                  <input
                    type="number"
                    step="any"
                    value={numMin}
                    onChange={(e) => setNumMin(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Max Acceptable</label>
                  <input
                    type="number"
                    step="any"
                    value={numMax}
                    onChange={(e) => setNumMax(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm bg-white"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Click the indicator on the left of each option to mark it as the correct answer.
              </p>
              {options.map((opt, idx) => {
                const isCorrect = correctOptionIds.includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                      isCorrect
                        ? 'border-emerald-500 bg-emerald-50/30'
                        : 'border-slate-200 bg-slate-50/50'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleCorrectOption(opt.id)}
                      className={`mt-1 flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center border transition-colors ${
                        isCorrect
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                          : 'border-slate-300 bg-white hover:border-slate-400'
                      }`}
                      title={isCorrect ? 'Marked as Correct' : 'Click to mark as correct'}
                    >
                      {isCorrect && <CheckCircle2 className="h-4 w-4" />}
                    </button>

                    <div className="flex-1 space-y-2">
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
                        placeholder={`Option ${String.fromCharCode(65 + idx)} text in English...`}
                        value={opt.text}
                        onChange={(e) => {
                          const updated = [...options];
                          updated[idx].text = e.target.value;
                          setOptions(updated);
                        }}
                        required
                        className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    {options.length > 2 && type !== 'TRUE_FALSE' && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(opt.id)}
                        className="mt-1 text-slate-400 hover:text-red-500 p-1"
                        title="Remove option"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Section 4: Explanation & Protected Enclave */}
        <Card className="p-6 bg-white shadow-sm border-slate-200 space-y-4">
          <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            4. Solution & Explanation (Protected Enclave)
          </h2>
          <p className="text-xs text-slate-500">
            Stored securely in the isolated keys enclave. Never sent to students during active tests.
          </p>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Detailed Solution / Explanation (English)
            </label>
            <textarea
              rows={3}
              placeholder="Step-by-step mathematical or conceptual explanation..."
              value={explanationRichText}
              onChange={(e) => setExplanationRichText(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Explanation (Hindi / हिन्दी) — Optional
            </label>
            <textarea
              rows={2}
              placeholder="हिन्दी व्याख्या दर्ज करें..."
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
              placeholder="e.g. pyq-2024, optics, jee-main, high-weightage"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href="/admin/questions">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={submitting}
            className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            <span>{submitting ? 'Saving Question...' : 'Save as Draft'}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
