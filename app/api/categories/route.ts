// app/api/categories/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { examTypes, examSeries, topics, standards, questionBankSubjects } from '@/schema/user.schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    console.log('Fetching categories with type:', type);

    let data;

    switch (type) {
      case 'exam-types':
        data = await db
          .select()
          .from(examTypes)
          .where(eq(examTypes.isActive, true))
          .orderBy(examTypes.name);
        break;
      
      case 'exam-series':
        const examTypeId = searchParams.get('examTypeId');
        const seriesWhere = [eq(examSeries.isActive, true)];
        if (examTypeId) seriesWhere.push(eq(examSeries.examTypeId, examTypeId));
        
        data = await db
          .select({
            id: examSeries.id,
            name: examSeries.name,
            fullName: examSeries.fullName,
            year: examSeries.year,
            description: examSeries.description,
            examTypeId: examSeries.examTypeId,
            examType: examTypes,
          })
          .from(examSeries)
          .where(and(...seriesWhere))
          .leftJoin(examTypes, eq(examSeries.examTypeId, examTypes.id))
          .orderBy(desc(examSeries.year), examSeries.name);
        break;
      
      case 'topics':
        const subjectId = searchParams.get('subjectId');
        const topicsWhere = [eq(topics.isActive, true)];
        if (subjectId) topicsWhere.push(eq(topics.subjectId, subjectId));
        
        data = await db
          .select({
            id: topics.id,
            name: topics.name,
            description: topics.description,
            subjectId: topics.subjectId,
            subject: questionBankSubjects,
          })
          .from(topics)
          .where(and(...topicsWhere))
          .leftJoin(questionBankSubjects, eq(topics.subjectId, questionBankSubjects.id))
          .orderBy(topics.name);
        break;
      
      case 'standards':
        data = await db
          .select()
          .from(standards)
          .where(eq(standards.isActive, true))
          .orderBy(standards.level);
        break;
      
      case 'subjects':
        data = await db
          .select()
          .from(questionBankSubjects)
          .where(eq(questionBankSubjects.isActive, true))
          .orderBy(questionBankSubjects.name);
        break;
      
      default:
        // Return all categories when no specific type is requested
        console.log('Fetching all categories...');
        const [examTypesData, examSeriesData, subjectsData, topicsData, standardsData] = await Promise.all([
          db.select().from(examTypes).where(eq(examTypes.isActive, true)).orderBy(examTypes.name),
          db
            .select({
              id: examSeries.id,
              name: examSeries.name,
              fullName: examSeries.fullName,
              year: examSeries.year,
              description: examSeries.description,
              examTypeId: examSeries.examTypeId,
              examType: examTypes,
            })
            .from(examSeries)
            .where(eq(examSeries.isActive, true))
            .leftJoin(examTypes, eq(examSeries.examTypeId, examTypes.id))
            .orderBy(desc(examSeries.year), examSeries.name),
          db.select().from(questionBankSubjects).where(eq(questionBankSubjects.isActive, true)).orderBy(questionBankSubjects.name),
          db
            .select({
              id: topics.id,
              name: topics.name,
              description: topics.description,
              subjectId: topics.subjectId,
              subject: questionBankSubjects,
            })
            .from(topics)
            .where(eq(topics.isActive, true))
            .leftJoin(questionBankSubjects, eq(topics.subjectId, questionBankSubjects.id))
            .orderBy(topics.name),
          db.select().from(standards).where(eq(standards.isActive, true)).orderBy(standards.level),
        ]);

        data = {
          examTypes: examTypesData,
          examSeries: examSeriesData,
          subjects: subjectsData,
          topics: topicsData,
          standards: standardsData,
        };
        break;
    }

    console.log('Categories data fetched successfully');
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error' 
    }, { status: 500 });
  }
}