import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      vehicle_id,
      customer_name,
      customer_email,
      customer_phone,
      license_number,
      license_country,
      pickup_date,
      dropoff_date,
      insurance_option_id,
      total_amount,
      notes,
    } = body;

    // Validate required fields
    if (!customer_name || !customer_name.trim()) {
      return NextResponse.json({ error: 'Customer name is required' }, { status: 400 });
    }
    if (!customer_phone || !customer_phone.trim()) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }
    if (!license_number || !license_number.trim()) {
      return NextResponse.json({ error: "Driver's license number is required" }, { status: 400 });
    }
    if (!pickup_date || !dropoff_date) {
      return NextResponse.json({ error: 'Pickup and drop-off dates are required' }, { status: 400 });
    }
    if (!vehicle_id) {
      return NextResponse.json({ error: 'Vehicle is required' }, { status: 400 });
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        vehicle_id,
        customer_name: customer_name.trim(),
        customer_email: customer_email?.trim() || null,
        customer_phone: customer_phone.trim(),
        license_number: license_number.trim(),
        license_country: license_country?.trim() || null,
        pickup_date,
        dropoff_date,
        insurance_option_id: insurance_option_id || null,
        total_amount: total_amount || null,
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
        subject: `New Rental Booking — ${customer_name.trim()}`,
        html: `
          <h2>New Vehicle Rental Booking</h2>
          <table cellpadding="6" style="font-family:sans-serif;font-size:14px;">
            <tr><td><strong>Name</strong></td><td>${customer_name.trim()}</td></tr>
            <tr><td><strong>Phone</strong></td><td>${customer_phone.trim()}</td></tr>
            <tr><td><strong>Email</strong></td><td>${customer_email?.trim() || '—'}</td></tr>
            <tr><td><strong>Pickup Date</strong></td><td>${pickup_date}</td></tr>
            <tr><td><strong>Drop-off Date</strong></td><td>${dropoff_date}</td></tr>
            <tr><td><strong>License #</strong></td><td>${license_number.trim()}</td></tr>
            <tr><td><strong>License Country</strong></td><td>${license_country?.trim() || '—'}</td></tr>
            <tr><td><strong>Total</strong></td><td>${total_amount ? '$' + total_amount + ' USD' : 'TBD'}</td></tr>
            <tr><td><strong>Notes</strong></td><td>${notes?.trim() || '—'}</td></tr>
          </table>
        `,
      });
    } catch (emailErr) {
      console.error('Email send failed:', emailErr.message);
    }

    return NextResponse.json({ id: data.id, message: 'Booking request received' }, { status: 201 });
  } catch (err) {
    console.error('POST /api/bookings error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
