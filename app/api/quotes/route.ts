import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data: quotes, error } = await supabase
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(quotes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { coverageType, vehicleValue, deductible } = await request.json();

    // Calculate premium based on coverage type and value
    let monthlyPremium = 0;
    let totalCoverage = 0;

    switch (coverageType) {
      case 'auto':
        monthlyPremium = (vehicleValue * 0.01) / 12; // 1% of vehicle value per year
        totalCoverage = vehicleValue;
        break;
      case 'home':
        monthlyPremium = (vehicleValue * 0.005) / 12; // 0.5% of home value per year
        totalCoverage = vehicleValue;
        break;
      case 'life':
        monthlyPremium = (vehicleValue * 0.002) / 12; // 0.2% of coverage amount per year
        totalCoverage = vehicleValue;
        break;
    }

    const { data: quote, error } = await supabase
      .from('quotes')
      .insert({
        quote_number: `Q-${Date.now()}`,
        coverage_type: coverageType,
        vehicle_value: vehicleValue,
        deductible,
        monthly_premium: monthlyPremium,
        total_coverage: totalCoverage
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(quote);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate quote' }, { status: 500 });
  }
}
