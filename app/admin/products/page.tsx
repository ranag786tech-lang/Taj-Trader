'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Trash2, Edit2 } from 'lucide-react'
import { Product, Brand, Category } from '@/lib/catalog'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    brandId: '',
    categoryId: '',
    type: '',
    sizes: '',
    coverage: '',
    askPrice: true,
  })

  useEffect(() => {
    async function loadData() {
      try {
        const [productsRes, brandsRes, categoriesRes] = await Promise.all([
          fetch('/api/admin/products'),
          fetch('/api/admin/brands'),
          fetch('/api/admin/categories'),
        ])

        setProducts(await productsRes.json())
        setBrands(await brandsRes.json())
        setCategories(await categoriesRes.json())
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('Saving…')

    try {
      const product: Omit<Product, 'id' | 'slug' | 'images' | 'isFeatured' | 'stockStatus'> & {
        id?: string
      } = {
        name: formData.name,
        brandId: formData.brandId,
        categoryId: formData.categoryId,
        type: formData.type,
        sizes: formData.sizes.split(',').map(s => s.trim()),
        coverage: formData.coverage,
        askPrice: formData.askPrice,
      }

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...product,
          id: `prod_${Date.now()}`,
          slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
          images: [],
          isFeatured: false,
          stockStatus: 'IN_STOCK',
        }),
      })

      if (!res.ok) {
        setStatus('Failed to save product.')
        return
      }

      setFormData({ name: '', brandId: '', categoryId: '', type: '', sizes: '', coverage: '', askPrice: true })
      setStatus('Product saved successfully!')

      const updatedProducts = await fetch('/api/admin/products').then(r => r.json())
      setProducts(updatedProducts)
    } catch (error) {
      setStatus('Error saving product.')
      console.error(error)
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this product?')) return

    try {
      const res = await fetch('/api/admin/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (!res.ok) {
        setStatus('Failed to delete product.')
        return
      }

      const updatedProducts = await fetch('/api/admin/products').then(r => r.json())
      setProducts(updatedProducts)
      setStatus('Product deleted.')
    } catch (error) {
      setStatus('Error deleting product.')
      console.error(error)
    }
  }

  const getBrandName = (brandId: string) => brands.find(b => b.id === brandId)?.name || 'Unknown'
  const getCategoryName = (categoryId: string) => categories.find(c => c.id === categoryId)?.name || 'Unknown'

  return (
    <main className="min-h-screen bg-[#f7f9fc] px-4 py-8 text-[#16233d] sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-[#123b7a]">
          <ArrowLeft size={16} />
          Dashboard
        </Link>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#c8102e]">Catalog CMS</p>
            <h1 className="mt-2 text-4xl font-bold">Manage Products</h1>
            <p className="mt-2 text-slate-500">Add, edit, or delete paint products</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
          <form onSubmit={handleSubmit} className="rounded-2xl border border-[#dce5f2] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Add Product</h2>
            <div className="mt-5 space-y-4">
              <label className="block text-sm font-semibold">
                Product Name
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>

              <label className="block text-sm font-semibold">
                Brand
                <select
                  required
                  value={formData.brandId}
                  onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                >
                  <option value="">Select brand</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-semibold">
                Category
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-semibold">
                Type (e.g. Interior Emulsion)
                <input
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>

              <label className="block text-sm font-semibold">
                Sizes (comma-separated, e.g. 1L, 4L, 16L)
                <input
                  value={formData.sizes}
                  onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>

              <label className="block text-sm font-semibold">
                Coverage (e.g. 100 sq ft per Liter)
                <input
                  value={formData.coverage}
                  onChange={(e) => setFormData({ ...formData, coverage: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>

              <label className="flex items-center gap-2 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={formData.askPrice}
                  onChange={(e) => setFormData({ ...formData, askPrice: e.target.checked })}
                />
                Ask Price (instead of showing fixed price)
              </label>

              <button className="w-full rounded-lg bg-[#c8102e] px-4 py-3 font-bold text-white hover:bg-[#a80d26]">
                Save Product
              </button>
              {status && <p className="text-sm text-slate-600" role="status">{status}</p>}
            </div>
          </form>

          <section className="rounded-2xl border border-[#dce5f2] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Existing Products</h2>
              <span className="text-sm text-slate-500">{products.length} total</span>
            </div>

            {loading ? (
              <p className="mt-8 text-slate-500">Loading products…</p>
            ) : products.length === 0 ? (
              <p className="mt-8 rounded-xl bg-[#f7f9fc] p-6 text-slate-500">No products yet. Add one using the form.</p>
            ) : (
              <div className="mt-5 divide-y divide-slate-100">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between gap-4 py-4">
                    <div>
                      <p className="font-bold">{product.name}</p>
                      <p className="text-sm text-slate-500">
                        {getBrandName(product.brandId)} • {getCategoryName(product.categoryId)}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">{product.type}</p>
                      <p className="text-xs text-slate-500">Sizes: {product.sizes.join(', ')}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(product.id)}
                      aria-label={`Delete ${product.name}`}
                      className="rounded-lg p-2 text-[#c8102e] hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
