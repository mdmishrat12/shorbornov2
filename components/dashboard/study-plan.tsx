// components/study-plan.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle, PlayCircle } from "lucide-react";

const SUBJECTS = [
  {
    id: 1,
    name: "বাংলা ভাষা ও সাহিত্য",
    completion: 65,
    expectedMarks: 25,
    priority: "high",
    topics: [
      { name: "ব্যাকরণ", completed: true },
      { name: "সাহিত্য", completed: true },
      { name: "লেখক ও গ্রন্থ", completed: false },
    ],
  },
  {
    id: 2,
    name: "ইংরেজি ভাষা ও সাহিত্য",
    completion: 45,
    expectedMarks: 20,
    priority: "medium",
    topics: [
      { name: "Grammar", completed: true },
      { name: "Vocabulary", completed: false },
      { name: "Literature", completed: false },
    ],
  },
  {
    id: 3,
    name: "বাংলাদেশ বিষয়াবলি",
    completion: 30,
    expectedMarks: 30,
    priority: "high",
    topics: [
      { name: "ইতিহাস", completed: false },
      { name: "ভূগোল", completed: true },
      { name: "সংবিধান", completed: false },
    ],
  },
  {
    id: 4,
    name: "আন্তর্জাতিক বিষয়াবলি",
    completion: 20,
    expectedMarks: 15,
    priority: "low",
    topics: [
      { name: "আন্তর্জাতিক সংস্থা", completed: false },
      { name: "চুক্তি ও সম্মেলন", completed: false },
    ],
  },
];

export function StudyPlan() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-green-600" />
          পার্সোনালাইজড স্টাডি প্লান
        </CardTitle>
        <CardDescription>
          আপনার লক্ষ্য এবং প্রস্তুতি অনুযায়ী সাজানো স্টাডি প্লান
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {SUBJECTS.map((subject) => (
            <div key={subject.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold">{subject.name}</h3>
                  <Badge 
                    variant={
                      subject.priority === "high" ? "destructive" : 
                      subject.priority === "medium" ? "default" : "secondary"
                    }
                  >
                    {subject.priority === "high" ? "উচ্চ প্রাধান্য" : 
                     subject.priority === "medium" ? "মধ্যম প্রাধান্য" : "সাধারণ"}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">প্রত্যাশিত নম্বর</div>
                  <div className="font-bold text-green-600">{subject.expectedMarks}</div>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>সম্পূর্ণতা</span>
                  <span>{subject.completion}%</span>
                </div>
                <Progress value={subject.completion} className="h-2" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {subject.topics.map((topic, index) => (
                    <Badge 
                      key={index}
                      variant={topic.completed ? "default" : "outline"}
                      className="flex items-center gap-1"
                    >
                      {topic.completed && <CheckCircle className="h-3 w-3" />}
                      {topic.name}
                    </Badge>
                  ))}
                </div>
                <Button size="sm" className="flex items-center gap-1">
                  <PlayCircle className="h-4 w-4" />
                  শুরু করুন
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">🎯 পরবর্তী কার্যক্রম</h4>
          <p className="text-sm text-blue-800">
            আপনার "বাংলাদেশ বিষয়াবলি" বিষয়ে প্রস্তুতি কম। আজকের জন্য আমরা "ইতিহাস" টপিকটি সম্পূর্ণ করার পরামর্শ দিচ্ছি। 
            এটি ৮-১০ মার্কের প্রশ্ন আসতে পারে।
          </p>
        </div>
      </CardContent>
    </Card>
  );
}