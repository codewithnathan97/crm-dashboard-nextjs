import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { deals } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id)
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid deal ID' }, { status: 400 });
    }

    // Check if deal exists
    const existingDeal = await db.select().from(deals).where(eq(deals.id, id)).limit(1);
    
    if (existingDeal.length === 0) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    const body = await request.json();

    // Validate provided fields
    if (body.title !== undefined && (!body.title || body.title.trim().length === 0)) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (body.customerId !== undefined && (!body.customerId || body.customerId <= 0)) {
      return NextResponse.json({ error: 'Valid customer ID is required' }, { status: 400 });
    }

    if (body.value !== undefined && (typeof body.value !== 'number' || body.value < 0)) {
      return NextResponse.json({ error: 'Value must be a non-negative number' }, { status: 400 });
    }

    const validStages = ['prospecting', 'qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost'];
    if (body.stage !== undefined && !validStages.includes(body.stage)) {
      return NextResponse.json({ error: 'Invalid stage value' }, { status: 400 });
    }

    // Build update data
    const updateData: any = {
      ...body,
      updatedAt: new Date().toISOString(),
    };

    // Auto-set actualCloseDate if stage is closed-won or closed-lost
    if (body.stage === 'closed-won' || body.stage === 'closed-lost') {
      if (!existingDeal[0].actualCloseDate) {
        updateData.actualCloseDate = new Date().toISOString();
      }
    }

    // Update deal
    await db.update(deals).set(updateData).where(eq(deals.id, id));

    // Fetch and return updated deal
    const updatedDeal = await db.select().from(deals).where(eq(deals.id, id)).limit(1);

    return NextResponse.json(updatedDeal[0]);
  } catch (error) {
    console.error('Error updating deal:', error);
    return NextResponse.json({ error: 'Failed to update deal' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id)
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid deal ID' }, { status: 400 });
    }

    // Check if deal exists
    const existingDeal = await db.select().from(deals).where(eq(deals.id, id)).limit(1);
    
    if (existingDeal.length === 0) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    // Delete deal (cascade deletes will handle related records)
    await db.delete(deals).where(eq(deals.id, id));

    console.log(`Deal ${id} deleted successfully`);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting deal:', error);
    return NextResponse.json({ error: 'Failed to delete deal' }, { status: 500 });
  }
}