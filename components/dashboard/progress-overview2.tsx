// components/progress-overview.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Clock, Target, BarChart3 } from "lucide-react";

interface ProgressOverviewProps {
  diagnosticResult: any;
  preparationPercentage: number;
}

export function ProgressOverview({ diagnosticResult, preparationPercentage }: ProgressOverviewProps) {
  const getPreparationLevel = () => {
    switch (diagnosticResult.level) {
      case 'easy': return "প্রাথমিক";
      case 'medium': return "মধ্যমান";
      case 'hard': return "উচ্চমান";
      default: return "শুরু";
    }
  };

  const getLevelDescription = () => {
    switch (diagnosticResult.level) {
      case 'easy': 
        return "আপনার প্রস্তুতি শুরু হয়েছে। নিয়মিত অনুশীলন প্রয়োজন।";
      case 'medium': 
        return "আপনার প্রস্তুতি ভালো চলছে। দুর্বল বিষয়গুলিতে ফোকাস করুন।";
      case 'hard': 
        return "আপনার প্রস্তুতি ভালো আছে। মক টেস্ট এবং রিভিশন গুরুত্বপূর্ণ।";
      default: 
        return "ডায়াগনস্টিক টেস্ট সম্পন্ন করুন।";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-green-600" />
          প্রস্তুতি অগ্রগতি
        </CardTitle>
        <CardDescription>
          {getLevelDescription()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">সামগ্রিক প্রস্তুতি</span>
            <span className="text-sm font-bold text-green-600">{preparationPercentage}%</span>
          </div>
          <Progress value={preparationPercentage} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <Trophy className="h-6 w-6 text-green-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-green-700">{getPreparationLevel()}</div>
            <div className="text-xs text-green-600">প্রস্তুতি লেভেল</div>
          </div>
          
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Clock className="h-6 w-6 text-blue-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-blue-700">
              {diagnosticResult.score}/{diagnosticResult.totalQuestions}
            </div>
            <div className="text-xs text-blue-600">ডায়াগনস্টিক স্কোর</div>
          </div>
        </div>

        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <h4 className="font-semibold text-yellow-800 text-sm mb-1">
            পরবর্তী পদক্ষেপ
          </h4>
          <p className="text-xs text-yellow-700">
            {diagnosticResult.level === 'easy' 
              ? "বেসিক বিষয়গুলো শক্ত করুন এবং প্রতিদিন ৫০টি প্রশ্ন অনুশীলন করুন"
              : diagnosticResult.level === 'medium'
              ? "দুর্বল বিষয়গুলিতে ফোকাস করুন এবং সাপ্তাহিক মক টেস্ট দিন"
              : "এডভান্সড প্রশ্ন অনুশীলন করুন এবং টাইম ম্যানেজমেন্ট উন্নত করুন"
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}