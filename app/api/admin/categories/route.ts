import { NextRequest, NextResponse } from 'next/server'
import { getCategories, addCategory, updateCategory, deleteCategory } from '@/lib/catalog'
import { Category } from '@/lib/catalog'

export async function GET() {
  try {
    const categories = await getCategories()
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const category: Category = await request.json()

    if (!category.name || !category.slug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await addCategory(category)
    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Missing category ID' }, { status: 400 })
    }

    await updateCategory(id, updates)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Missing category ID' }, { status: 400 })
    }

    await deleteCategory(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
