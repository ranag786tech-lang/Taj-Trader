'use server'

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

const tables = new Set(['products', 'brands', 'categories'])

async function authorized() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = user?.app_metadata?.role === 'admin' || user?.app_metadata?.is_admin === true
  return isAdmin
}

function adminDb() {
  return createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { autoRefreshToken: false, persistSession: false } })
}

export async function GET(request: Request) {
  if (!(await authorized())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const table = new URL(request.url).searchParams.get('table') ?? ''
  if (!tables.has(table)) return NextResponse.json({ error: 'Invalid table' }, { status: 400 })
  const { data, error } = await adminDb().from(table).select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: 'Unable to load catalog' }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(request: Request) {
  if (!(await authorized())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  const table = body.table as string
  if (!tables.has(table)) return NextResponse.json({ error: 'Invalid table' }, { status: 400 })
  const payload = table === 'products'
    ? { name: String(body.name).trim(), slug: String(body.slug).trim(), description: body.description || null, category_id: body.category_id, brand_id: body.brand_id, sizes: body.sizes ?? [], finish_type: body.finish_type || null, coverage: body.coverage || null, price: body.price ? Number(body.price) : null, ask_price: body.ask_price !== false, is_featured: Boolean(body.is_featured), stock_status: body.stock_status || 'IN_STOCK' }
    : { name: String(body.name).trim(), slug: String(body.slug).trim(), description: body.description || null, is_active: true, ...(table === 'brands' ? { is_verified: true } : {}) }
  const { data, error } = await adminDb().from(table).insert(payload).select().single()
  if (error) return NextResponse.json({ error: 'Unable to create record' }, { status: 400 })
  return NextResponse.json({ data }, { status: 201 })
}

export async function DELETE(request: Request) {
  if (!(await authorized())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  const table = body.table as string
  if (!tables.has(table) || !body.id) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  const { error } = await adminDb().from(table).delete().eq('id', body.id)
  if (error) return NextResponse.json({ error: 'Unable to delete record' }, { status: 400 })
  return NextResponse.json({ ok: true })
}
