import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('daily_rate', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    console.error('GET /api/vehicles error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
