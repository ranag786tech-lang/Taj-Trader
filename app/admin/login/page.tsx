'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) {
      setError('Invalid email or password.')
      setLoading(false)
      return
    }
    router.push('/admin')
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-[#f7f9fc] px-6 py-16 text-[#16233d]">
      <div className="mx-auto max-w-md rounded-3xl border border-[#dce5f2] bg-white p-8 shadow-xl shadow-[#123b7a]/10">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#c8102e]">Taj Traders FSD</p>
        <h1 className="mt-3 text-3xl font-bold">Admin sign in</h1>
        <p className="mt-2 text-sm text-slate-500">Manage products, brands, categories, and quote requests.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block text-sm font-semibold">Email<input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#123b7a]" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <label className="block text-sm font-semibold">Password<input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#123b7a]" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p> : null}
          <button className="w-full rounded-xl bg-[#c8102e] px-4 py-3 font-bold text-white transition hover:bg-[#a80d27] disabled:opacity-60" disabled={loading}>{loading ? 'Signing in…' : 'Sign in securely'}</button>
        </form>
      </div>
    </main>
  )
}
