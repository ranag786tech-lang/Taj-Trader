import { kv } from '@vercel/kv'

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
}

export interface Brand {
  id: string
  name: string
  slug: string
  logo?: string
  description?: string
}

export interface Product {
  id: string
  name: string
  slug: string
  brandId: string
  categoryId: string
  type: string
  sizes: string[]
  coverage?: string
  price?: number
  askPrice: boolean
  images: string[]
  isFeatured: boolean
  stockStatus: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'
}

export interface QuoteRequest {
  id: string
  name: string
  phone: string
  projectType: string
  areaSize?: string
  products?: string
  message?: string
  status: 'NEW' | 'CONTACTED' | 'COMPLETED' | 'CANCELLED'
  createdAt: string
}

// Fallback data for development/empty KV
const FALLBACK_CATEGORIES: Category[] = [
  { id: '1', name: 'Interior paints', slug: 'interior-paints', description: 'Walls that feel like home', icon: 'Palette' },
  { id: '2', name: 'Exterior paints', slug: 'exterior-paints', description: 'Built for Faisalabad weather', icon: 'ShieldCheck' },
  { id: '3', name: 'Primers & putty', slug: 'primers-putty', description: 'A smoother start', icon: 'Droplets' },
]

const FALLBACK_BRANDS: Brand[] = [
  { id: '1', name: 'Nippon Paint', slug: 'nippon-paint', description: 'Premium paint solutions' },
  { id: '2', name: 'Brighto', slug: 'brighto', description: 'Weather resistant finishes' },
  { id: '3', name: 'Master Paints', slug: 'master-paints', description: 'Professional quality' },
]

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Vinilex 5000',
    slug: 'vinilex-5000',
    brandId: '1',
    categoryId: '1',
    type: 'Interior emulsion',
    sizes: ['1L', '4L', '16L'],
    coverage: '100 sq ft per Liter',
    price: undefined,
    askPrice: true,
    images: [],
    isFeatured: true,
    stockStatus: 'IN_STOCK',
  },
  {
    id: '2',
    name: 'Weather Shield',
    slug: 'weather-shield',
    brandId: '2',
    categoryId: '2',
    type: 'Exterior protection',
    sizes: ['1L', '4L', '16L'],
    coverage: '120 sq ft per Liter',
    price: undefined,
    askPrice: true,
    images: [],
    isFeatured: true,
    stockStatus: 'IN_STOCK',
  },
  {
    id: '3',
    name: 'Wood Finish',
    slug: 'wood-finish',
    brandId: '3',
    categoryId: '3',
    type: 'Wood & metal finish',
    sizes: ['500ml', '1L', '4L'],
    coverage: '150 sq ft per Liter',
    price: undefined,
    askPrice: true,
    images: [],
    isFeatured: true,
    stockStatus: 'IN_STOCK',
  },
]

async function getCategoriesKV(): Promise<Category[]> {
  try {
    const data = await kv.get('categories')
    return data ? JSON.parse(data as string) : FALLBACK_CATEGORIES
  } catch {
    return FALLBACK_CATEGORIES
  }
}

async function getBrandsKV(): Promise<Brand[]> {
  try {
    const data = await kv.get('brands')
    return data ? JSON.parse(data as string) : FALLBACK_BRANDS
  } catch {
    return FALLBACK_BRANDS
  }
}

async function getProductsKV(): Promise<Product[]> {
  try {
    const data = await kv.get('products')
    return data ? JSON.parse(data as string) : FALLBACK_PRODUCTS
  } catch {
    return FALLBACK_PRODUCTS
  }
}

async function getQuotesKV(): Promise<QuoteRequest[]> {
  try {
    const data = await kv.get('quotes')
    return data ? JSON.parse(data as string) : []
  } catch {
    return []
  }
}

// Public getters with fallback
export async function getCategories(): Promise<Category[]> {
  return getCategoriesKV()
}

export async function getBrands(): Promise<Brand[]> {
  return getBrandsKV()
}

export async function getProducts(): Promise<Product[]> {
  return getProductsKV()
}

export async function getQuotes(): Promise<QuoteRequest[]> {
  return getQuotesKV()
}

// Admin mutations
export async function addCategory(category: Category): Promise<void> {
  const categories = await getCategoriesKV()
  categories.push(category)
  await kv.set('categories', JSON.stringify(categories))
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<void> {
  const categories = await getCategoriesKV()
  const index = categories.findIndex(c => c.id === id)
  if (index > -1) {
    categories[index] = { ...categories[index], ...updates }
    await kv.set('categories', JSON.stringify(categories))
  }
}

export async function deleteCategory(id: string): Promise<void> {
  const categories = await getCategoriesKV()
  const filtered = categories.filter(c => c.id !== id)
  await kv.set('categories', JSON.stringify(filtered))
}

export async function addBrand(brand: Brand): Promise<void> {
  const brands = await getBrandsKV()
  brands.push(brand)
  await kv.set('brands', JSON.stringify(brands))
}

export async function updateBrand(id: string, updates: Partial<Brand>): Promise<void> {
  const brands = await getBrandsKV()
  const index = brands.findIndex(b => b.id === id)
  if (index > -1) {
    brands[index] = { ...brands[index], ...updates }
    await kv.set('brands', JSON.stringify(brands))
  }
}

export async function deleteBrand(id: string): Promise<void> {
  const brands = await getBrandsKV()
  const filtered = brands.filter(b => b.id !== id)
  await kv.set('brands', JSON.stringify(filtered))
}

export async function addProduct(product: Product): Promise<void> {
  const products = await getProductsKV()
  products.push(product)
  await kv.set('products', JSON.stringify(products))
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<void> {
  const products = await getProductsKV()
  const index = products.findIndex(p => p.id === id)
  if (index > -1) {
    products[index] = { ...products[index], ...updates }
    await kv.set('products', JSON.stringify(products))
  }
}

export async function deleteProduct(id: string): Promise<void> {
  const products = await getProductsKV()
  const filtered = products.filter(p => p.id !== id)
  await kv.set('products', JSON.stringify(filtered))
}

export async function addQuote(quote: QuoteRequest): Promise<void> {
  const quotes = await getQuotesKV()
  quotes.push(quote)
  await kv.set('quotes', JSON.stringify(quotes))
}

export async function updateQuote(id: string, updates: Partial<QuoteRequest>): Promise<void> {
  const quotes = await getQuotesKV()
  const index = quotes.findIndex(q => q.id === id)
  if (index > -1) {
    quotes[index] = { ...quotes[index], ...updates }
    await kv.set('quotes', JSON.stringify(quotes))
  }
}
