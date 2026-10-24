import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      customer_name,
      customer_phone,
      pickup_location,
      dropoff_location,
      pickup_datetime,
      passengers,
      price_quoted,
      notes,
    } = body;

    // Validate required fields
    if (!customer_name || !customer_name.trim()) {
      return NextResponse.json({ error: 'Customer name is required' }, { status: 400 });
    }
    if (!customer_phone || !customer_phone.trim()) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }
    if (!pickup_location || !pickup_location.trim()) {
      return NextResponse.json({ error: 'Pickup location is required' }, { status: 400 });
    }
    if (!dropoff_location || !dropoff_location.trim()) {
      return NextResponse.json({ error: 'Drop-off location is required' }, { status: 400 });
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('taxi_requests')
      .insert({
        customer_name: customer_name.trim(),
        customer_phone: customer_phone.trim(),
        pickup_location: pickup_location.trim(),
        dropoff_location: dropoff_location.trim(),
        pickup_datetime: pickup_datetime || null,
        passengers: passengers || 1,
        price_quoted: price_quoted || null,
        notes: notes?.trim() || null,
        status: 'pending',
      })
      .select('id')
      .single();

    if (error) throw error;

    return NextResponse.json({ id: data.id, message: 'Taxi request received' }, { status: 201 });
  } catch (err) {
    console.error('POST /api/taxi error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
