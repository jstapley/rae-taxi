import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

const VALID_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'];

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    console.error('PATCH /api/admin/bookings/[id] error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
