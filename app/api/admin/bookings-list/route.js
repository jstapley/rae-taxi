import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const supabase = createServerClient();
    let query = supabase
      .from('bookings')
      .select('*, vehicles(name, make, model, year)')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    console.error('GET /api/admin/bookings-list error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
