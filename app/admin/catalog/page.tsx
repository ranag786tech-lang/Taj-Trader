'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Trash2 } from 'lucide-react'

type TableName = 'products' | 'brands' | 'categories'
type RecordItem = { id: string; name: string; slug: string; description?: string | null; category_id?: string; brand_id?: string }

export default function CatalogManagerPage() {
  const [table, setTable] = useState<TableName>('products')
  const [items, setItems] = useState<RecordItem[]>([])
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)

  async function load(nextTable = table) {
    setLoading(true)
    const response = await fetch(`/api/admin/catalog?table=${nextTable}`)
    const json = await response.json()
    setItems(json.data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [table])

  async function submit(event: FormEvent) {
    event.preventDefault()
    setStatus('Saving…')
    const response = await fetch('/api/admin/catalog', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ table, name, slug, description }) })
    if (!response.ok) { setStatus('Could not save this record. Check the name and slug.'); return }
    setName(''); setSlug(''); setDescription(''); setStatus('Saved successfully.'); load()
  }

  async function remove(id: string) {
    if (!window.confirm('Delete this record?')) return
    const response = await fetch('/api/admin/catalog', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ table, id }) })
    setStatus(response.ok ? 'Deleted successfully.' : 'Could not delete this record.')
    if (response.ok) load()
  }

  return <main className="min-h-screen bg-[#f7f9fc] px-4 py-8 text-[#16233d] sm:px-6">
    <div className="mx-auto max-w-6xl">
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-[#123b7a]"><ArrowLeft size={16} /> Dashboard</Link>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-[0.24em] text-[#c8102e]">Catalog CMS</p><h1 className="mt-2 text-4xl font-bold">Manage {table}</h1><p className="mt-2 text-slate-500">Changes are saved to the Taj Traders catalog database.</p></div><div className="flex rounded-xl border border-[#dce5f2] bg-white p-1">{(['products', 'brands', 'categories'] as TableName[]).map(item => <button key={item} onClick={() => setTable(item)} className={`rounded-lg px-3 py-2 text-sm font-bold capitalize ${table === item ? 'bg-[#123b7a] text-white' : 'text-slate-600'}`}>{item}</button>)}</div></div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
        <form onSubmit={submit} className="rounded-2xl border border-[#dce5f2] bg-white p-6 shadow-sm"><h2 className="text-xl font-bold">Add {table.slice(0, -1)}</h2><div className="mt-5 space-y-4"><label className="block text-sm font-semibold">Name<input required value={name} onChange={event => setName(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label><label className="block text-sm font-semibold">Slug<input required value={slug} onChange={event => setSlug(event.target.value)} placeholder="lowercase-with-dashes" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label><label className="block text-sm font-semibold">Description<textarea value={description} onChange={event => setDescription(event.target.value)} rows={4} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label><button className="w-full rounded-lg bg-[#c8102e] px-4 py-3 font-bold text-white hover:bg-[#a80d26]">Save {table.slice(0, -1)}</button>{status && <p className="text-sm text-slate-600" role="status">{status}</p>}</div></form>
        <section className="rounded-2xl border border-[#dce5f2] bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><h2 className="text-xl font-bold">Existing {table}</h2><span className="text-sm text-slate-500">{items.length} total</span></div>{loading ? <p className="mt-8 text-slate-500">Loading catalog…</p> : items.length === 0 ? <p className="mt-8 rounded-xl bg-[#f7f9fc] p-6 text-slate-500">No records yet. Add the first one using the form.</p> : <div className="mt-5 divide-y divide-slate-100">{items.map(item => <div key={item.id} className="flex items-center justify-between gap-4 py-4"><div><p className="font-bold">{item.name}</p><p className="text-sm text-slate-500">/{item.slug}</p>{item.description && <p className="mt-1 text-sm text-slate-600">{item.description}</p>}</div><button onClick={() => remove(item.id)} aria-label={`Delete ${item.name}`} className="rounded-lg p-2 text-[#c8102e] hover:bg-red-50"><Trash2 size={18} /></button></div>)}</div>}</section>
      </div>
    </div>
  </main>
}
