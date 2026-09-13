import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const isAdmin = user.app_metadata?.role === 'admin' || user.app_metadata?.is_admin === true
  if (!isAdmin) redirect('/')

  const [{ count: products }, { count: brands }, { count: categories }, { count: quotes }] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('brands').select('id', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('categories').select('id', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('quote_requests').select('id', { count: 'exact', head: true }).eq('status', 'NEW'),
  ])

  const cards = [
    ['Products', products ?? 0, '/admin/products'],
    ['Brands', brands ?? 0, '/admin/brands'],
    ['Categories', categories ?? 0, '/admin/categories'],
    ['New quotes', quotes ?? 0, '/admin/quotes'],
  ]

  return (
    <main className="min-h-screen bg-[#f7f9fc] px-6 py-10 text-[#16233d]">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-sm font-bold uppercase tracking-[0.24em] text-[#c8102e]">Taj Traders FSD</p><h1 className="mt-2 text-4xl font-bold">Catalog dashboard</h1><p className="mt-2 text-slate-500">Signed in as {user.email}</p></div>
          <Link href="/" className="rounded-xl border border-[#123b7a] px-4 py-2 text-sm font-bold text-[#123b7a]">View public site</Link>
        </div>
        <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" aria-label="Catalog summary">
          {cards.map(([label, value, href]) => <Link href={href} key={label} className="rounded-2xl border border-[#dce5f2] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><p className="text-sm font-semibold text-slate-500">{label}</p><p className="mt-3 text-4xl font-bold text-[#123b7a]">{value}</p><p className="mt-4 text-sm font-bold text-[#c8102e]">Manage →</p></Link>)}
        </section>
        <section className="mt-8 rounded-2xl border border-[#dce5f2] bg-white p-6"><h2 className="text-xl font-bold">Admin access</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Admin access is controlled by Supabase Auth and the user&apos;s server-managed app metadata role. Product and quote data stays protected by database policies.</p></section>
      </div>
    </main>
  )
}
