import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data: claims, error } = await supabase
      .from('claims')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(claims);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch claims' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { claimNumber, description, claimAmount, policyId } = await request.json();

    const { data: claim, error } = await supabase
      .from('claims')
      .insert({
        claim_number: claimNumber,
        description,
        claim_amount: claimAmount,
        policy_id: policyId,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(claim);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create claim' }, { status: 500 });
  }
}
