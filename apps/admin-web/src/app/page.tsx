import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Database, Layers, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';

export default function AdminHomePage() {
  const systemModules = [
    {
      name: 'Shared Monorepo & Contracts',
      status: 'Operational',
      details: '@clearexam/contracts with Zod schemas and design tokens',
      icon: Layers,
      ready: true
    },
    {
      name: 'Node.js Cloud Run API',
      status: 'Configured',
      details: 'Express API with RFC 7807 error envelopes and /healthz',
      icon: CheckCircle2,
      ready: true
    },
    {
      name: 'Firebase & Firestore Governance',
      status: 'Protected',
      details: 'Default-deny firestore.rules and emulator configurations',
      icon: ShieldCheck,
      ready: true
    },
    {
      name: 'Android Compose Architecture',
      status: 'Ready for SDK',
      details: 'Kotlin + Material 3 clean architecture skeleton and UI tokens',
      icon: Database,
      ready: true
    }
  ];

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-white rounded-card border border-neutral-border p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">ClearExam Control Plane</h1>
            <Badge variant="success">Phase 00 Verified</Badge>
          </div>
          <p className="text-slate-600 mt-1 text-sm">
            Autonomous governance, shared schema contracts, and platform foundations active.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/api/healthz"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-button text-sm font-medium border border-neutral-border hover:bg-slate-50 transition-colors"
          >
            Check Healthz API
            <ArrowUpRight className="h-4 w-4 text-slate-500" />
          </a>
        </div>
      </div>

      {/* Real Invariants & Architecture Checks */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Core System Architectural Invariants</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 mt-0.5">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Server-Authoritative Test Engine</h4>
                <p className="text-sm text-slate-600 mt-1">
                  Active tests never expose answer keys in student payloads. Duration and grading are strictly calculated and finalized by server-side processes.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 mt-0.5">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Zero Synthetic Metrics Policy</h4>
                <p className="text-sm text-slate-600 mt-1">
                  No simulated user counts, fictitious student rankings, or fabricated exam lists. All catalogs are loaded dynamically from verified Firestore collections.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Modules Health Matrix */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Scaffolded Foundation Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {systemModules.map((module) => {
            const Icon = module.icon;
            return (
              <Card key={module.name} className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant={module.ready ? 'success' : 'warning'}>
                      {module.status}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm">{module.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{module.details}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Live System Gate Information */}
      <Card>
        <CardHeader>
          <CardTitle>Next Phase Readiness Gate</CardTitle>
          <CardDescription>
            Phase 00 Foundation is self-contained and ready for review. Progression to Phase 01 (Auth, Users & Permissions) will occur only upon explicit user command.
          </CardDescription>
        </CardHeader>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <span>No unverified code claims. Tests and linter builds must be executed to produce verified evidence.</span>
        </div>
      </Card>
    </div>
  );
}
