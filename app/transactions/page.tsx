'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { AppLayout } from '@/components/AppLayout'
import { Button } from '@/components/Button'
import { TransactionForm } from '@/components/TransactionForm'
import { formatDate, formatCurrency, cn } from '@/lib/utils'
import { Plus, Trash2, Edit2, Filter, ChevronLeft, ChevronRight } from 'lucide-react'

interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  category_id: string
  categories: { name: string }
  description: string
  date: string
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const pageSize = 10

  const supabase = createClient()

  const fetchTransactions = async () => {
    setLoading(true)
    const start = (page - 1) * pageSize
    const end = start + pageSize - 1

    const { data, error } = await supabase
      .from('transactions')
      .select('*, categories(name)')
      .order('date', { ascending: false })
      .range(start, end)
    
    if (data) {
      setTransactions(data as any)
      setHasMore(data.length === pageSize)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchTransactions()
  }, [page])

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminare questa transazione?')) return
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (!error) fetchTransactions()
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transazioni</h1>
            <p className="text-gray-600">Gestisci le tue entrate e uscite.</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-5 w-5 mr-2" />
            Nuova
          </Button>
        </div>

        {showForm && (
          <TransactionForm
            transaction={editingTransaction}
            onSuccess={() => {
              setShowForm(false)
              setEditingTransaction(null)
              fetchTransactions()
            }}
            onCancel={() => {
              setShowForm(false)
              setEditingTransaction(null)
            }}
          />
        )}

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Data</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Categoria</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Descrizione</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Importo</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Caricamento...</td></tr>
                ) : transactions.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Nessuna transazione trovata.</td></tr>
                ) : (
                  transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{formatDate(t.date)}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {t.categories?.name || 'Nessuna'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">{t.description || '-'}</td>
                      <td className={cn(
                        "px-6 py-4 text-sm font-bold text-right whitespace-nowrap",
                        t.type === 'income' ? 'text-green-600' : 'text-red-600'
                      )}>
                        {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        <div className="flex justify-center gap-1">
                          <button
                            onClick={() => {
                              setEditingTransaction(t)
                              setShowForm(true)
                            }}
                            className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
            <p className="text-sm text-gray-500">Pagina {page}</p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Precedente
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={!hasMore}
                onClick={() => setPage(page + 1)}
              >
                Successivo <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
