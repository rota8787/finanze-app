'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Plus, X } from 'lucide-react'

interface Category {
  id: string
  name: string
}

interface TransactionFormProps {
  transaction?: any
  onSuccess: () => void
  onCancel: () => void
}

export function TransactionForm({ transaction, onSuccess, onCancel }: TransactionFormProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: transaction?.type || 'expense',
    amount: transaction?.amount || '',
    category_id: transaction?.category_id || '',
    description: transaction?.description || '',
    date: transaction?.date || new Date().toISOString().split('T')[0],
  })

  const supabase = createClient()

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select('*').order('name')
      if (data) setCategories(data)
    }
    fetchCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const payload = {
      ...formData,
      amount: parseFloat(formData.amount as string),
      user_id: user.id,
    }

    try {
      if (transaction?.id) {
        const { error } = await supabase
          .from('transactions')
          .update(payload)
          .eq('id', transaction.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('transactions')
          .insert([payload])
        if (error) throw error
      }
      onSuccess()
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl border shadow-sm text-gray-900">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold">{transaction ? 'Modifica Transazione' : 'Nuova Transazione'}</h3>
        <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Tipo</label>
          <div className="flex rounded-md bg-gray-100 p-1">
            <button
              type="button"
              className={`flex-1 rounded py-1.5 text-sm font-medium transition-colors ${
                formData.type === 'expense' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-600'
              }`}
              onClick={() => setFormData({ ...formData, type: 'expense' })}
            >
              Uscita
            </button>
            <button
              type="button"
              className={`flex-1 rounded py-1.5 text-sm font-medium transition-colors ${
                formData.type === 'income' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-600'
              }`}
              onClick={() => setFormData({ ...formData, type: 'income' })}
            >
              Entrata
            </button>
          </div>
        </div>

        <Input
          label="Importo (€)"
          type="number"
          step="0.01"
          required
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Categoria</label>
          <select
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.category_id}
            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            required
          >
            <option value="">Seleziona...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <Input
          label="Data"
          type="date"
          required
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
      </div>

      <Input
        label="Descrizione (opzionale)"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="es. Pranzo al ristorante"
      />

      <div className="flex gap-3 pt-2">
        <Button type="submit" className="flex-1" disabled={loading}>
          {loading ? 'Salvataggio...' : transaction ? 'Aggiorna' : 'Salva'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>Annulla</Button>
      </div>
    </form>
  )
}
