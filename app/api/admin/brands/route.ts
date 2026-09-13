import { NextRequest, NextResponse } from 'next/server'
import { getBrands, addBrand, updateBrand, deleteBrand } from '@/lib/catalog'
import { Brand } from '@/lib/catalog'

export async function GET() {
  try {
    const brands = await getBrands()
    return NextResponse.json(brands)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const brand: Brand = await request.json()

    if (!brand.name || !brand.slug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await addBrand(brand)
    return NextResponse.json(brand, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create brand' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Missing brand ID' }, { status: 400 })
    }

    await updateBrand(id, updates)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update brand' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Missing brand ID' }, { status: 400 })
    }

    await deleteBrand(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete brand' }, { status: 500 })
  }
}
