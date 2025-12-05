// app/dashboard/page.tsx
'use client';

import { ChapterExam } from "@/components/dashboard/chapter-exam";
import { SubjectDashboard } from "@/components/dashboard/subject-dashboard";
import { TargetSetup } from "@/components/dashboard/target-setup";
import { useState } from "react";

type DashboardState = 'target-setup' | 'subject-dashboard' | 'chapter-exam';

export default function DashboardPage() {
  const [currentState, setCurrentState] = useState<DashboardState>('target-setup');
  const [userTarget, setUserTarget] = useState<any>(null);
  const [selectedChapter, setSelectedChapter] = useState<any>(null);

  const handleTargetSetup = (target: any) => {
    setUserTarget(target);
    setCurrentState('subject-dashboard');
  };

  const handleStartChapterExam = (chapter: any) => {
    setSelectedChapter(chapter);
    setCurrentState('chapter-exam');
  };

  const handleExamComplete = () => {
    setCurrentState('subject-dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        {currentState === 'target-setup' && (
          <TargetSetup onTargetSet={handleTargetSetup} />
        )}
        
        {currentState === 'subject-dashboard' && userTarget && (
          <SubjectDashboard 
            userTarget={userTarget}
            onStartChapterExam={handleStartChapterExam}
          />
        )}
        
        {currentState === 'chapter-exam' && selectedChapter && (
          <ChapterExam 
            chapter={selectedChapter}
            onComplete={handleExamComplete}
            onBack={() => setCurrentState('subject-dashboard')}
          />
        )}
      </div>
    </div>
  );
}