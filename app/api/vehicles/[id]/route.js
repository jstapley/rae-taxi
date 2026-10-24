import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    if (!UUID_RE.test(id)) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }
    const supabase = createServerClient();

    const [vehicleRes, blockedRes, insuranceRes] = await Promise.all([
      supabase.from('vehicles').select('*').eq('id', id).single(),
      supabase.from('blocked_dates').select('date').eq('vehicle_id', id),
      supabase.from('insurance_options').select('*').order('sort_order'),
    ]);

    if (vehicleRes.error) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    return NextResponse.json({
      vehicle: vehicleRes.data,
      blockedDates: (blockedRes.data || []).map((d) => d.date),
      insuranceOptions: insuranceRes.data || [],
    });
  } catch (err) {
    console.error('GET /api/vehicles/[id] error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
