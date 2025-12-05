import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { eq } from 'drizzle-orm';
import { authOptions } from '../../auth/auth';
import { db } from '@/db';
import { users } from '@/schema/user.schema';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .then(res => res[0]);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Format response data
    const profileData = {
      personal: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        address: user.address,
        avatar: user.name?.split(' ').map(n => n[0]).join('') || 'U',
        joinDate: new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      },
      academic: {
        institution: user.institution,
        degree: user.degree,
        graduationYear: user.graduationYear,
        cgpa: user.cgpa,
        bcsExam: user.bcsExam,
        targetCadre: user.targetCadre,
        preparationStart: user.preparationStart,
        studyHours: user.studyHours
      },
      stats: user.stats || {
        examsTaken: 0,
        totalQuestions: 0,
        averageScore: 0,
        accuracy: 0,
        currentRank: 0,
        improvement: 0,
        streak: 0,
        studyTime: "0h 0m"
      },
      preferences: user.preferences || {
        emailNotifications: true,
        pushNotifications: false,
        studyReminders: true,
        weeklyReports: true,
        publicProfile: true,
        language: 'English',
        theme: 'Light'
      },
      subscription: user.subscription || {
        plan: 'Free',
        status: 'Active',
        since: new Date().toISOString().split('T')[0],
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        features: ['Basic Tests', 'Progress Tracking']
      }
    };

    return NextResponse.json(profileData);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}