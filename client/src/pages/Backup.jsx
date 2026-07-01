import React from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Download, Upload, Shield, Database, Clock } from 'lucide-react'
import api from '../lib/api'

export default function Backup() {
  const queryClient = useQueryClient()
  const { data: backups } = useQuery('backups', () => api.get('/backup').then(res => res.data))

  const createBackup = useMutation(() => api.post('/backup/create'), {
    onSuccess: () => queryClient.invalidateQueries('backups')
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Backup & Restore</h1>
        <p className="text-gray-500 mt-1">Keep your data safe.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card card-hover">
          <div className="w-12 h-12 bg-accent-blue/10 rounded-xl flex items-center justify-center mb-4">
            <Download className="w-6 h-6 text-accent-blue" />
          </div>
          <h3 className="text-white font-semibold mb-1">Manual backup</h3>
          <p className="text-gray-500 text-sm mb-4">Save a copy of the database to a location you choose.</p>
          <button onClick={() => createBackup.mutate()} disabled={createBackup.isLoading} className="btn-primary w-full justify-center">
            <Download className="w-4 h-4" /> {createBackup.isLoading ? 'Backing up...' : 'Back up now'}
          </button>
        </div>

        <div className="card card-hover">
          <div className="w-12 h-12 bg-accent-yellow/10 rounded-xl flex items-center justify-center mb-4">
            <Upload className="w-6 h-6 text-accent-yellow" />
          </div>
          <h3 className="text-white font-semibold mb-1">Restore</h3>
          <p className="text-gray-500 text-sm mb-4">Replace current data with a backup. The app will restart.</p>
          <button className="btn-secondary w-full justify-center">
            <Upload className="w-4 h-4" /> Restore...
          </button>
        </div>

        <div className="card card-hover">
          <div className="w-12 h-12 bg-accent-green/10 rounded-xl flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-accent-green" />
          </div>
          <h3 className="text-white font-semibold mb-1">Automatic backups</h3>
          <p className="text-gray-500 text-sm mb-4">A backup is taken automatically on every app start; the last 7 are kept.</p>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" /> {backups?.filter(b => b.name.startsWith('auto')).length || 0} automatic backups
          </div>
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="p-4 border-b border-dark-500/50 flex items-center gap-2">
          <Database className="w-4 h-4 text-gray-400" />
          <h3 className="text-white font-semibold">Backup history</h3>
        </div>
        <table className="w-full">
          <thead className="bg-dark-800 border-b border-dark-500/50">
            <tr>
              <th className="table-header">Name</th>
              <th className="table-header">Created</th>
              <th className="table-header text-right">Size</th>
            </tr>
          </thead>
          <tbody>
            {backups?.length === 0 && (
              <tr><td colSpan={3} className="table-cell text-center py-12 text-gray-500">No backups yet.</td></tr>
            )}
            {backups?.map(backup => (
              <tr key={backup.name} className="border-b border-dark-500/30 hover:bg-dark-600/30 transition-colors">
                <td className="table-cell font-mono text-xs text-white">{backup.name}</td>
                <td className="table-cell text-gray-400">{new Date(backup.created).toLocaleString()}</td>
                <td className="table-cell text-right text-gray-400">{(backup.size / 1024).toFixed(0)} KB</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}