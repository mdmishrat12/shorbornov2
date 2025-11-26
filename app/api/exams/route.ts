// app/api/exams/route.ts
import { prisma } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const exams = await prisma.exam.findMany({
      include: {
        subject: true,
        _count: {
          select: {
            examAttempts: true
          }
        }
      },
      where: {
        isActive: true
      }
    })
    
    return NextResponse.json(exams)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch exams" },
      { status: 500 }
    )
  }
}