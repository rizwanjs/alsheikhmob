import React from 'react'
import { Wallet, Landmark, ArrowUpRight, ArrowDownLeft } from 'lucide-react'

export default function CashBank() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Cash & Bank</h1>
        <p className="text-gray-500 mt-1">Manage cash drawers and bank accounts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent-green/10 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-accent-green" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Cash in Hand</h3>
                <p className="text-gray-500 text-sm">Main drawer</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-white">Rs 0</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-dark-500/30">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-accent-green" />
                <span className="text-sm text-gray-400">Today&apos;s sales</span>
              </div>
              <span className="text-white text-sm">Rs 0</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-dark-500/30">
              <div className="flex items-center gap-2">
                <ArrowDownLeft className="w-4 h-4 text-accent-red" />
                <span className="text-sm text-gray-400">Today&apos;s expenses</span>
              </div>
              <span className="text-white text-sm">Rs 0</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent-blue/10 rounded-lg flex items-center justify-center">
                <Landmark className="w-5 h-5 text-accent-blue" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Bank Account</h3>
                <p className="text-gray-500 text-sm">HBL - 1234567890</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-white">Rs 0</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-dark-500/30">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-accent-green" />
                <span className="text-sm text-gray-400">Deposits</span>
              </div>
              <span className="text-white text-sm">Rs 0</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-dark-500/30">
              <div className="flex items-center gap-2">
                <ArrowDownLeft className="w-4 h-4 text-accent-red" />
                <span className="text-sm text-gray-400">Withdrawals</span>
              </div>
              <span className="text-white text-sm">Rs 0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}