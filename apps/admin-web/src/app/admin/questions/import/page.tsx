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
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  RefreshCw,
  Eye,
  Check
} from 'lucide-react';
import { Exam, Subject, BulkImportPreviewResponse } from '@clearexam/contracts';

export default function BulkImportPage() {
  const router = useRouter();
  const { getIdToken } = useAuth();

  // Catalog selectors
  const [exams, setExams] = useState<Exam[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');

  // CSV State
  const [csvContent, setCsvContent] = useState('');
  const [parsing, setParsing] = useState(false);
  const [committing, setCommitting] = useState(false);
  const [previewResult, setPreviewResult] = useState<BulkImportPreviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const res = await fetch(`${apiUrl}/v1/catalog/exams`);
        if (res.ok) {
          const json = await res.json();
          const examList: Exam[] = json.data || [];
          setExams(examList);
          if (examList.length > 0) setSelectedExamId(examList[0].id);
        }
      } catch (err: any) {
        setError('Failed to load exams: ' + err.message);
      }
    };
    fetchExams();
  }, []);

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
          if (subjectList.length > 0) setSelectedSubjectId(subjectList[0].id);
        }
      } catch (err: any) {
        console.error(err);
      }
    };
    fetchSubjects();
  }, [selectedExamId]);

  const handleDownloadTemplate = async () => {
    try {
      const token = await getIdToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const res = await fetch(`${apiUrl}/v1/admin/questions/import/template`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Failed to download template');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'question_import_template.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvContent(content);
      setPreviewResult(null);
    };
    reader.readAsText(file);
  };

  // Basic CSV parser to convert CSV text to object rows
  const parseCsvToRows = (text: string) => {
    const lines = text.trim().split(/\r\n|\n/).filter(line => line.trim().length > 0);
    if (lines.length <= 1) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
    const rows: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      // Regex handling quoted commas
      const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
      const cleaned = matches.map(m => m.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));

      const rowObj: Record<string, string> = {};
      headers.forEach((header, colIdx) => {
        rowObj[header] = cleaned[colIdx] || '';
      });

      rows.push(rowObj);
    }

    return rows;
  };

  const handleValidatePreview = async () => {
    try {
      setError(null);
      if (!selectedExamId || !selectedSubjectId) {
        throw new Error('Please select both Exam and Subject context before validating');
      }

      if (!csvContent.trim()) {
        throw new Error('Please upload a CSV file or paste CSV text');
      }

      setParsing(true);
      const rawRows = parseCsvToRows(csvContent);

      if (rawRows.length === 0) {
        throw new Error('No data rows found in CSV. Please verify formatting.');
      }

      const token = await getIdToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

      const res = await fetch(`${apiUrl}/v1/admin/questions/import/preview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          defaultExamId: selectedExamId,
          defaultSubjectId: selectedSubjectId,
          rows: rawRows
        })
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.message || 'Validation request failed');
      }

      const json = await res.json();
      setPreviewResult(json.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setParsing(false);
    }
  };

  const handleCommit = async () => {
    if (!previewResult || previewResult.validRows.length === 0) return;

    try {
      setCommitting(true);
      setError(null);
      const token = await getIdToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

      const questionsToImport = previewResult.validRows.map(r => r.data);

      const res = await fetch(`${apiUrl}/v1/admin/questions/import/commit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ questions: questionsToImport })
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.message || 'Import failed');
      }

      const json = await res.json();
      alert(`Success! Successfully imported ${json.data.importedCount} questions.`);
      router.push('/admin/questions');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCommitting(false);
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
              Bulk Import Questions
            </h1>
            <p className="text-xs text-slate-500">
              Validate and bulk ingest questions via standardized CSV templates.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={handleDownloadTemplate}
          className="flex items-center gap-1.5 text-xs"
        >
          <Download className="h-4 w-4 text-slate-600" />
          <span>Download CSV Template</span>
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Step 1: Catalog Context */}
      <Card className="p-6 bg-white shadow-sm border-slate-200 space-y-4">
        <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4 text-indigo-600" />
          1. Target Exam & Subject Selection
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Destination Exam *
            </label>
            <select
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
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
              Destination Subject *
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Step 2: Upload or Paste CSV */}
      <Card className="p-6 bg-white shadow-sm border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Upload className="h-4 w-4 text-indigo-600" />
            2. CSV Payload
          </h2>
          <label className="cursor-pointer text-xs font-medium text-indigo-600 hover:text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-lg bg-indigo-50/50">
            Choose CSV File
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            CSV Text Input (or paste directly)
          </label>
          <textarea
            rows={6}
            placeholder={`stemRichText,stemHindi,type,difficulty,optionA,optionB,optionC,optionD,correctOption,explanation,tags\n"What is the capital of India?","भारत की राजधानी क्या है?",SINGLE_CHOICE,EASY,"New Delhi","Mumbai","Kolkata","Chennai",A,"New Delhi is the capital.","geography"`}
            value={csvContent}
            onChange={(e) => {
              setCsvContent(e.target.value);
              setPreviewResult(null);
            }}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleValidatePreview}
            disabled={parsing || !csvContent.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2"
          >
            {parsing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            <span>Validate & Preview</span>
          </Button>
        </div>
      </Card>

      {/* Step 3: Preview & Validation Table */}
      {previewResult && (
        <Card className="p-6 bg-white shadow-sm border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                3. Validation Results
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Total Rows: {previewResult.totalRows} • Valid: {previewResult.validCount} • Errors: {previewResult.invalidCount}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success">{previewResult.validCount} Valid</Badge>
              {previewResult.invalidCount > 0 && (
                <Badge variant="danger">{previewResult.invalidCount} Rejected</Badge>
              )}
            </div>
          </div>

          {/* Errors list */}
          {previewResult.errors.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg space-y-1 text-xs text-red-700">
              <div className="font-bold flex items-center gap-1.5 mb-1">
                <AlertCircle className="h-4 w-4" />
                Row-level Validation Errors:
              </div>
              {previewResult.errors.map((err, idx) => (
                <div key={idx} className="ml-5 list-disc">
                  Row {err.rowIndex} {err.field ? `[${err.field}]` : ''}: {err.message}
                </div>
              ))}
            </div>
          )}

          {/* Valid rows preview table */}
          {previewResult.validRows.length > 0 && (
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="px-3 py-2">Row</th>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2">Question Stem</th>
                    <th className="px-3 py-2">Options</th>
                    <th className="px-3 py-2">Correct Key</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {previewResult.validRows.slice(0, 10).map(({ rowIndex, data }) => (
                    <tr key={rowIndex} className="hover:bg-slate-50/50">
                      <td className="px-3 py-2 font-mono text-slate-400">{rowIndex}</td>
                      <td className="px-3 py-2 font-medium">{data.type}</td>
                      <td className="px-3 py-2 max-w-xs truncate">{data.stemRichText}</td>
                      <td className="px-3 py-2 text-slate-500">{data.options.length} opts</td>
                      <td className="px-3 py-2">
                        <Badge variant="success" className="text-[10px]">
                          {data.correctOptionIds.join(', ')}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {previewResult.validRows.length > 10 && (
                <div className="p-2 text-center text-xs text-slate-400 bg-slate-50 border-t border-slate-100">
                  + {previewResult.validRows.length - 10} more rows validated
                </div>
              )}
            </div>
          )}

          {/* Commit button */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              type="button"
              disabled={committing || previewResult.validRows.length === 0}
              onClick={handleCommit}
              className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              <span>
                {committing
                  ? 'Importing into Database...'
                  : `Commit Import (${previewResult.validCount} Questions)`}
              </span>
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
