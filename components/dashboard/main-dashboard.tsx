// components/main-dashboard.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, RefreshCw } from "lucide-react";
import { DashboardHeader } from "./dashboard-header";
import { GoalSetup } from "./goal-setup";
import { ProgressOverview } from "./progress-overview2";
import { StudyPlan } from "./study-plan";
import { SubjectAnalysis } from "./subject-analysis";
import { QuickActions } from "./quick-actions";

interface MainDashboardProps {
  examType: string;
  diagnosticResult: any;
  onRetakeDiagnostic: () => void;
}

export function MainDashboard({ examType, diagnosticResult, onRetakeDiagnostic }: MainDashboardProps) {
  const getPreparationPercentage = () => {
    switch (diagnosticResult.level) {
      case 'easy': return 20;
      case 'medium': return 50;
      case 'hard': return 60;
      default: return 20;
    }
  };

  return (
    <div>
      <DashboardHeader />
      
      {/* Diagnostic Result Banner */}
      <Card className="mb-6 border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-green-900">
                ডায়াগনস্টিক টেস্ট ফলাফল
              </h3>
              <p className="text-green-700 text-sm">
                আপনার প্রস্তুতি স্তর: <span className="font-bold capitalize">{diagnosticResult.level}</span> 
                ({getPreparationPercentage()}% প্রস্তুত)
              </p>
              <p className="text-green-700 text-sm">
                স্কোর: {diagnosticResult.score}/{diagnosticResult.totalQuestions} 
                ({(diagnosticResult.score / diagnosticResult.totalQuestions * 100).toFixed(1)}%)
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={onRetakeDiagnostic}>
              <RefreshCw className="h-4 w-4 mr-2" />
              আবার টেস্ট দিন
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <GoalSetup examType={examType} />
        </div>
        <div className="lg:col-span-1">
          <ProgressOverview 
            diagnosticResult={diagnosticResult}
            preparationPercentage={getPreparationPercentage()}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <StudyPlan 
            examType={examType}
            diagnosticResult={diagnosticResult}
          />
          <SubjectAnalysis examType={examType} />
        </div>
        <div className="lg:col-span-1">
          <QuickActions examType={examType} />
        </div>
      </div>
    </div>
  );
}