// app/api/categories/standards/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/db';
import { standards } from '@/schema/user.schema';
import { eq } from 'drizzle-orm';
import { authOptions } from '../../auth/auth';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const examSeriesId = randomUUID();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    if (!body.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const [newStandard] = await db
      .insert(standards)
      .values({
        id: examSeriesId,
        name: body.name,
        level: body.level,
        description: body.description,
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Standard created successfully',
      data: newStandard,
    });
  } catch (error) {
    console.error('Error creating standard:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
export async function GET() {
  try {
    const data = await db
      .select({
        id: standards.id,
        name: standards.name,
        level: standards.level,
      })
      .from(standards)
      .where(eq(standards.isActive, true))
      .orderBy(standards.level, standards.name);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching standards:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}