// components/exam-selection.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, BookOpen, GraduationCap, Building } from "lucide-react";

const EXAM_TYPES = [
  {
    id: "bcs",
    name: "BCS",
    description: "বাংলাদেশ সিভিল সার্ভিস",
    icon: <Target className="h-8 w-8" />,
    color: "bg-red-100 text-red-600",
    subjects: 12,
    questions: "2000+",
  },
  {
    id: "bank",
    name: "ব্যাংক",
    description: "বিভিন্ন ব্যাংক পরীক্ষা",
    icon: <Building className="h-8 w-8" />,
    color: "bg-blue-100 text-blue-600",
    subjects: 8,
    questions: "1500+",
  },
  {
    id: "primary",
    name: "প্রাথমিক",
    description: "প্রাথমিক শিক্ষক নিবন্ধন",
    icon: <BookOpen className="h-8 w-8" />,
    color: "bg-green-100 text-green-600",
    subjects: 6,
    questions: "1000+",
  },
  {
    id: "admission",
    name: "ভর্তি পরীক্ষা",
    description: "বিশ্ববিদ্যালয় ভর্তি পরীক্ষা",
    icon: <GraduationCap className="h-8 w-8" />,
    color: "bg-purple-100 text-purple-600",
    subjects: 4,
    questions: "800+",
  },
];

interface ExamSelectionProps {
  onExamSelect: (examType: string) => void;
}

export function ExamSelection({ onExamSelect }: ExamSelectionProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-green-900 mb-4">
          BCS Prep Pro - আপনার পরীক্ষার প্রস্তুতি শুরু করুন
        </h1>
        <p className="text-xl text-green-700">
          কোন পরীক্ষার জন্য প্রস্তুতি নিতে চান? নির্বাচন করুন
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {EXAM_TYPES.map((exam) => (
          <Card 
            key={exam.id}
            className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-2 hover:border-green-300"
            onClick={() => onExamSelect(exam.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{exam.name}</CardTitle>
                  <CardDescription className="text-base mt-1">
                    {exam.description}
                  </CardDescription>
                </div>
                <div className={`p-3 rounded-full ${exam.color}`}>
                  {exam.icon}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm text-gray-600 mb-4">
                <span>{exam.subjects}টি বিষয়</span>
                <span>{exam.questions} প্রশ্ন</span>
              </div>
              <Button className="w-full" size="lg">
                নির্বাচন করুন
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center text-gray-600">
        <p>প্রথমে একটি ডায়াগনস্টিক টেস্ট দিয়ে আপনার বর্তমান প্রস্তুতি পর্যায় যাচাই করুন</p>
      </div>
    </div>
  );
}