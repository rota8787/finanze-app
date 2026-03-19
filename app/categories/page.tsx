'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { AppLayout } from '@/components/AppLayout'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Plus, Trash2, Edit2 } from 'lucide-react'

interface Category {
  id: string
  name: string
  user_id: string
  created_at: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newName, setNewName] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const supabase = createClient()

  const fetchCategories = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    
    if (data) setCategories(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('categories')
      .insert([{ name: newName, user_id: user.id }])

    if (!error) {
      setNewName('')
      fetchCategories()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa categoria?')) return

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (!error) fetchCategories()
  }

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return

    const { error } = await supabase
      .from('categories')
      .update({ name: editName })
      .eq('id', id)

    if (!error) {
      setEditingId(null)
      fetchCategories()
    }
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categorie</h1>
          <p className="text-gray-600">Gestisci le categorie per le tue transazioni.</p>
        </div>

        <form onSubmit={handleAdd} className="flex items-end gap-4 bg-white p-6 rounded-xl shadow-sm border">
          <Input
            label="Nuova Categoria"
            placeholder="es. Alimentari, Affitto..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Button type="submit">
            <Plus className="h-5 w-5 mr-2" />
            Aggiungi
          </Button>
        </form>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {loading ? (
              <li className="p-8 text-center text-gray-500">Caricamento...</li>
            ) : categories.length === 0 ? (
              <li className="p-8 text-center text-gray-500">Nessuna categoria trovata.</li>
            ) : (
              categories.map((category) => (
                <li key={category.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  {editingId === category.id ? (
                    <div className="flex flex-1 items-center gap-2">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="max-w-xs"
                        autoFocus
                      />
                      <Button size="sm" onClick={() => handleUpdate(category.id)}>Salva</Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Annulla</Button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium text-gray-900">{category.name}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingId(category.id)
                            setEditName(category.name)
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </AppLayout>
  )
}
