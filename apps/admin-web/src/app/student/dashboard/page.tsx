'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  BookOpen,
  Search,
  Bell,
  SlidersHorizontal,
  Flame,
  Calendar,
  ChevronRight,
  Play,
  Award,
  Clock,
  Target,
  CheckCircle,
  Sparkles,
  Download,
  School,
  Plus,
  Home,
  Compass,
  FileText,
  BarChart2,
  User,
  ArrowRight,
  Shield,
  Layers,
  HelpCircle,
  Crown
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function StudentDashboardPage() {
  const { user, role } = useAuth();
  const [viewMode, setViewMode] = useState<'both' | 'desktop' | 'mobile'>('both');

  // Dynamic Data Bindings
  const userName = user?.displayName || user?.email?.split('@')[0] || 'Vinkal';
  const greeting = 'Good Morning';
  const selectedExamName = 'CCC & O Level';
  const currentStreak = 5;
  const todayDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  const subscriptionPlan = role === 'SUPER_ADMIN' ? 'Super Admin' : 'Free Plan';
  const testsTaken = 48;
  const averageScore = 72;
  const bestScore = 92;
  const studyHours = 18.5;
  const continueCourseTitle = 'CCC - Introduction to Computer';
  const continueSubtitle = 'Chapter 3 • Operating System Concepts';
  const continueProgressPercent = 60;

  return (
    <div className="min-h-screen bg-slate-100 p-3 sm:p-6 space-y-6">
      
      {/* Top Floating Control Bar */}
      <div className="max-w-7xl mx-auto bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900 leading-tight">
                ClearExam Student Dashboard Experience
              </h1>
              <Badge variant="success" className="text-[10px] uppercase">Production UI</Badge>
            </div>
            <p className="text-xs text-slate-500">
              Interactive dual viewport preview • Mobile Native + Desktop Portal
            </p>
          </div>
        </div>

        {/* Viewport Mode Switcher & Admin Switch */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setViewMode('both')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'both' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📱💻 Side-by-Side
            </button>
            <button
              onClick={() => setViewMode('desktop')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'desktop' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              💻 Desktop View
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'mobile' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📱 Mobile App
            </button>
          </div>

          <Link href="/">
            <Button variant="outline" size="sm" className="text-xs flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-indigo-600" />
              <span>Back to Super Admin</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-[1550px] mx-auto flex flex-col xl:flex-row items-start justify-center gap-8">
        
        {/* ========================================================= */}
        {/* 1. MOBILE NATIVE APP VIEW (Matches Android App Spec)      */}
        {/* ========================================================= */}
        {(viewMode === 'both' || viewMode === 'mobile') && (
          <div className="w-full max-w-[390px] mx-auto flex-shrink-0 transition-all duration-300">
            <div className="text-center mb-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Mobile View (Android Compose)
              </span>
            </div>

            {/* Phone Bezel */}
            <div className="w-full bg-[#F8FAFC] border-[8px] border-slate-900 rounded-[44px] shadow-2xl overflow-hidden relative flex flex-col h-[820px]">
              
              {/* Notch & Status Bar */}
              <div className="pt-3 px-6 pb-2 flex justify-between items-center text-[12px] font-semibold text-slate-900 select-none bg-white">
                <span>9:41</span>
                <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto"></div>
                <div className="flex items-center gap-1.5 text-xs">
                  <span>5G</span>
                  <div className="w-5 h-2.5 border border-slate-900 rounded-xs p-0.5 flex items-center">
                    <div className="w-full h-full bg-slate-900 rounded-2xs"></div>
                  </div>
                </div>
              </div>

              {/* Scrollable Mobile Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
                
                {/* 1. Top App Bar */}
                <div className="flex items-center justify-between bg-white p-3 rounded-2xl shadow-xs border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <span className="font-black text-base tracking-tight text-slate-900">
                      Clear<span className="text-blue-600">Exam</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100">
                      <Bell className="w-5 h-5" />
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                    </button>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-blue-100 shadow-xs">
                      {userName.substring(0, 2).toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Greeting */}
                <div className="px-1">
                  <h2 className="text-lg font-bold text-slate-900 leading-snug">
                    {greeting}, <span className="text-blue-600">{userName}</span> 👋
                  </h2>
                  <p className="text-xs text-slate-500">Keep learning, keep growing!</p>
                </div>

                {/* 2. Global Search Bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search exams, subjects, tests..."
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>
                  <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 shadow-2xs">
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                </div>

                {/* 3. Hero Active Course Card */}
                <div className="bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 p-4 rounded-2xl text-white shadow-md shadow-blue-500/20 relative overflow-hidden">
                  <div className="relative z-10 space-y-1.5 max-w-[70%]">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md">
                      Current Focus
                    </span>
                    <h3 className="text-base font-extrabold leading-tight">Prepare for {selectedExamName}</h3>
                    <p className="text-[11px] text-blue-100">Mock Tests • Practice • PYQs All in One Place</p>
                    <div className="pt-2">
                      <button className="bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold px-3.5 py-1.5 rounded-lg shadow-sm transition-all flex items-center gap-1.5">
                        <span>Start Practice</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="absolute -right-3 -bottom-3 w-28 h-28 opacity-90 pointer-events-none">
                    <svg viewBox="0 0 200 200" fill="none" className="w-full h-full drop-shadow-lg">
                      <path d="M100 30L20 70L100 110L180 70L100 30Z" fill="#F8FAFC"/>
                      <path d="M40 85V130C40 155 100 170 100 170C100 170 160 155 160 130V85L100 118L40 85Z" fill="#E2E8F0"/>
                      <circle cx="100" cy="115" r="28" fill="#60A5FA"/>
                    </svg>
                  </div>
                </div>

                {/* 4. Quick Actions 4x1 Grid */}
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs hover:border-blue-200 transition-colors">
                    <div className="w-9 h-9 mx-auto rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-1">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700 block leading-tight">Mock Test</span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs hover:border-purple-200 transition-colors">
                    <div className="w-9 h-9 mx-auto rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-1">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700 block leading-tight">Chapter Practice</span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs hover:border-amber-200 transition-colors">
                    <div className="w-9 h-9 mx-auto rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-1">
                      <Flame className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700 block leading-tight">Daily Quiz</span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs hover:border-emerald-200 transition-colors">
                    <div className="w-9 h-9 mx-auto rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700 block leading-tight">PYQ Bank</span>
                  </div>
                </div>

                {/* 5. My Exams Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">My Exams</h3>
                    <a href="#" className="text-[11px] font-bold text-blue-600 hover:underline">See All →</a>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-lg">💻</span>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{continueProgressPercent}%</span>
                      </div>
                      <div className="font-bold text-xs text-slate-900 leading-snug">CCC Exam</div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-lg">🎓</span>
                        <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">28%</span>
                      </div>
                      <div className="font-bold text-xs text-slate-900 leading-snug">O Level IT</div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-purple-600 h-full rounded-full" style={{ width: '28%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6. Continue Learning Card */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Continue Learning</h3>
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs text-slate-900 truncate">{continueCourseTitle}</div>
                        <div className="text-[11px] text-slate-500 truncate">{continueSubtitle}</div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full" style={{ width: `${continueProgressPercent}%` }}></div>
                        </div>
                      </div>
                    </div>
                    <button className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center flex-shrink-0 shadow-sm shadow-blue-500/30">
                      <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
                    </button>
                  </div>
                </div>

                {/* 7. Go Premium Banner */}
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-3 rounded-2xl text-white shadow-sm flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Crown className="w-5 h-5 text-amber-100" />
                    <div>
                      <div className="font-extrabold text-xs">ClearExam Premium</div>
                      <div className="text-[10px] text-amber-100">Ad-Free • Unlimited Mocks • Analytics</div>
                    </div>
                  </div>
                  <button className="bg-white text-amber-700 font-bold text-[11px] px-2.5 py-1.5 rounded-lg shadow-xs hover:bg-amber-50 whitespace-nowrap">
                    Go Premium
                  </button>
                </div>

              </div>

              {/* Mobile Bottom Navigation */}
              <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-2.5 flex justify-between items-center z-20">
                <button className="flex flex-col items-center gap-0.5 text-blue-600 font-bold">
                  <Home className="w-5 h-5" />
                  <span className="text-[10px]">Home</span>
                </button>
                <button className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-700">
                  <Compass className="w-5 h-5" />
                  <span className="text-[10px]">Explore</span>
                </button>
                <button className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-700">
                  <BookOpen className="w-5 h-5" />
                  <span className="text-[10px]">Practice</span>
                </button>
                <button className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-700">
                  <BarChart2 className="w-5 h-5" />
                  <span className="text-[10px]">History</span>
                </button>
                <button className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-700">
                  <User className="w-5 h-5" />
                  <span className="text-[10px]">Profile</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. DESKTOP / WEB DASHBOARD VIEW                           */}
        {/* ========================================================= */}
        {(viewMode === 'both' || viewMode === 'desktop') && (
          <div className="flex-1 min-w-[760px] max-w-[1100px] w-full transition-all duration-300">
            <div className="text-center mb-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span> Desktop Web Portal (Next.js 15)
              </span>
            </div>

            {/* Desktop Frame */}
            <div className="bg-[#F8FAFC] border-[6px] border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[820px]">
              
              {/* Browser Address Bar */}
              <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                </div>
                <div className="bg-slate-800 text-slate-400 px-8 py-1 rounded-md text-[11px] font-mono">
                  https://app.clearexam.in/student/dashboard
                </div>
                <div className="text-slate-400 text-[11px]">Control Plane Connected</div>
              </div>

              {/* Desktop Portal Body */}
              <div className="flex-1 flex overflow-hidden">
                
                {/* Desktop Left Sidebar */}
                <aside className="w-56 bg-slate-900 text-slate-300 flex flex-col justify-between p-4 border-r border-slate-800 select-none flex-shrink-0">
                  <div className="space-y-6">
                    <div className="flex items-center gap-2.5 px-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm shadow-blue-500/30">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <span className="font-extrabold text-base tracking-tight text-white">
                        Clear<span className="text-blue-400">Exam</span>
                      </span>
                    </div>

                    <nav className="space-y-1">
                      <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-sm">
                        <Home className="w-4 h-4" />
                        <span>Dashboard</span>
                      </a>
                      <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 font-medium text-xs transition-colors">
                        <Compass className="w-4 h-4" />
                        <span>Explore</span>
                      </a>
                      <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 font-medium text-xs transition-colors">
                        <BookOpen className="w-4 h-4" />
                        <span>Practice</span>
                      </a>
                      <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 font-medium text-xs transition-colors">
                        <FileText className="w-4 h-4" />
                        <span>Mock Tests</span>
                      </a>
                      <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 font-medium text-xs transition-colors">
                        <Layers className="w-4 h-4" />
                        <span>Test Series</span>
                      </a>
                      <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 font-medium text-xs transition-colors">
                        <Clock className="w-4 h-4" />
                        <span>History</span>
                      </a>
                      <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 font-medium text-xs transition-colors">
                        <Target className="w-4 h-4" />
                        <span>Saved</span>
                      </a>
                    </nav>
                  </div>

                  <div className="bg-gradient-to-tr from-amber-500/20 to-amber-600/20 border border-amber-500/30 p-3 rounded-2xl text-center">
                    <Crown className="w-5 h-5 mx-auto text-amber-400 mb-1" />
                    <div className="text-xs font-bold text-amber-300">Go Premium</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Unlock All Mock Series</div>
                    <button className="mt-2 w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] rounded-lg">
                      View Plans
                    </button>
                  </div>
                </aside>

                {/* Desktop Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  
                  {/* Top Bar */}
                  <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-4 flex-shrink-0">
                    <div className="flex-1 max-w-md relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Search exams, subjects, test series..."
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <button className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                      </button>
                      <div className="h-8 w-px bg-slate-200"></div>
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-blue-100 shadow-xs">
                          {userName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 leading-tight">{userName}</div>
                          <div className="text-[10px] text-slate-500 font-medium">{subscriptionPlan}</div>
                        </div>
                      </div>
                    </div>
                  </header>

                  {/* Main Grid View */}
                  <main className="flex-1 overflow-y-auto p-6 space-y-6">
                    
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                          {greeting}, <span className="text-blue-600">{userName}</span> 👋
                        </h2>
                        <p className="text-xs text-slate-500">Here's your learning summary and practice targets for today.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl shadow-2xs">
                          <Flame className="w-4 h-4 text-amber-500" /> {currentStreak} Day Streak
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
                          <Calendar className="w-4 h-4 text-slate-400" /> {todayDate}
                        </span>
                      </div>
                    </div>

                    {/* 12-Column Layout */}
                    <div className="grid grid-cols-12 gap-6">
                      
                      {/* Left 8 Cols */}
                      <div className="col-span-12 lg:col-span-8 space-y-6">
                        
                        {/* Highlight Panel */}
                        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-md relative overflow-hidden flex items-center justify-between">
                          <div className="space-y-2 max-w-[65%] z-10">
                            <span className="inline-block text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-md">
                              Comprehensive Prep
                            </span>
                            <h3 className="text-xl font-extrabold leading-tight">Practice • Analyse • Improve</h3>
                            <p className="text-xs text-blue-100 leading-relaxed">
                              Master your upcoming exams with timed CBT mock engines, AI personalized recommendations, and official PYQs.
                            </p>
                            <div className="pt-2">
                              <button className="bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-all flex items-center gap-2">
                                <span>Start Practice</span>
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="w-36 h-36 flex-shrink-0 z-0 opacity-90">
                            <svg viewBox="0 0 200 200" fill="none" className="w-full h-full drop-shadow-md">
                              <rect x="25" y="45" width="150" height="100" rx="10" fill="#F8FAFC"/>
                              <rect x="35" y="55" width="130" height="80" rx="6" fill="#E2E8F0"/>
                              <path d="M100 20L30 50L100 80L170 50L100 20Z" fill="#3B82F6"/>
                              <circle cx="100" cy="95" r="24" fill="#2563EB"/>
                            </svg>
                          </div>
                        </div>

                        {/* Top 4 Metrics Cards */}
                        <div className="grid grid-cols-4 gap-3">
                          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                            <div className="flex items-center justify-between text-slate-400 mb-1">
                              <span className="text-[11px] font-semibold text-slate-500">Tests Taken</span>
                              <Target className="w-4 h-4 text-blue-500" />
                            </div>
                            <div className="text-xl font-extrabold text-slate-900">{testsTaken}</div>
                            <div className="text-[10px] text-emerald-600 font-medium mt-0.5">↑ 3 this week</div>
                          </div>

                          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                            <div className="flex items-center justify-between text-slate-400 mb-1">
                              <span className="text-[11px] font-semibold text-slate-500">Avg. Score</span>
                              <BarChart2 className="w-4 h-4 text-purple-500" />
                            </div>
                            <div className="text-xl font-extrabold text-slate-900">{averageScore}%</div>
                            <div className="text-[10px] text-emerald-600 font-medium mt-0.5">Top 15% rank</div>
                          </div>

                          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                            <div className="flex items-center justify-between text-slate-400 mb-1">
                              <span className="text-[11px] font-semibold text-slate-500">Best Score</span>
                              <Award className="w-4 h-4 text-amber-500" />
                            </div>
                            <div className="text-xl font-extrabold text-slate-900">{bestScore}%</div>
                            <div className="text-[10px] text-slate-400 font-medium mt-0.5">All-time record</div>
                          </div>

                          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                            <div className="flex items-center justify-between text-slate-400 mb-1">
                              <span className="text-[11px] font-semibold text-slate-500">Total Study</span>
                              <Clock className="w-4 h-4 text-emerald-500" />
                            </div>
                            <div className="text-xl font-extrabold text-slate-900">{studyHours}h</div>
                            <div className="text-[10px] text-slate-400 font-medium mt-0.5">Dedicated prep</div>
                          </div>
                        </div>

                        {/* Continue Learning Strip */}
                        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Continue Where You Left Off</h3>
                            <a href="#" className="text-xs font-bold text-blue-600 hover:underline">See All →</a>
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-lg">
                                💻
                              </div>
                              <div>
                                <div className="font-bold text-xs text-slate-900">{continueCourseTitle}</div>
                                <div className="text-[11px] text-slate-500">{continueSubtitle}</div>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="w-32 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${continueProgressPercent}%` }}></div>
                                  </div>
                                  <span className="text-[10px] font-bold text-blue-600">{continueProgressPercent}% Complete</span>
                                </div>
                              </div>
                            </div>
                            <button className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm">
                              <Play className="w-3.5 h-3.5" fill="currentColor" />
                              <span>Resume</span>
                            </button>
                          </div>
                        </div>

                        {/* Popular Exams Strip */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Popular Exams</h3>
                            <a href="#" className="text-xs font-bold text-blue-600 hover:underline">Explore All Exams →</a>
                          </div>
                          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                            {['CCC', 'O Level', 'SSC CGL', 'Banking', 'Railway', 'Teaching', 'Police'].map((ex, idx) => (
                              <div key={ex} className="bg-white p-2.5 rounded-xl border border-slate-200 text-center hover:border-blue-400 transition-colors shadow-2xs">
                                <span className="text-xl">{['💻', '🎓', '📜', '🏛️', '🚆', '📖', '👮'][idx]}</span>
                                <div className="text-[11px] font-bold text-slate-800 mt-1">{ex}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* Right 4 Cols: Progress & Actions */}
                      <div className="col-span-12 lg:col-span-4 space-y-5">
                        
                        {/* Overall Progress Gauge */}
                        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Your Progress</h3>
                          
                          <div className="flex items-center justify-center py-2">
                            <div className="relative w-32 h-32 flex items-center justify-center">
                              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                <path className="text-slate-100" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                                <path className="text-blue-600" strokeDasharray="72, 100" strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                              </svg>
                              <div className="absolute text-center">
                                <div className="text-2xl font-black text-slate-900">72%</div>
                                <div className="text-[10px] text-slate-400 font-semibold uppercase">Overall</div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1.5 text-xs">
                            <div className="flex items-center justify-between text-slate-600">
                              <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Completed
                              </span>
                              <span className="font-bold text-slate-900">36</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-600">
                              <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> In Progress
                              </span>
                              <span className="font-bold text-slate-900">8</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-600">
                              <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span> Not Started
                              </span>
                              <span className="font-bold text-slate-900">12</span>
                            </div>
                          </div>
                        </div>

                        {/* Today's Target Goal */}
                        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                              <Target className="w-4 h-4 text-blue-600" /> Today's Goal
                            </h3>
                            <span className="text-[11px] font-bold text-blue-600">0/1 Done</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                            <div className="font-bold text-slate-800">Complete 1 Full Mock Test</div>
                            <div className="text-[11px] text-slate-500">Target: 50 Questions • 60 mins</div>
                          </div>
                        </div>

                        {/* Quick Actions Panel */}
                        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Quick Actions</h3>
                          
                          <button className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition-colors flex items-center justify-between text-xs font-semibold text-slate-800">
                            <span className="flex items-center gap-2">
                              <Plus className="w-4 h-4 text-blue-600" /> Create Custom Test
                            </span>
                            <span className="text-slate-400">→</span>
                          </button>

                          <button className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/40 transition-colors flex items-center justify-between text-xs font-semibold text-slate-800">
                            <span className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-purple-600" /> AI Practice (Smart Prep)
                            </span>
                            <span className="text-slate-400">→</span>
                          </button>

                          <button className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition-colors flex items-center justify-between text-xs font-semibold text-slate-800">
                            <span className="flex items-center gap-2">
                              <Download className="w-4 h-4 text-emerald-600" /> Download Study Notes
                            </span>
                            <span className="text-slate-400">→</span>
                          </button>

                          <button className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 transition-colors flex items-center justify-between text-xs font-semibold text-slate-800">
                            <span className="flex items-center gap-2">
                              <School className="w-4 h-4 text-indigo-600" /> Join Institute Batch
                            </span>
                            <span className="text-slate-400">→</span>
                          </button>
                        </div>

                      </div>

                    </div>

                  </main>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
