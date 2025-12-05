// components/subject-dashboard.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, Target, BarChart3, PlayCircle, Clock, Star, Calendar, Trophy, TrendingUp, Lightbulb, Users, Award } from "lucide-react";

// Sample data with enhanced information
const SUBJECTS_DATA = {
  "bcs": {
    subjects: [
      {
        id: 1,
        name: "বাংলা ভাষা ও সাহিত্য",
        totalChapters: 8,
        completedChapters: 3,
        totalMarks: 35,
        expectedMarks: 25,
        importance: "very-high",
        dailyTarget: 2,
        priority: 1,
        chapters: [
          {
            id: 1,
            name: "ব্যাকরণ",
            importance: "high",
            expectedMarks: 10,
            totalQuestions: 50,
            completedQuestions: 20,
            duration: "2 hours",
            commonInExams: ["BCS 40th", "BCS 41st", "BCS 42nd", "BCS 43rd"],
            completionTime: "3 days"
          },
          {
            id: 2,
            name: "সাহিত্য",
            importance: "high", 
            expectedMarks: 12,
            totalQuestions: 60,
            completedQuestions: 15,
            duration: "3 hours",
            commonInExams: ["BCS 40th", "BCS 41st", "BCS 42nd", "BCS 43rd"],
            completionTime: "4 days"
          }
        ]
      }
      // ... other subjects remain same
    ]
  }
};

const MOTIVATIONAL_QUOTES = [
  "🚀 আজকের কষ্টই আগামীকালের সাফল্য! প্রতিদিন ৫০টি প্রশ্ন আপনার লক্ষ্যের এক ধাপ closer!",
  "💪 মহান মানুষরা অসাধ্যকে সাধন করেন! আপনার লক্ষ্য অর্জন সম্ভব - শুধু চেষ্টা চালিয়ে যান!",
  "📚 একজন সফল ক্যাডার হওয়ার যাত্রা আজকের পড়া থেকে শুরু! Keep going!",
  "⭐ প্রতিটি পড়া আপনাকে আপনার স্বপ্নের ক্যাডারের এক ধাপ কাছে নিয়ে যাচ্ছে!",
  "🎯 আজ যা শিখলেন, কাল তা আপনাকে BCS তে এগিয়ে রাখবে! Consistency is key!",
  "🔥 সাফল্য কখনোই শেষ নয়, ব্যর্থতাও মৃত্যু নয় - চলমানতাই গুরুত্বপূর্ণ!",
  "🌈 কঠিন পড়া আজ, সহজ নম্বর কাল! Don't give up!",
];

const DAILY_TARGETS = {
  questions: 50,
  chapters: 2,
  studyTime: "3 hours",
  subjects: 3
};

interface SubjectDashboardProps {
  userTarget: any;
  onStartChapterExam: (chapter: any) => void;
}

