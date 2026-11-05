import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    if (!name?.trim()) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    if (!message?.trim()) return NextResponse.json({ error: 'Message is required' }, { status: 400 });

    await resend.emails.send({
      from: 'Peridot Car Rentals <bookings@privateluxurytransportationantigua.com>',
      to: 'peridotcarrentals@gmail.com',
      bcc: 'jeff@stapleyinc.com',
      subject: `New Car Rental Enquiry — ${name.trim()}`,
      html: `
        <h2>New Car Rental Enquiry — Peridot Car Rentals</h2>
        <table cellpadding="6" style="font-family:sans-serif;font-size:14px;">
          <tr><td><strong>Name</strong></td><td>${name.trim()}</td></tr>
          <tr><td><strong>Email</strong></td><td>${email?.trim() || '—'}</td></tr>
          <tr><td><strong>Phone</strong></td><td>${phone?.trim() || '—'}</td></tr>
          <tr><td><strong>Message</strong></td><td>${message.trim()}</td></tr>
        </table>
      `,
    });

    return NextResponse.json({ message: 'Enquiry received' }, { status: 201 });
  } catch (err) {
    console.error('POST /api/contact/car-rental error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
