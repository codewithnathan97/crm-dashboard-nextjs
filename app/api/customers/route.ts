import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { customers } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const allCustomers = await db.select().from(customers).orderBy(desc(customers.createdAt));
    return NextResponse.json(allCustomers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newCustomer = await db.insert(customers).values(body).returning();
    return NextResponse.json(newCustomer[0], { status: 201 });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}

