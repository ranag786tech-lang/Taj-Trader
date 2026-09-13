import { NextRequest, NextResponse } from 'next/server'
import { getQuotes, addQuote, updateQuote } from '@/lib/catalog'
import { QuoteRequest } from '@/lib/catalog'

export async function GET() {
  try {
    const quotes = await getQuotes()
    return NextResponse.json(quotes)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, phone, projectType, areaSize, products, message } = await request.json()

    if (!name || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const quote: QuoteRequest = {
      id: Date.now().toString(),
      name,
      phone,
      projectType,
      areaSize,
      products,
      message,
      status: 'NEW',
      createdAt: new Date().toISOString(),
    }

    await addQuote(quote)
    return NextResponse.json(quote, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create quote' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, status } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Missing quote ID' }, { status: 400 })
    }

    await updateQuote(id, { status })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update quote' }, { status: 500 })
  }
}
