// components/quick-actions.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Clock, Target, Award } from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      icon: <Play className="h-5 w-5" />,
      title: "কুইক টেস্ট",
      description: "১৫ মিনিটের ২০ প্রশ্ন",
      action: "শুরু করুন",
      variant: "default" as const,
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "মডেল টেস্ট",
      description: "২ ঘন্টার ২০০ প্রশ্ন",
      action: "শুরু করুন",
      variant: "outline" as const,
    },
    {
      icon: <Target className="h-5 w-5" />,
      title: "দুর্বলতা টেস্ট",
      description: "দুর্বল বিষয় নির্ধারণ",
      action: "পরীক্ষা করুন",
      variant: "outline" as const,
    },
    {
      icon: <Award className="h-5 w-5" />,
      title: "প্রোগ্রেস টেস্ট",
      description: "প্রস্তুতি লেভেল চেক",
      action: "শুরু করুন",
      variant: "outline" as const,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>দ্রুত কার্যক্রম</CardTitle>
        <CardDescription>
          দ্রুত টেস্ট শুরু করুন
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant}
            className="w-full justify-start h-auto py-3 px-4"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="flex-shrink-0">
                {action.icon}
              </div>
              <div className="flex-1">
                <div className="font-semibold">{action.title}</div>
                <div className="text-sm text-gray-600">{action.description}</div>
              </div>
            </div>
          </Button>
        ))}
        
        <div className="pt-4 border-t">
          <h4 className="font-semibold mb-2">আজকের লক্ষ্য</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>৫০টি প্রশ্ন</span>
              <span className="text-green-600">২৫/৫০</span>
            </div>
            <div className="flex justify-between">
              <span>২টি চ্যাপ্টার</span>
              <span className="text-green-600">১/২</span>
            </div>
            <div className="flex justify-between">
              <span>১টি মডেল টেস্ট</span>
              <span className="text-red-600">০/১</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}