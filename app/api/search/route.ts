import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { search, type = 'all' } = Object.fromEntries(new URL(request.url).searchParams);

    if (!search) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    const searchQuery = search.toLowerCase();
    const query = supabase
      .from('policies')
      .select('*, claims:claims(*)')
      .or(`
        policy_number.ilike.%${searchQuery}%,
        insured_name.ilike.%${searchQuery}%
      `);

    if (type === 'policies') {
      query.select('*, claims:claims(*)');
    } else if (type === 'claims') {
      query.select('claims:claims(*)');
    }

    const { data, error } = await query;

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to search' }, { status: 500 });
  }
}
