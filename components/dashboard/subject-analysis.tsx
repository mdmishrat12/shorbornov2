// components/subject-analysis.tsx
'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const analysisData = [
  { subject: 'বাংলা', frequency: 25, weightage: '30%', trend: 'up' },
  { subject: 'ইংরেজি', frequency: 20, weightage: '25%', trend: 'stable' },
  { subject: 'গণিত', frequency: 15, weightage: '20%', trend: 'up' },
  { subject: 'সাধারণ জ্ঞান', frequency: 30, weightage: '35%', trend: 'up' },
  { subject: 'বিজ্ঞান', frequency: 10, weightage: '15%', trend: 'stable' },
];

export function SubjectAnalysis() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>বিষয়ভিত্তিক বিশ্লেষণ</CardTitle>
        <CardDescription>
          গত ৫ বছরের BCS পরীক্ষার প্রশ্ন বিশ্লেষণ
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analysisData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="subject" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis fontSize={12} />
              <Tooltip 
                formatter={(value) => [`${value} প্রশ্ন`, 'গড়']}
                labelFormatter={(label) => `বিষয়: ${label}`}
              />
              <Bar 
                dataKey="frequency" 
                fill="#16a34a" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-1">সবচেয়ে গুরুত্বপূর্ণ বিষয়</h4>
            <p className="text-green-700 text-sm">সাধারণ জ্ঞান - ৩৫% ওজন</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-1">প্রস্তুতি সুপারিশ</h4>
            <p className="text-blue-700 text-sm">বাংলাদেশ বিষয়াবলিতে ফোকাস করুন</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}