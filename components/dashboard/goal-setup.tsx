// components/goal-setup.tsx
'use client'
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Target, Edit } from "lucide-react";

const EXAM_TYPES = [
  { value: "bcs", label: "BCS" },
  { value: "bank", label: "ব্যাংক" },
  { value: "primary", label: "প্রাথমিক" },
  { value: "admission", label: "ভর্তি" },
];

const CADRES = [
  "প্রশাসন",
  "পুলিশ",
  "কর",
  "ব্যাংকিং",
  "শিক্ষা",
  "স্বাস্থ্য",
];

const UNIVERSITIES = [
  "ঢাকা বিশ্ববিদ্যালয়",
  "রাজশাহী বিশ্ববিদ্যালয়",
  "চট্টগ্রাম বিশ্ববিদ্যালয়",
  "জাহাঙ্গীরনগর বিশ্ববিদ্যালয়",
  "জাতীয় বিশ্ববিদ্যালয়",
];

export function GoalSetup() {
  const [isEditing, setIsEditing] = useState(false);
  const [goal, setGoal] = useState({
    examType: "bcs",
    cadre: "প্রশাসন",
    university: "ঢাকা বিশ্ববিদ্যালয়",
    targetDate: "2024-12-31",
  });

  const handleSave = () => {
    setIsEditing(false);
    // Save goal to backend
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6 text-green-600" />
            আপনার লক্ষ্য সেটআপ
          </CardTitle>
          <CardDescription>
            আপনার লক্ষ্য নির্ধারণ করুন এবং পার্সোনালাইজড স্টাডি প্লান পান
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                পরীক্ষার ধরন
              </label>
              <Select
                value={goal.examType}
                onValueChange={(value) => setGoal({ ...goal, examType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXAM_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                টার্গেট ক্যাডার
              </label>
              <Select
                value={goal.cadre}
                onValueChange={(value) => setGoal({ ...goal, cadre: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CADRES.map((cadre) => (
                    <SelectItem key={cadre} value={cadre}>
                      {cadre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                বিশ্ববিদ্যালয়
              </label>
              <Select
                value={goal.university}
                onValueChange={(value) => setGoal({ ...goal, university: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNIVERSITIES.map((uni) => (
                    <SelectItem key={uni} value={uni}>
                      {uni}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                টার্গেট তারিখ
              </label>
              <Input
                type="date"
                value={goal.targetDate}
                onChange={(e) => setGoal({ ...goal, targetDate: e.target.value })}
              />
            </div>

            <div className="md:col-span-2 flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                বাতিল
              </Button>
              <Button onClick={handleSave}>সেভ করুন</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                পরীক্ষা: {EXAM_TYPES.find(t => t.value === goal.examType)?.label}
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                ক্যাডার: {goal.cadre}
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                বিশ্ববিদ্যালয়: {goal.university}
              </Badge>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                তারিখ: {new Date(goal.targetDate).toLocaleDateString('bn-BD')}
              </Badge>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                ✅ আপনার লক্ষ্য অনুযায়ী সিলেবাস এবং স্টাডি প্লান তৈরি করা হয়েছে। 
                নিচে আপনার পার্সোনালাইজড স্টাডি প্লান দেখুন।
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}