import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { eq } from 'drizzle-orm';
import { authOptions } from '@/app/api/auth/auth';
import { db } from '@/db';
import { users } from '@/schema/user.schema';

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { personal, academic, preferences } = body;

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date(),
    };

    // Update personal info
    if (personal) {
      updateData.name = personal.name;
      updateData.phone = personal.phone;
      updateData.dateOfBirth = personal.dateOfBirth;
      updateData.gender = personal.gender;
      updateData.address = personal.address;
    }

    // Update academic info
    if (academic) {
      updateData.institution = academic.institution;
      updateData.degree = academic.degree;
      updateData.graduationYear = academic.graduationYear;
      updateData.cgpa = academic.cgpa;
      updateData.bcsExam = academic.bcsExam;
      updateData.targetCadre = academic.targetCadre;
      updateData.preparationStart = academic.preparationStart;
      updateData.studyHours = academic.studyHours;
    }

    // Update preferences
    if (preferences) {
      updateData.preferences = preferences;
    }

    // Update user in database
    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, session.user.id))
      .returning();

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Profile updated successfully',
      user: updatedUser 
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}