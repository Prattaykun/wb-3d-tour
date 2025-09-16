// app/api/browse/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '12', 10)

  if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
    return NextResponse.json({ error: 'Invalid page or limit parameter' }, { status: 400 })
  }

  const { data, error } = await supabase.rpc('browse_items', {
    page,
    page_size: limit,
  })

  if (error) {
    console.error('Supabase RPC error:', error)
    return NextResponse.json({ error: 'Failed to fetch browse items' }, { status: 500 })
  }

  const results = (data || []).map((item: any) => ({
    id: item.id,
    type: item.type,
    name: item.name,
    image: item.image,
    rating: item.rating,
    location: item.city,
    description: item.description,
  }))

  return NextResponse.json({ results })
}
