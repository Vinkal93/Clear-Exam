'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, ShieldAlert, UserCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { UserRole } from '@clearexam/contracts';

interface UserRecord {
  uid: string;
  email: string | null;
  displayName: string;
  role: UserRole;
  createdAt?: string;
}

export default function AdminUsersPage() {
  const { user, role, getIdToken } = useAuth();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');

  // Role modification modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [targetUser, setTargetUser] = useState<UserRecord | null>(null);
  const [newRole, setNewRole] = useState<UserRole>('EDITOR');
  const [reason, setReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getIdToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const roleQuery = selectedRoleFilter !== 'ALL' ? `?role=${selectedRoleFilter}` : '';

      const res = await fetch(`${apiUrl}/v1/admin/users${roleQuery}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error('Administrative privilege required. Current role lacks permission to list users.');
        }
        throw new Error(`Failed to fetch user directory (HTTP ${res.status})`);
      }

      const json = await res.json();
      setUsers(json.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedRoleFilter]);

  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUser) return;

    try {
      setActionLoading(true);
      const token = await getIdToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

      const res = await fetch(`${apiUrl}/v1/admin/users/${targetUser.uid}/role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          role: newRole,
          reason
        })
      });

      if (!res.ok) {
        const errorJson = await res.json();
        throw new Error(errorJson.message || 'Failed to update role.');
      }

      setModalOpen(false);
      setTargetUser(null);
      setReason('');
      await fetchUsers();
    } catch (err: any) {
      alert(`Role assignment error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const getBadgeVariant = (userRole: string) => {
    const normalized = userRole.toUpperCase();
    if (normalized === 'SUPER_ADMIN') return 'danger';
    if (normalized === 'CONTENT_ADMIN') return 'warning';
    if (normalized === 'EDITOR' || normalized === 'REVIEWER') return 'default';
    return 'outline';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User & Staff Role Directory</h1>
          <p className="text-slate-600 text-sm mt-1">
            Authoritative Role-Based Access Control (RBAC). Changes trigger immutable audit logs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchUsers} disabled={loading} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Directory
          </Button>
        </div>
      </div>

      {/* Role Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {['ALL', 'SUPER_ADMIN', 'CONTENT_ADMIN', 'EDITOR', 'REVIEWER', 'STUDENT'].map((roleItem) => (
          <button
            key={roleItem}
            onClick={() => setSelectedRoleFilter(roleItem)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              selectedRoleFilter === roleItem
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {roleItem}
          </button>
        ))}
      </div>

      {error ? (
        <Card className="border-amber-200 bg-amber-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-900 text-sm">Security Gateway Notification</h3>
              <p className="text-xs text-amber-800 mt-1">{error}</p>
              <p className="text-xs text-amber-700 mt-2">
                Tip: Run the local Super Admin bootstrap script or log in with an authorized administrator account to view the full directory.
              </p>
            </div>
          </div>
        </Card>
      ) : users.length === 0 ? (
        <Card className="text-center py-12">
          <UserCheck className="h-10 w-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900">No Users Found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Zero fabricated records. As new students and administrators authenticate via Firebase, their records will populate here dynamically.
          </p>
        </Card>
      ) : (
        <div className="bg-white rounded-card border border-neutral-border overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold text-left">
              <tr>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Firebase UID</th>
                <th className="px-6 py-3">Assigned Role</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {users.map((item) => (
                <tr key={item.uid} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{item.displayName}</div>
                    <div className="text-xs text-slate-500">{item.email || 'No email associated'}</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{item.uid}</td>
                  <td className="px-6 py-4">
                    <Badge variant={getBadgeVariant(item.role)}>{item.role}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setTargetUser(item);
                        setNewRole(item.role);
                        setModalOpen(true);
                      }}
                    >
                      Assign Role
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Role Assignment Modal */}
      {modalOpen && targetUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-card border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-indigo-600" />
              <h3 className="font-bold text-lg text-slate-900">Modify User Permissions</h3>
            </div>
            <p className="text-xs text-slate-500">
              Elevating or modifying roles updates Firebase Custom Claims and records an immutable audit log.
            </p>

            <form onSubmit={handleAssignRole} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Target</label>
                <input
                  type="text"
                  disabled
                  value={`${targetUser.displayName} (${targetUser.uid})`}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg text-xs font-mono text-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Select New Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="STUDENT">STUDENT (Standard Aspirant)</option>
                  <option value="EDITOR">EDITOR (Drafts Questions)</option>
                  <option value="REVIEWER">REVIEWER (Approves Content)</option>
                  <option value="CONTENT_ADMIN">CONTENT_ADMIN (Full Catalog & Test Series)</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN (Global Authority)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Audit Justification</label>
                <textarea
                  required
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Reason for role change (recorded in security audit log)..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                  disabled={actionLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={actionLoading}>
                  {actionLoading ? 'Updating Claims...' : 'Confirm Role Elevation'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
