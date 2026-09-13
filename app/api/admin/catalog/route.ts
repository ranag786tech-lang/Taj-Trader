import { NextRequest, NextResponse } from 'next/server'
import {
  getProducts, getBrands, getCategories,
  addProduct, addBrand, addCategory,
  deleteProduct, deleteBrand, deleteCategory,
} from '@/lib/catalog'

const loaders = { products: getProducts, brands: getBrands, categories: getCategories }

export async function GET(request: NextRequest) {
  const table = request.nextUrl.searchParams.get('table') as keyof typeof loaders
  if (!loaders[table]) return NextResponse.json({ error: 'Invalid table' }, { status: 400 })
  return NextResponse.json({ data: await loaders[table]() })
}

export async function POST(request: NextRequest) {
  const { table, name, slug, description } = await request.json()
  const id = `${table.slice(0, -1)}_${Date.now()}`
  if (!name || !slug || !loaders[table as keyof typeof loaders]) return NextResponse.json({ error: 'Invalid record' }, { status: 400 })
  if (table === 'products') await addProduct({ id, name, slug, description, brandId: '', categoryId: '', type: '', sizes: [], askPrice: true, images: [], isFeatured: false, stockStatus: 'IN_STOCK' })
  if (table === 'brands') await addBrand({ id, name, slug, description })
  if (table === 'categories') await addCategory({ id, name, slug, description })
  return NextResponse.json({ id, name, slug, description }, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const { table, id } = await request.json()
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  if (table === 'products') await deleteProduct(id)
  else if (table === 'brands') await deleteBrand(id)
  else if (table === 'categories') await deleteCategory(id)
  else return NextResponse.json({ error: 'Invalid table' }, { status: 400 })
  return NextResponse.json({ success: true })
}

export const PUT = async () => NextResponse.json({ error: 'Use the resource-specific admin endpoints' }, { status: 405 })

export const runtime = 'nodejs'

