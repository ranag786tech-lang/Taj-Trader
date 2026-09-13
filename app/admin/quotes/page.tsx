'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Clock } from 'lucide-react'
import { QuoteRequest } from '@/lib/catalog'

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')

  useEffect(() => {
    loadQuotes()
  }, [])

  async function loadQuotes() {
    try {
      const res = await fetch('/api/admin/quotes')
      setQuotes(await res.json())
    } catch (error) {
      console.error('Failed to load quotes:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(id: string, newStatus: string) {
    try {
      const res = await fetch('/api/admin/quotes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      })

      if (!res.ok) {
        setStatus('Failed to update quote.')
        return
      }

      await loadQuotes()
      setStatus('Quote updated.')
    } catch (error) {
      setStatus('Error updating quote.')
      console.error(error)
    }
  }

  const statusColors: Record<string, string> = {
    NEW: 'bg-blue-50 text-blue-700',
    CONTACTED: 'bg-yellow-50 text-yellow-700',
    COMPLETED: 'bg-green-50 text-green-700',
    CANCELLED: 'bg-gray-50 text-gray-700',
  }

  const newQuotes = quotes.filter(q => q.status === 'NEW')
  const otherQuotes = quotes.filter(q => q.status !== 'NEW')

  return (
    <main className="min-h-screen bg-[#f7f9fc] px-4 py-8 text-[#16233d] sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-[#123b7a]">
          <ArrowLeft size={16} />
          Dashboard
        </Link>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#c8102e]">Catalog CMS</p>
            <h1 className="mt-2 text-4xl font-bold">Quote Requests</h1>
            <p className="mt-2 text-slate-500">Manage customer quote requests</p>
          </div>
        </div>

        {status && <p className="mt-6 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700">{status}</p>}

        {loading ? (
          <p className="mt-8 text-slate-500">Loading quotes…</p>
        ) : quotes.length === 0 ? (
          <p className="mt-8 rounded-xl bg-[#f7f9fc] p-6 text-slate-500">No quote requests yet.</p>
        ) : (
          <div className="mt-8 space-y-6">
            {newQuotes.length > 0 && (
              <section>
                <h2 className="text-xl font-bold">New Quotes ({newQuotes.length})</h2>
                <div className="mt-4 space-y-4">
                  {newQuotes.map((quote) => (
                    <div key={quote.id} className="rounded-2xl border border-[#dce5f2] bg-white p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-bold">{quote.name}</p>
                          <p className="text-sm text-slate-500">
                            <a href={`tel:${quote.phone}`} className="hover:text-[#123b7a]">
                              {quote.phone}
                            </a>
                          </p>
                          <p className="mt-2 text-sm">
                            <span className="font-semibold">{quote.projectType}</span>
                            {quote.areaSize && <span className="text-slate-500"> • {quote.areaSize}</span>}
                          </p>
                          {quote.products && <p className="mt-1 text-sm text-slate-600">{quote.products}</p>}
                          {quote.message && <p className="mt-2 text-sm text-slate-600 italic">"{quote.message}"</p>}
                          <p className="mt-2 text-xs text-slate-400">
                            {new Date(quote.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => updateStatus(quote.id, 'CONTACTED')}
                          className="flex items-center gap-2 rounded-lg bg-[#c8102e] px-4 py-2 text-sm font-bold text-white hover:bg-[#a80d26]"
                        >
                          <Clock size={16} />
                          Mark as Contacted
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {otherQuotes.length > 0 && (
              <section>
                <h2 className="text-xl font-bold">Other Quotes ({otherQuotes.length})</h2>
                <div className="mt-4 space-y-4">
                  {otherQuotes.map((quote) => (
                    <div key={quote.id} className="rounded-2xl border border-[#dce5f2] bg-white p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-bold">{quote.name}</p>
                          <p className="text-sm text-slate-500">
                            <a href={`tel:${quote.phone}`} className="hover:text-[#123b7a]">
                              {quote.phone}
                            </a>
                          </p>
                          <p className="mt-3">
                            <span
                              className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                                statusColors[quote.status] || 'bg-gray-50 text-gray-700'
                              }`}
                            >
                              {quote.status}
                            </span>
                          </p>
                        </div>
                        {quote.status !== 'COMPLETED' && (
                          <button
                            onClick={() => updateStatus(quote.id, 'COMPLETED')}
                            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700"
                          >
                            <CheckCircle2 size={16} />
                            Mark Completed
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
