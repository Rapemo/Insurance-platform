import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { startDate, endDate } = Object.fromEntries(new URL(request.url).searchParams);

    const [start, end] = [startDate, endDate].map(date => 
      date ? new Date(date) : null
    );

    // Get policy statistics
    const { data: policyStats, error: policyError } = await supabase
      .from('policies')
      .select(`
        coverage_type,
        count(*) as total,
        sum(coverage_amount) as total_coverage,
        avg(coverage_amount) as average_coverage
      `)
      .match({ status: 'active' })
      .gte('start_date', start)
      .lte('end_date', end)
      .group('coverage_type');

    if (policyError) throw policyError;

    // Get claim statistics
    const { data: claimStats, error: claimError } = await supabase
      .from('claims')
      .select(`
        status,
        count(*) as total,
        sum(claim_amount) as total_amount,
        avg(claim_amount) as average_amount
      `)
      .gte('created_at', start)
      .lte('created_at', end)
      .group('status');

    if (claimError) throw claimError;

    // Get quote statistics
    const { data: quoteStats, error: quoteError } = await supabase
      .from('quotes')
      .select(`
        coverage_type,
        count(*) as total,
        sum(monthly_premium) as total_premium,
        avg(monthly_premium) as average_premium
      `)
      .gte('created_at', start)
      .lte('created_at', end)
      .group('coverage_type');

    if (quoteError) throw quoteError;

    return NextResponse.json({
      policies: policyStats,
      claims: claimStats,
      quotes: quoteStats
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
