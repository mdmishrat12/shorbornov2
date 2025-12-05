import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { eq } from 'drizzle-orm';
import { authOptions } from '@/app/api/auth/auth';
import { users } from '@/schema/user.schema';
import { db } from '@/db';

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { stats } = await request.json();

    const [updatedUser] = await db
      .update(users)
      .set({ 
        stats,
        updatedAt: new Date()
      })
      .where(eq(users.id, session.user.id))
      .returning();

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Stats updated successfully',
      stats: updatedUser.stats 
    });
  } catch (error) {
    console.error('Error updating user stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}