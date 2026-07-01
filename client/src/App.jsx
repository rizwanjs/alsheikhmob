import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import POS from './pages/POS'
import Customers from './pages/Customers'
import Repairs from './pages/Repairs'
import Inventory from './pages/Inventory'
import UsedPhones from './pages/UsedPhones'
import Purchases from './pages/Purchases'
import Suppliers from './pages/Suppliers'
import Expenses from './pages/Expenses'
import CashBank from './pages/CashBank'
import Reports from './pages/Reports'
import Users from './pages/Users'
import Roles from './pages/Roles'
import Settings from './pages/Settings'
import Backup from './pages/Backup'
import ActivityLog from './pages/ActivityLog'

function App() {
  const { isAuthenticated } = useAuthStore()
  if (!isAuthenticated) return <Login />
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pos" element={<POS />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/repairs" element={<Repairs />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/used-phones" element={<UsedPhones />} />
        <Route path="/purchases" element={<Purchases />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/cash-bank" element={<CashBank />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/users" element={<Users />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/backup" element={<Backup />} />
        <Route path="/activity-log" element={<ActivityLog />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App