import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, email, company, phone, interest, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Log the contact form submission (in production, you would save to database or send email)
    console.log('Contact Form Submission:', {
      name,
      email,
      company,
      phone,
      interest,
      message,
      timestamp: new Date().toISOString(),
    });

    // In production, you would:
    // 1. Save to database
    // 2. Send email notification to sales team
    // 3. Send confirmation email to the customer

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been sent successfully. We will get back to you within 24 hours.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
