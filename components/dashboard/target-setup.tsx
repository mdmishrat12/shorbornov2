// components/target-setup.tsx
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target, Calendar, Award } from "lucide-react";

const CADRES = [
  "প্রশাসন ক্যাডার",
  "পুলিশ ক্যাডার", 
  "কর ক্যադার",
  "ফরেন ক্যাডার",
  "স্বাস্থ্য ক্যাডার",
  "শিক্ষা ক্যাডার",
  "টেকনিক্যাল ক্যাডার"
];

const BCS_VERSIONS = [
  "BCS 45th (আসন্ন)",
  "BCS 44th",
  "BCS 43rd", 
  "BCS 42nd",
  "BCS 41st",
  "BCS 40th"
];

interface TargetSetupProps {
  onTargetSet: (target: any) => void;
}

export function TargetSetup({ onTargetSet }: TargetSetupProps) {
  const [target, setTarget] = useState({
    cadre: "",
    bcsVersion: "",
    targetDate: "",
    preferredSubject: ""
  });

  const handleSubmit = () => {
    if (target.cadre && target.bcsVersion) {
      onTargetSet(target);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-green-100 rounded-full">
            <Target className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-green-900 mb-2">
          আপনার লক্ষ্য নির্ধারণ করুন
        </h1>
        <p className="text-lg text-green-700">
          আপনার টার্গেট ক্যাডার এবং BCS নির্বাচন করুন
        </p>
      </div>

      <Card>
        <CardHeader className="text-center">
          <CardTitle>লক্ষ্য সেটআপ</CardTitle>
          <CardDescription>
            আপনার পছন্দের ক্যাডার এবং BCS ভার্সন নির্বাচন করুন
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="cadre" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              টার্গেট ক্যাডার
            </Label>
            <Select value={target.cadre} onValueChange={(value) => setTarget({...target, cadre: value})}>
              <SelectTrigger>
                <SelectValue placeholder="ক্যাডার নির্বাচন করুন" />
              </SelectTrigger>
              <SelectContent>
                {CADRES.map((cadre) => (
                  <SelectItem key={cadre} value={cadre}>{cadre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bcsVersion">BCS ভার্সন</Label>
            <Select value={target.bcsVersion} onValueChange={(value) => setTarget({...target, bcsVersion: value})}>
              <SelectTrigger>
                <SelectValue placeholder="BCS ভার্সন নির্বাচন করুন" />
              </SelectTrigger>
              <SelectContent>
                {BCS_VERSIONS.map((version) => (
                  <SelectItem key={version} value={version}>{version}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetDate" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              টার্গেট তারিখ
            </Label>
            <Input 
              type="date"
              value={target.targetDate}
              onChange={(e) => setTarget({...target, targetDate: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredSubject">পছন্দের বিষয় (ঐচ্ছিক)</Label>
            <Input 
              placeholder="আপনার শক্তিশালী বিষয়"
              value={target.preferredSubject}
              onChange={(e) => setTarget({...target, preferredSubject: e.target.value})}
            />
          </div>

          <Button 
            className="w-full" 
            size="lg"
            onClick={handleSubmit}
            disabled={!target.cadre || !target.bcsVersion}
          >
            লক্ষ্য সেট করুন এবং ড্যাশবোর্ড দেখুন
          </Button>

          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 text-center">
              💡 আপনার লক্ষ্য অনুযায়ী আমরা সিলেবাস, গুরুত্বপূর্ণ টপিক এবং প্রস্তুতি প্লান তৈরি করব
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}