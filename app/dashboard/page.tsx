'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { AppLayout } from '@/components/AppLayout'
import { Button } from '@/components/Button'
import { TransactionForm } from '@/components/TransactionForm'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Plus, ArrowUpRight, ArrowDownRight, Wallet, Receipt, PieChart, Tag } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const [summary, setSummary] = useState({ balance: 0, income: 0, expenses: 0 })
  const [recentTransactions, setRecentTransactions] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  const fetchData = async () => {
    setLoading(true)
    
    // Fetch all transactions to calculate summary
    const { data: allTransactions } = await supabase
      .from('transactions')
      .select('type, amount, date')

    if (allTransactions) {
      const now = new Date()
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()

      let balance = 0
      let income = 0
      let expenses = 0

      allTransactions.forEach(t => {
        const amt = Number(t.amount)
        const tDate = new Date(t.date)
        
        if (tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear) {
          if (t.type === 'income') income += amt
          else expenses += amt
        }
      })

      setSummary({ balance: income - expenses, income, expenses })
    }

    // Fetch last 5 transactions
    const { data: recent } = await supabase
      .from('transactions')
      .select('*, categories(name)')
      .order('date', { ascending: false })
      .limit(5)

    if (recent) setRecentTransactions(recent)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Bentornato! Ecco il riepilogo delle tue finanze.</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
            <Plus className="h-5 w-5 mr-2" />
            Inserisci transazione
          </Button>
        </div>

        {showForm && (
          <TransactionForm
            onSuccess={() => {
              setShowForm(false)
              fetchData()
            }}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Riepilogo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500">Saldo Mensile</span>
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Wallet className="h-5 w-5" />
              </div>
            </div>
            <div className={cn(
              "text-3xl font-bold",
              summary.balance >= 0 ? "text-gray-900" : "text-red-600"
            )}>
              {formatCurrency(summary.balance)}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500">Entrate del Mese</span>
              <div className="p-2 bg-green-50 rounded-lg text-green-600">
                <ArrowUpRight className="h-5 w-5" />
              </div>
            </div>
            <div className="text-3xl font-bold text-green-600">{formatCurrency(summary.income)}</div>
          </div>

          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500">Uscite del Mese</span>
              <div className="p-2 bg-red-50 rounded-lg text-red-600">
                <ArrowDownRight className="h-5 w-5" />
              </div>
            </div>
            <div className="text-3xl font-bold text-red-600">{formatCurrency(summary.expenses)}</div>
          </div>
        </div>

        {/* Azioni Rapide */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:hidden">
           <Link href="/transactions" className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border shadow-sm hover:bg-gray-50 transition-colors">
              <div className="p-3 bg-gray-100 rounded-full text-gray-600"><Receipt className="h-6 w-6" /></div>
              <span className="text-sm font-medium">Transazioni</span>
           </Link>
           <Link href="/reports" className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border shadow-sm hover:bg-gray-50 transition-colors">
              <div className="p-3 bg-gray-100 rounded-full text-gray-600"><PieChart className="h-6 w-6" /></div>
              <span className="text-sm font-medium">Report</span>
           </Link>
           <Link href="/categories" className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border shadow-sm hover:bg-gray-50 transition-colors">
              <div className="p-3 bg-gray-100 rounded-full text-gray-600"><Tag className="h-6 w-6" /></div>
              <span className="text-sm font-medium">Categorie</span>
           </Link>
        </div>

        {/* Attività Recente */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Attività Recente</h2>
              <Link href="/transactions" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Vedi tutte
              </Link>
            </div>
          </div>
          <ul className="divide-y divide-gray-100">
            {loading ? (
              <li className="p-8 text-center text-gray-500">Caricamento...</li>
            ) : recentTransactions.length === 0 ? (
              <li className="p-8 text-center text-gray-500">Nessuna attività recente.</li>
            ) : (
              recentTransactions.map((t) => (
                <li key={t.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${t.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {t.type === 'income' ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{t.description || t.categories?.name || 'Transazione'}</div>
                        <div className="text-sm text-gray-500">{formatDate(t.date)} • {t.categories?.name || 'Nessuna'}</div>
                      </div>
                    </div>
                    <div className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </AppLayout>
  )
}
