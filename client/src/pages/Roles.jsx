import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { Plus, Shield, Save } from 'lucide-react'
import api from '../lib/api'

const permissionSections = [
  { key: 'dashboard', label: 'OVERVIEW', permissions: [{ key: 'view', label: 'View dashboard' }] },
  { key: 'sales', label: 'SALES', permissions: [{ key: 'view', label: 'View sales' }, { key: 'create', label: 'Create sales' }, { key: 'refund', label: 'Refund / return' }, { key: 'overridePrice', label: 'Override min price / discount' }] },
  { key: 'customers', label: 'CUSTOMERS', permissions: [{ key: 'view', label: 'View customers' }, { key: 'manage', label: 'Manage customers' }] },
  { key: 'inventory', label: 'INVENTORY', permissions: [{ key: 'view', label: 'View inventory' }, { key: 'manage', label: 'Manage inventory' }] },
  { key: 'usedPhones', label: 'USED PHONES', permissions: [{ key: 'view', label: 'View used phones' }, { key: 'manage', label: 'Manage used phones' }] },
  { key: 'purchases', label: 'PURCHASES', permissions: [{ key: 'view', label: 'View purchases' }, { key: 'create', label: 'Create purchases' }] },
  { key: 'suppliers', label: 'SUPPLIERS', permissions: [{ key: 'view', label: 'View suppliers' }, { key: 'manage', label: 'Manage suppliers' }] },
  { key: 'repairs', label: 'REPAIRS', permissions: [{ key: 'view', label: 'View repairs' }, { key: 'manage', label: 'Manage repairs' }] },
  { key: 'expenses', label: 'EXPENSES', permissions: [{ key: 'view', label: 'View expenses' }, { key: 'manage', label: 'Manage expenses' }] },
  { key: 'reports', label: 'REPORTS', permissions: [{ key: 'view', label: 'View reports' }] },
  { key: 'users', label: 'USERS', permissions: [{ key: 'view', label: 'View users' }, { key: 'manage', label: 'Manage users' }] },
  { key: 'roles', label: 'ROLES', permissions: [{ key: 'view', label: 'View roles' }, { key: 'manage', label: 'Manage roles' }] },
  { key: 'settings', label: 'SETTINGS', permissions: [{ key: 'view', label: 'View settings' }, { key: 'manage', label: 'Manage settings' }] },
  { key: 'backup', label: 'BACKUP', permissions: [{ key: 'view', label: 'View backup' }, { key: 'manage', label: 'Manage backup' }] },
]

export default function Roles() {
  const [selectedRole, setSelectedRole] = useState(null)
  const { data: roles } = useQuery('roles', () => api.get('/roles').then(res => res.data))

  const role = roles?.find(r => r._id === selectedRole) || roles?.[0]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Roles & Permissions</h1>
          <p className="text-gray-500 mt-1">Control what each role can see and do.</p>
        </div>
        <button className="btn-primary"><Plus className="w-4 h-4" /> New role</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          {roles?.map(r => (
            <button key={r._id} onClick={() => setSelectedRole(r._id)}
              className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${role?._id === r._id ? 'bg-dark-700 border-dark-400' : 'bg-dark-800 border-dark-600/50 hover:bg-dark-700/50'}`}>
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-white font-medium">{r.name}</span>
              </div>
              <span className="text-xs text-gray-500 bg-dark-600 px-2 py-0.5 rounded-full">{r.isSystem ? 'System' : 'Custom'}</span>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2 card">
          {role && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-white">{role.name}</h2>
                  <p className="text-sm text-gray-500">{role.description || 'No description'}</p>
                </div>
                <button className="btn-primary"><Save className="w-4 h-4" /> Save</button>
              </div>

              <div className="space-y-6">
                {permissionSections.map(section => (
                  <div key={section.key}>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{section.label}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {section.permissions.map(perm => {
                        const isEnabled = role.permissions?.[section.key]?.[perm.key] || false
                        return (
                          <div key={perm.key} className="flex items-center justify-between p-3 bg-dark-800 rounded-lg border border-dark-500/30">
                            <span className="text-sm text-gray-300">{perm.label}</span>
                            <button className={`toggle ${isEnabled ? 'toggle-active' : 'toggle-inactive'}`}>
                              <span className={`inline-block w-4 h-4 transform rounded-full bg-white transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}