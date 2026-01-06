import { NextRequest, NextResponse } from 'next/server';

interface LeadData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  loanAmount: string;
  purpose: string;
  preferredLocation: string;
  storeId: string;
  loanType: string;
}

export async function POST(request: NextRequest) {
  try {
    const leadData: LeadData = await request.json();

    // Validate required fields
    if (!leadData.firstName || !leadData.lastName || !leadData.email || !leadData.phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: Integrate with your CRM/lead management system
    // Options:
    // 1. Send to Zapier webhook
    // 2. Save to database (PostgreSQL, MongoDB, etc.)
    // 3. Send to email service (SendGrid, Mailgun)
    // 4. Send to CRM API (Salesforce, HubSpot, etc.)
    // 5. Send to Google Sheets via API

    // Example: Log to console (replace with actual integration)
    console.log('New Lead:', {
      ...leadData,
      timestamp: new Date().toISOString(),
      source: 'loan-locator',
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    });

    // Example: Send to webhook (uncomment and configure)
    /*
    const webhookUrl = process.env.LEAD_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });
    }
    */

    // Example: Save to database (uncomment and configure)
    /*
    // Using Prisma example
    const lead = await prisma.lead.create({
      data: {
        firstName: leadData.firstName,
        lastName: leadData.lastName,
        email: leadData.email,
        phone: leadData.phone,
        loanAmount: leadData.loanAmount,
        purpose: leadData.purpose,
        preferredLocation: leadData.preferredLocation,
        storeId: leadData.storeId,
        loanType: leadData.loanType,
        source: 'loan-locator',
        status: 'new'
      }
    });
    */

    return NextResponse.json({
      success: true,
      message: 'Lead submitted successfully'
    });

  } catch (error: any) {
    console.error('Lead submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

