import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { Search, Clock, User, Activity } from 'lucide-react'
import api from '../lib/api'

export default function ActivityLog() {
  const [search, setSearch] = useState('')
  const [entity, setEntity] = useState('All entities')

  const { data: logs } = useQuery(['activity-log', search, entity], () =>
    api.get(`/activity-log?search=${search}&entity=${entity}`).then(res => res.data), { keepPreviousData: true }
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Activity Log</h1>
        <p className="text-gray-500 mt-1">Every change, who made it and when.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action or entity..." className="input-field pl-10" />
        </div>
        <select value={entity} onChange={(e) => setEntity(e.target.value)} className="input-field w-48">
          <option>All entities</option>
          <option>User</option>
          <option>Product</option>
          <option>Sale</option>
          <option>Purchase</option>
          <option>Customer</option>
          <option>Repair</option>
        </select>
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full">
          <thead className="bg-dark-800 border-b border-dark-500/50">
            <tr>
              <th className="table-header">When</th>
              <th className="table-header">User</th>
              <th className="table-header">Action</th>
              <th className="table-header">Entity</th>
            </tr>
          </thead>
          <tbody>
            {logs?.length === 0 && (
              <tr><td colSpan={4} className="table-cell text-center py-12 text-gray-500">No activity yet.</td></tr>
            )}
            {logs?.map(log => (
              <tr key={log._id} className="border-b border-dark-500/30 hover:bg-dark-600/30 transition-colors">
                <td className="table-cell text-gray-400 text-xs">{new Date(log.createdAt).toLocaleString()}</td>
                <td className="table-cell text-white">{log.userName}</td>
                <td className="table-cell">
                  <span className="badge bg-dark-600 text-gray-300 font-mono text-xs">{log.action}</span>
                </td>
                <td className="table-cell">
                  <span className="badge bg-accent-blue/10 text-accent-blue">{log.entity}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}