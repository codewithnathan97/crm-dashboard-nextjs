import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { deals } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const allDeals = await db
      .select()
      .from(deals)
      .orderBy(desc(deals.createdAt));

    return NextResponse.json(allDeals);
  } catch (error) {
    console.error('Error fetching deals:', error);
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newDeal = await db.insert(deals).values(body).returning();
    return NextResponse.json(newDeal[0], { status: 201 });
  } catch (error) {
    console.error('Error creating deal:', error);
    return NextResponse.json({ error: 'Failed to create deal' }, { status: 500 });
  }
}

