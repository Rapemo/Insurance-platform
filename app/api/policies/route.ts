import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data: policies, error } = await supabase
      .from('policies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(policies);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch policies' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { policyNumber, insuredName, coverageAmount, coverageType, startDate, endDate } = await request.json();

    const { data: policy, error } = await supabase
      .from('policies')
      .insert({
        policy_number: policyNumber,
        insured_name: insuredName,
        coverage_amount: coverageAmount,
        coverage_type: coverageType,
        start_date: startDate,
        end_date: endDate,
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(policy);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create policy' }, { status: 500 });
  }
}
