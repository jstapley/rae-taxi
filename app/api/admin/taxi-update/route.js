import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

const VALID_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'];

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }
    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('taxi_requests')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    console.error('PATCH /api/admin/taxi-update error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