export function SubjectDashboard({ userTarget, onStartChapterExam }: SubjectDashboardProps) {
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [todayQuote, setTodayQuote] = useState("");
  const [dailyProgress, setDailyProgress] = useState({
    questions: 0,
    chapters: 0,
    studyTime: 0,
    subjects: 0
  });

  const subjects = SUBJECTS_DATA.bcs.subjects;

  useEffect(() => {
    // Calculate days remaining
    if (userTarget.targetDate) {
      const targetDate = new Date(userTarget.targetDate);
      const today = new Date();
      const diffTime = targetDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysRemaining(diffDays);
    }

    // Set random motivational quote
    const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    setTodayQuote(randomQuote);

    // Load daily progress from localStorage (in real app, from backend)
    const savedProgress = localStorage.getItem('dailyProgress');
    if (savedProgress) {
      setDailyProgress(JSON.parse(savedProgress));
    }
  }, [userTarget]);

  const updateDailyProgress = (type: string) => {
    const newProgress = { ...dailyProgress, [type]: dailyProgress[type as keyof typeof dailyProgress] + 1 };
    setDailyProgress(newProgress);
    localStorage.setItem('dailyProgress', JSON.stringify(newProgress));
  };

  const getImportanceBadge = (importance: string) => {
    const config = {
      "very-high": { label: "অতি গুরুত্বপূর্ণ", color: "bg-red-100 text-red-800" },
      "high": { label: "গুরুত্বপূর্ণ", color: "bg-orange-100 text-orange-800" },
      "medium": { label: "মধ্যম", color: "bg-yellow-100 text-yellow-800" },
      "low": { label: "কম গুরুত্বপূর্ণ", color: "bg-green-100 text-green-800" }
    };
    
    const { label, color } = config[importance as keyof typeof config] || config.medium;
    return <Badge className={color}>{label}</Badge>;
  };

  const getChapterImportanceBadge = (importance: string) => {
    const config = {
      "very-high": { label: "⭐⭐⭐", color: "bg-red-100 text-red-800" },
      "high": { label: "⭐⭐", color: "bg-orange-100 text-orange-800" },
      "medium": { label: "⭐", color: "bg-yellow-100 text-yellow-800" },
      "low": { label: "সাধারণ", color: "bg-green-100 text-green-800" }
    };
    
    const { label, color } = config[importance as keyof typeof config] || config.medium;
    return <Badge className={color}>{label}</Badge>;
  };

  const getTodaysLessons = () => {
    // In real app, this would be AI-generated based on progress
    return subjects
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 2)
      .flatMap(subject => 
        subject.chapters
          .filter(chapter => chapter.completedQuestions < chapter.totalQuestions)
          .slice(0, 1)
          .map(chapter => ({
            subject: subject.name,
            chapter: chapter.name,
            expectedMarks: chapter.expectedMarks,
            questions: chapter.totalQuestions - chapter.completedQuestions,
            importance: chapter.importance
          }))
      );
  };

  const calculateOverallProgress = () => {
    const totalChapters = subjects.reduce((sum, subject) => sum + subject.totalChapters, 0);
    const completedChapters = subjects.reduce((sum, subject) => sum + subject.completedChapters, 0);
    return Math.round((completedChapters / totalChapters) * 100);
  };

  return (
    <div>
      {/* Header with Target Info */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-green-900">
            BCS Prep Pro ড্যাশবোর্ড
          </h1>
          <p className="text-green-700 mt-2">
            ক্যাডার: <span className="font-semibold">{userTarget.cadre}</span> | 
            BCS: <span className="font-semibold">{userTarget.bcsVersion}</span> |
            দিন বাকি: <span className="font-semibold text-red-600">{daysRemaining}</span>
          </p>
        </div>
        
        <Button variant="outline" className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          লক্ষ্য পরিবর্তন
        </Button>
      </div>

      {/* Motivational Quote */}
      <Card className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-1" />
            <div>
              <p className="text-lg font-semibold text-green-900 mb-2">আজকের মোটিভেশন</p>
              <p className="text-green-800 leading-relaxed">{todayQuote}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Days Remaining */}
        <Card className="bg-gradient-to-br from-red-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">দিন বাকি</p>
                <p className="text-3xl font-bold text-red-600">{daysRemaining}</p>
              </div>
              <Calendar className="h-8 w-8 text-red-500" />
            </div>
            <Progress value={((365 - daysRemaining) / 365) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>

        {/* Daily Target */}
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">আজকের টার্গেট</p>
                <p className="text-3xl font-bold text-blue-600">
                  {dailyProgress.questions}/{DAILY_TARGETS.questions}
                </p>
                <p className="text-xs text-blue-600 mt-1">প্রশ্ন</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
            <Progress value={(dailyProgress.questions / DAILY_TARGETS.questions) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>

        {/* Overall Progress */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">মোট প্রোগ্রেস</p>
                <p className="text-3xl font-bold text-green-600">{calculateOverallProgress()}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            <Progress value={calculateOverallProgress()} className="mt-2 h-2" />
          </CardContent>
        </Card>

        {/* Rank */}
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">আপনার র‍্যাংক</p>
                <p className="text-3xl font-bold text-purple-600">#42</p>
                <p className="text-xs text-purple-600 mt-1">শীর্ষ ১০%</p>
              </div>
              <Trophy className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Today's Study Plan */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              আজকের স্টাডি প্লান
            </CardTitle>
            <CardDescription>
              AI Suggested lessons based on your progress and exam schedule
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getTodaysLessons().map((lesson, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded ${
                      lesson.importance === "very-high" ? "bg-red-100" :
                      lesson.importance === "high" ? "bg-orange-100" :
                      "bg-yellow-100"
                    }`}>
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold">{lesson.subject}</p>
                      <p className="text-sm text-gray-600">{lesson.chapter}</p>
                      <div className="flex gap-4 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {lesson.expectedMarks} মার্কস
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {lesson.questions} প্রশ্ন
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => updateDailyProgress('chapters')}
                  >
                    শুরু করুন
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">💡 আজকের টিপস</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• সকাল ৭-৯টা: বাংলা ব্যাকরণ রিভিশন</li>
                <li>• সকাল ১০-১২টা: গণিতের নতুন অধ্যায়</li>
                <li>• বিকাল ৪-৬টা: ইংরেজি Vocabulary</li>
                <li>• রাত ৯-১০টা: আজকের পড়া রিভিশন</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Daily Target */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-green-600" />
              দৈনিক লক্ষ্য
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium">প্রশ্ন সমাধান</span>
                <Badge>
                  {dailyProgress.questions}/{DAILY_TARGETS.questions}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium">চ্যাপ্টার সম্পূর্ণ</span>
                <Badge>
                  {dailyProgress.chapters}/{DAILY_TARGETS.chapters}
                </Badge>
              </div>

              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm font-medium">স্টাডি সময়</span>
                <Badge>
                  {dailyProgress.studyTime}hr/{DAILY_TARGETS.studyTime}
                </Badge>
              </div>

              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium">বিষয় কভার</span>
                <Badge>
                  {dailyProgress.subjects}/{DAILY_TARGETS.subjects}
                </Badge>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Button className="w-full" onClick={() => updateDailyProgress('questions')}>
                <PlayCircle className="h-4 w-4 mr-2" />
                কুইক টেস্ট দিন
              </Button>
              <Button variant="outline" className="w-full">
                <Users className="h-4 w-4 mr-2" />
                লিডারবোর্ড দেখুন
              </Button>
              <Button variant="outline" className="w-full">
                <TrendingUp className="h-4 w-4 mr-2" />
                প্রোগ্রেস রিপোর্ট
              </Button>
            </div>

            <div className="mt-6 p-3 bg-orange-50 rounded-lg">
              <p className="text-xs text-orange-800 text-center">
                🎯 আজকের লক্ষ্য: {DAILY_TARGETS.questions} প্রশ্ন + {DAILY_TARGETS.chapters} চ্যাপ্টার
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subjects List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-green-600" />
            সম্পূর্ণ সিলেবাস ও প্রোগ্রেস
          </CardTitle>
          <CardDescription>
            আপনার সকল বিষয় এবং চ্যাপ্টারের বিস্তারিত প্রোগ্রেস
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {subjects.map((subject) => (
              <div key={subject.id} className="border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="text-xl font-semibold">{subject.name}</h3>
                      <p className="text-gray-600">
                        {subject.completedChapters}/{subject.totalChapters} চ্যাপ্টার সম্পূর্ণ | 
                        প্রত্যাশিত নম্বর: {subject.expectedMarks}/{subject.totalMarks}
                      </p>
                    </div>
                    {getImportanceBadge(subject.importance)}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 mb-1">সম্পূর্ণতা</div>
                    <Progress value={(subject.completedChapters / subject.totalChapters) * 100} className="w-32" />
                    <div className="text-sm font-medium mt-1">
                      {Math.round((subject.completedChapters / subject.totalChapters) * 100)}%
                    </div>
                  </div>
                </div>

                <Accordion type="single" collapsible>
                  {subject.chapters.map((chapter) => (
                    <AccordionItem key={chapter.id} value={`chapter-${chapter.id}`}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center justify-between w-full pr-4">
                          <div className="flex items-center gap-4">
                            <span className="text-left">{chapter.name}</span>
                            {getChapterImportanceBadge(chapter.importance)}
                            <Badge variant="outline">
                              {chapter.expectedMarks} মার্কস
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{chapter.completionTime}</span>
                            <span>{chapter.completedQuestions}/{chapter.totalQuestions}</span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-semibold mb-2">বিস্তারিত</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>গুরুত্ব:</span>
                                <span className="font-medium">
                                  {chapter.importance === "very-high" ? "অতি উচ্চ" :
                                   chapter.importance === "high" ? "উচ্চ" :
                                   chapter.importance === "medium" ? "মধ্যম" : "নিম্ন"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>প্রত্যাশিত নম্বর:</span>
                                <span className="font-medium">{chapter.expectedMarks}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>সম্পূর্ণ হতে:</span>
                                <span className="font-medium">{chapter.completionTime}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>প্রশ্ন সম্পূর্ণ:</span>
                                <span className="font-medium">
                                  {chapter.completedQuestions}/{chapter.totalQuestions} 
                                  ({Math.round((chapter.completedQuestions / chapter.totalQuestions) * 100)}%)
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2">যেসব পরীক্ষায় এসেছে</h4>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {chapter.commonInExams.map((exam, index) => (
                                <Badge key={index} variant="outline" className="bg-white">
                                  {exam}
                                </Badge>
                              ))}
                            </div>
                            
                            <Button 
                              className="w-full flex items-center gap-2"
                              onClick={() => {
                                onStartChapterExam(chapter);
                                updateDailyProgress('questions');
                              }}
                            >
                              <PlayCircle className="h-4 w-4" />
                              টেস্ট দিন
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}