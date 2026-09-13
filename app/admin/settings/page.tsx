import Link from 'next/link'

export default function AdminSettingsPage() {
  return (
    <main className="min-h-screen bg-[#f7f9fc] px-6 py-10 text-[#16233d]">
      <div className="mx-auto max-w-3xl">
        <Link href="/admin" className="font-bold text-[#123b7a]">← Dashboard</Link>
        <p className="mt-8 text-sm font-bold uppercase tracking-[0.24em] text-[#c8102e]">Taj Traders FSD</p>
        <h1 className="mt-2 text-4xl font-bold">Settings</h1>
        <section className="mt-8 rounded-2xl border border-[#dce5f2] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Server configuration</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">The admin password is read securely from <code>ADMIN_PASSWORD</code>. Catalog changes are stored in Vercel KV when the KV integration is connected.</p>
          <p className="mt-4 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">If KV is not connected, the public website remains available using its built-in fallback catalog. Connect a Vercel KV/Redis store before using this dashboard in production.</p>
        </section>
      </div>
    </main>
  )
}
