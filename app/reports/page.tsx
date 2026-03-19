'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { AppLayout } from '@/components/AppLayout'
import { formatCurrency, formatMonth, cn } from '@/lib/utils'
import { 
  PieChart as RePieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#6b7280', '#06b6d4']

export default function ReportsPage() {
  const [loading, setLoading] = useState(true)
  const [pieData, setPieData] = useState<any[]>([])
  const [lineData, setLineData] = useState<any[]>([])
  const [monthlySummary, setMonthlySummary] = useState<any[]>([])

  const supabase = createClient()

  const fetchData = async () => {
    setLoading(true)
    const { data: transactions } = await supabase
      .from('transactions')
      .select('*, categories(name)')
      .order('date', { ascending: true })

    if (transactions) {
      // 1. Process Pie Data (Expenses by Category)
      const expensesByCategory: Record<string, number> = {}
      transactions.forEach(t => {
        if (t.type === 'expense') {
          const catName = t.categories?.name || 'Senza Categoria'
          expensesByCategory[catName] = (expensesByCategory[catName] || 0) + Number(t.amount)
        }
      })
      setPieData(Object.entries(expensesByCategory).map(([name, value]) => ({ name, value })))

      // 2. Process Line Data (Trend) & Monthly Summary
      const monthlyData: Record<string, { month: string, income: number, expense: number, balance: number }> = {}
      transactions.forEach(t => {
        const date = new Date(t.date)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { 
            month: formatMonth(t.date), 
            income: 0, 
            expense: 0, 
            balance: 0 
          }
        }

        const amt = Number(t.amount)
        if (t.type === 'income') monthlyData[monthKey].income += amt
        else monthlyData[monthKey].expense += amt
        
        monthlyData[monthKey].balance = monthlyData[monthKey].income - monthlyData[monthKey].expense
      })

      const lineChartArr = Object.entries(monthlyData).map(([key, data]) => ({
        key,
        ...data
      }))
      
      setLineData(lineChartArr)
      setMonthlySummary([...lineChartArr].reverse())
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Report e Statistiche</h1>
          <p className="text-gray-600">Analizza le tue abitudini di spesa nel tempo.</p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500 bg-white rounded-xl border">Caricamento...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pie Chart */}
              <div className="bg-white p-6 rounded-2xl border shadow-sm">
                <h2 className="text-lg font-bold mb-6">Spese per Categoria</h2>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Line Chart */}
              <div className="bg-white p-6 rounded-2xl border shadow-sm">
                <h2 className="text-lg font-bold mb-6">Andamento nel Tempo</h2>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 12 }} 
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }} 
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => `€${value}`}
                      />
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="income" 
                        name="Entrate" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="expense" 
                        name="Uscite" 
                        stroke="#ef4444" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Riepilogo Mensile Table */}
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-lg font-bold">Riepilogo Mensile</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Mese</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Entrate</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Uscite</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Saldo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {monthlySummary.map((row) => (
                      <tr key={row.key} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.month}</td>
                        <td className="px-6 py-4 text-sm text-green-600 text-right font-medium">{formatCurrency(row.income)}</td>
                        <td className="px-6 py-4 text-sm text-red-600 text-right font-medium">{formatCurrency(row.expense)}</td>
                        <td className={cn(
                          "px-6 py-4 text-sm text-right font-bold",
                          row.balance >= 0 ? 'text-blue-600' : 'text-red-600'
                        )}>
                          {formatCurrency(row.balance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  )
}
