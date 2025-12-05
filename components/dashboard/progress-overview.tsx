// components/progress-overview.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Clock, Target, BarChart3 } from "lucide-react";

export function ProgressOverview() {
  const progressData = {
    overall: 45,
    easyTests: 85,
    mediumTests: 60,
    hardTests: 30,
    daysRemaining: 120,
  };

  const getPreparationLevel = () => {
    if (progressData.hardTests >= 60) return "উচ্চমান";
    if (progressData.mediumTests >= 50) return "মধ্যমান";
    if (progressData.easyTests >= 80) return "প্রাথমিক";
    return "শুরু";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-green-600" />
          প্রস্তুতি অগ্রগতি
        </CardTitle>
        <CardDescription>
          আপনার সামগ্রিক প্রস্তুতি অবস্থা
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">সামগ্রিক প্রস্তুতি</span>
            <span className="text-sm font-bold text-green-600">{progressData.overall}%</span>
          </div>
          <Progress value={progressData.overall} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <Trophy className="h-6 w-6 text-green-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-green-700">{getPreparationLevel()}</div>
            <div className="text-xs text-green-600">প্রস্তুতি লেভেল</div>
          </div>
          
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Clock className="h-6 w-6 text-blue-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-blue-700">{progressData.daysRemaining}</div>
            <div className="text-xs text-blue-600">দিন বাকি</div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>সহজ টেস্ট</span>
              <span className="font-medium">{progressData.easyTests}%</span>
            </div>
            <Progress value={progressData.easyTests} className="h-1" />
            <div className="text-xs text-gray-500 mt-1">২০% প্রস্তুতি</div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>মধ্যম টেস্ট</span>
              <span className="font-medium">{progressData.mediumTests}%</span>
            </div>
            <Progress value={progressData.mediumTests} className="h-1" />
            <div className="text-xs text-gray-500 mt-1">৫০% প্রস্তুতি</div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>কঠিন টেস্ট</span>
              <span className="font-medium">{progressData.hardTests}%</span>
            </div>
            <Progress value={progressData.hardTests} className="h-1" />
            <div className="text-xs text-gray-500 mt-1">৬০% প্রস্তুতি</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}