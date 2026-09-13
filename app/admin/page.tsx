'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface DashboardStats {
  products: number
  brands: number
  categories: number
  quotes: number
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({ products: 0, brands: 0, categories: 0, quotes: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const [productsRes, brandsRes, categoriesRes, quotesRes] = await Promise.all([
          fetch('/api/admin/products'),
          fetch('/api/admin/brands'),
          fetch('/api/admin/categories'),
          fetch('/api/admin/quotes'),
        ])

        const products = await productsRes.json()
        const brands = await brandsRes.json()
        const categories = await categoriesRes.json()
        const quotes = await quotesRes.json()

        setStats({
          products: products.length || 0,
          brands: brands.length || 0,
          categories: categories.length || 0,
          quotes: quotes.length || 0,
        })
      } catch (error) {
        console.error('Failed to load stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const cards = [
    ['Products', stats.products, '/admin/products'],
    ['Brands', stats.brands, '/admin/brands'],
    ['Categories', stats.categories, '/admin/categories'],
    ['New Quotes', stats.quotes, '/admin/quotes'],
  ]

  return (
    <main className="min-h-screen bg-[#f7f9fc] px-6 py-10 text-[#16233d]">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#c8102e]">Taj Traders FSD</p>
            <h1 className="mt-2 text-4xl font-bold">Catalog Dashboard</h1>
            <p className="mt-2 text-slate-500">Manage all catalog data and quote requests</p>
          </div>
          <div className="flex gap-3">
            <Link href="/" className="rounded-xl border border-[#123b7a] px-4 py-2 text-sm font-bold text-[#123b7a] transition hover:bg-[#123b7a] hover:text-white">
              View Public Site
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl bg-[#c8102e] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#a80d27]"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>

        <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" aria-label="Catalog summary">
          {cards.map(([label, value, href]) => (
            <Link
              href={href}
              key={label}
              className="rounded-2xl border border-[#dce5f2] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <p className="text-sm font-semibold text-slate-500">{label}</p>
              <p className="mt-3 text-4xl font-bold text-[#123b7a]">{loading ? '—' : value}</p>
              <p className="mt-4 text-sm font-bold text-[#c8102e]">Manage →</p>
            </Link>
          ))}
        </section>

        <section className="mt-8 rounded-2xl border border-[#dce5f2] bg-white p-6">
          <h2 className="text-xl font-bold">Admin Access</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Admin access is controlled by secure cookie authentication and Vercel KV storage. All changes to products, brands, categories, and quotes are immediately persisted and synced to the public website.
          </p>
        </section>
      </div>
    </main>
  )
}
