import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const vehicle_id = searchParams.get('vehicle_id');

    const supabase = createServerClient();
    let query = supabase.from('blocked_dates').select('*').order('date');

    if (vehicle_id) {
      query = query.eq('vehicle_id', vehicle_id);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    console.error('GET /api/admin/blocked-dates error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { vehicle_id, dates, date, reason } = body;

    if (!vehicle_id || (!dates && !date)) {
      return NextResponse.json({ error: 'vehicle_id and dates are required' }, { status: 400 });
    }

    // Support both single date (legacy) and array of dates (range)
    const dateList = dates || [date];
    const rows = dateList.map((d) => ({ vehicle_id, date: d, reason: reason || null }));

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('blocked_dates')
      .upsert(rows, { onConflict: 'vehicle_id,date', ignoreDuplicates: true })
      .select();

    if (error) throw error;

    return NextResponse.json({ inserted: data.length }, { status: 201 });
  } catch (err) {
    console.error('POST /api/admin/blocked-dates error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const supabase = createServerClient();
    const { error } = await supabase.from('blocked_dates').delete().eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/admin/blocked-dates error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
