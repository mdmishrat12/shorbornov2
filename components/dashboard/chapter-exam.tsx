// components/chapter-exam.tsx
'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Clock, CheckCircle2, BookOpen } from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface ChapterExamProps {
  chapter: any;
  onComplete: (result: any) => void;
  onBack: () => void;
}

const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "বাংলাদেশের সংবিধানের কোন সংশোধনীতে ইসলামকে প্রজাতন্ত্রের ধর্ম হিসেবে স্বীকৃতি দেওয়া হয়?",
    options: [
      "অষ্টম সংশোধনী",
      "দ্বাদশ সংশোধনী", 
      "পঞ্চদশ সংশোধনী",
      "ষোড়শ সংশোধনী"
    ],
    correctAnswer: 0,
    explanation: "বাংলাদেশের সংবিধানের অষ্টম সংশোধনীতে (১৯৮৮) ইসলামকে প্রজাতন্ত্রের ধর্ম হিসেবে স্বীকৃতি দেওয়া হয়।"
  },
  {
    id: 2,
    question: "মুঘল আমলে 'দেওয়ান' বলতে কী বোঝাত?",
    options: [
      "সেনাপতি",
      "রাজস্ব মন্ত্রী", 
      "বিচারক",
      "দূত"
    ],
    correctAnswer: 1,
    explanation: "মুঘল আমলে 'দেওয়ান' ছিলেন রাজস্ব মন্ত্রী যিনি সরকারের আয়-ব্যয়ের দায়িত্বে থাকতেন।"
  },
  {
    id: 3,
    question: "বাংলাদেশের প্রথম জনগণনা কখন অনুষ্ঠিত হয়?",
    options: [
      "১৯৭৪ সালে",
      "১৯৮১ সালে", 
      "১৯৭১ সালে",
      "১৯৭৮ সালে"
    ],
    correctAnswer: 0,
    explanation: "বাংলাদেশের প্রথম জনগণনা অনুষ্ঠিত হয় ১৯৭৪ সালে।"
  }
];

export function ChapterExam({ chapter, onComplete, onBack }: ChapterExamProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [showResult, setShowResult] = useState(false);

  const question = SAMPLE_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / SAMPLE_QUESTIONS.length) * 100;

  // Timer effect
  useState(() => {
    const timer = setInterval(() => {
      setTimeLeft((time) => {
        if (time <= 1) {
          clearInterval(timer);
          handleComplete();
          return 0;
        }
        return time - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  });

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < SAMPLE_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleComplete = () => {
    setShowResult(true);
  };

  const handleCloseResult = () => {
    const score = calculateScore();
    onComplete({
      score,
      totalQuestions: SAMPLE_QUESTIONS.length,
      chapter: chapter.name,
      subject: "বাংলাদেশ বিষয়াবলি",
      timestamp: new Date().toISOString()
    });
  };

  const calculateScore = () => {
    return answers.reduce((score, answer, index) => {
      return score + (answer === SAMPLE_QUESTIONS[index].correctAnswer ? 1 : 0);
    }, 0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showResult) {
    const score = calculateScore();
    const percentage = (score / SAMPLE_QUESTIONS.length) * 100;
    
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              টেস্ট সম্পন্ন!
            </CardTitle>
            <CardDescription>
              {chapter.name} - আপনার পারফরম্যান্স
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {score}/{SAMPLE_QUESTIONS.length}
              </div>
              <div className="text-2xl font-semibold mb-4">
                {percentage >= 80 ? "🎉 Excellent!" : 
                 percentage >= 60 ? "👍 Good Job!" : 
                 "📚 Keep Practicing!"}
              </div>
              <Progress value={percentage} className="h-3" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">{percentage}%</div>
                <div className="text-sm text-green-800">সাফল্যের হার</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">
                  {formatTime(1800 - timeLeft)}
                </div>
                <div className="text-sm text-blue-800">সময় লেগেছে</div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">পরামর্শ</h4>
              <p className="text-sm text-yellow-700">
                {percentage >= 80 
                  ? "আপনার এই চ্যাপ্টারে দখল ভালো। পরবর্তী চ্যাপ্টারে এগিয়ে যান।"
                  : percentage >= 60
                  ? "ভালো করেছে, তবে আরও অনুশীলন প্রয়োজন। ভুল প্রশ্নগুলো আবার দেখুন।"
                  : "এই চ্যাপ্টারে আরও বেশি সময় দিন। বেসিক কনসেপ্টগুলো আবার রিভাইজ দিন।"
                }
              </p>
            </div>

            <Button className="w-full" onClick={handleCloseResult}>
              ড্যাশবোর্ডে ফিরে যান
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Button variant="ghost" onClick={onBack} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        ড্যাশবোর্ডে ফিরে যান
      </Button>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-green-600" />
                {chapter.name} - টেস্ট
              </CardTitle>
              <CardDescription>
                প্রত্যাশিত নম্বর: {chapter.expectedMarks} | সময়: ৩০ মিনিট
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 bg-red-100 px-3 py-2 rounded-lg">
              <Clock className="h-5 w-5 text-red-600" />
              <span className="font-bold text-red-600">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Progress value={progress} className="mb-6" />
          
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between text-sm text-blue-800">
              <span>প্রশ্ন: {currentQuestion + 1}/{SAMPLE_QUESTIONS.length}</span>
              <span>চ্যাপ্টার: {chapter.name}</span>
              <span>প্রত্যাশিত নম্বর: {chapter.expectedMarks}</span>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
            
            <RadioGroup 
              value={answers[currentQuestion]?.toString() || ""}
              onValueChange={(value) => handleAnswerSelect(parseInt(value))}
            >
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 mb-3 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              পূর্ববর্তী
            </Button>
            
            <Button onClick={handleNext}>
              {currentQuestion === SAMPLE_QUESTIONS.length - 1 ? 'সমাপ্ত করুন' : 'পরবর্তী'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}