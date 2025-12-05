import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { eq } from 'drizzle-orm';
import { authOptions } from '../../auth/auth';
import { db } from '@/db';
import { users } from '@/schema/user.schema';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { role } = await request.json();

    if (!['student', 'teacher', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Update user role
    await db
      .update(users)
      .set({ role })
      .where(eq(users.id, session.user.id));

    return NextResponse.json({ success: true, role });
  } catch (error) {
    console.error('Error updating role:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}