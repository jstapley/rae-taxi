import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    if (!name?.trim()) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    if (!message?.trim()) return NextResponse.json({ error: 'Message is required' }, { status: 400 });

    // Save to DB
    const supabase = createServerClient();
    const { error } = await supabase.from('contact_messages').insert({
      name: name.trim(),
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      message: message.trim(),
    });

    if (error) throw error;

    // Send email notification
    try {
      await resend.emails.send({
        from: 'Everyone Loves Raymond <bookings@privateluxurytransportationantigua.com>',
        to: 'rae.js.peters@gmail.com',
        bcc: 'jeff@stapleyinc.com',
        subject: `New Contact Message — ${name.trim()}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <table cellpadding="6" style="font-family:sans-serif;font-size:14px;">
            <tr><td><strong>Name</strong></td><td>${name.trim()}</td></tr>
            <tr><td><strong>Email</strong></td><td>${email?.trim() || '—'}</td></tr>
            <tr><td><strong>Phone</strong></td><td>${phone?.trim() || '—'}</td></tr>
            <tr><td><strong>Message</strong></td><td>${message.trim()}</td></tr>
          </table>
        `,
      });
    } catch (emailErr) {
      console.error('Email send failed:', emailErr.message);
    }

    return NextResponse.json({ message: 'Message received' }, { status: 201 });
  } catch (err) {
    console.error('POST /api/contact error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
