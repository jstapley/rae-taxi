import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Send email notification (best effort)
    try {
      await resend.emails.send({
        from: 'Everyone Loves Raymond <bookings@privateluxurytransportationantigua.com>',
        to: 'rae.js.peters@gmail.com',
        bcc: 'jeff@stapleyinc.com',
        subject: `New Taxi Quote Request — ${customer_name.trim()}`,
        html: `
          <h2>New Taxi Quote Request</h2>
          <table cellpadding="6" style="font-family:sans-serif;font-size:14px;">
            <tr><td><strong>Name</strong></td><td>${customer_name.trim()}</td></tr>
            <tr><td><strong>Phone</strong></td><td>${customer_phone.trim()}</td></tr>
            <tr><td><strong>Pickup</strong></td><td>${pickup_location.trim()}</td></tr>
            <tr><td><strong>Drop-off</strong></td><td>${dropoff_location.trim()}</td></tr>
            <tr><td><strong>Date/Time</strong></td><td>${pickup_datetime || 'To be confirmed'}</td></tr>
            <tr><td><strong>Passengers</strong></td><td>${passengers || 1}</td></tr>
            <tr><td><strong>Notes</strong></td><td>${notes?.trim() || '—'}</td></tr>
          </table>
        `,
      });
    } catch (emailErr) {
      console.error('Email send failed:', emailErr.message);
    }

    return NextResponse.json({ id: data.id, message: 'Taxi request received' }, { status: 201 });
  } catch (err) {
    console.error('POST /api/taxi error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
