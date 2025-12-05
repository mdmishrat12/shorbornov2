import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/db';
import { courses, subjects, lessons } from '@/schema/user.schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { authOptions } from '../auth/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get courses created by the user (for teachers) or enrolled courses (for students)
    const userCourses = await db
      .select()
      .from(courses)
      .where(eq(courses.userId, session.user.id))
      .orderBy(courses.createdAt);

    return NextResponse.json({ courses: userCourses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { course: courseData, subjects: subjectsData } = body;

    // Validate course data
    if (!courseData.title?.trim()) {
      return NextResponse.json({ error: 'Course title is required' }, { status: 400 });
    }

    if (!subjectsData || subjectsData.length === 0) {
      return NextResponse.json({ error: 'At least one subject is required' }, { status: 400 });
    }

    const courseId = uuidv4();

    // Create course
    const [newCourse] = await db
      .insert(courses)
      .values({
        id: courseId,
        title: courseData.title,
        description: courseData.description,
        category: courseData.category,
        thumbnail: courseData.thumbnail,
        userId: session.user.id,
      })
      .returning();

    // Create subjects and lessons
    for (const subjectData of subjectsData) {
      const subjectId = uuidv4();
      
      await db.insert(subjects).values({
        id: subjectId,
        name: subjectData.name,
        description: subjectData.description,
        courseId: courseId,
        order: subjectsData.indexOf(subjectData),
      });

      // Create lessons for this subject
      if (subjectData.lessons && subjectData.lessons.length > 0) {
        const lessonValues = subjectData.lessons.map((lessonData: any, index: number) => ({
          id: uuidv4(),
          title: lessonData.title,
          content: '', // Can be added later
          estimatedMarks: lessonData.estimatedMarks || 0,
          importance: lessonData.importance || 'medium',
          subjectId: subjectId,
          order: index,
          isPublished: true,
        }));

        await db.insert(lessons).values(lessonValues);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Course created successfully',
      course: newCourse 
    });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}