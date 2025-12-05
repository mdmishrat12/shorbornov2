// components/diagnostic-test.tsx
'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Clock, CheckCircle2 } from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  subject: string;
  topic: string;
}

interface DiagnosticTestProps {
  examType: string;
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
    subject: "বাংলাদেশ বিষয়াবলি",
    topic: "সংবিধান"
  },
  {
    id: 2,
    question: "Which of the following words is a synonym for 'benevolent'?",
    options: [
      "Kind",
      "Cruel",
      "Selfish", 
      "Greedy"
    ],
    correctAnswer: 0,
    subject: "ইংরেজি",
    topic: "Vocabulary"
  },
  {
    id: 3,
    question: "x² - 5x + 6 = 0 সমীকরণের মূলদ্বয়ের সমষ্টি কত?",
    options: ["5", "6", "-5", "-6"],
    correctAnswer: 0,
    subject: "গণিত",
    topic: "বীজগণিত"
  }
];

export function DiagnosticTest({ examType, onComplete, onBack }: DiagnosticTestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds

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
    const score = calculateScore();
    const level = determinePreparationLevel(score);
    
    onComplete({
      score,
      level,
      totalQuestions: SAMPLE_QUESTIONS.length,
      correctAnswers: score,
      subjectWise: analyzeSubjectPerformance(),
      timestamp: new Date().toISOString()
    });
  };

  const calculateScore = () => {
    return answers.reduce((score, answer, index) => {
      return score + (answer === SAMPLE_QUESTIONS[index].correctAnswer ? 1 : 0);
    }, 0);
  };

  const determinePreparationLevel = (score: number) => {
    const percentage = (score / SAMPLE_QUESTIONS.length) * 100;
    if (percentage >= 80) return "hard";
    if (percentage >= 50) return "medium";
    return "easy";
  };

  const analyzeSubjectPerformance = () => {
    const subjectPerformance: Record<string, { correct: number; total: number }> = {};
    
    answers.forEach((answer, index) => {
      const question = SAMPLE_QUESTIONS[index];
      const subject = question.subject;
      
      if (!subjectPerformance[subject]) {
        subjectPerformance[subject] = { correct: 0, total: 0 };
      }
      
      subjectPerformance[subject].total++;
      if (answer === question.correctAnswer) {
        subjectPerformance[subject].correct++;
      }
    });
    
    return subjectPerformance;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Button variant="ghost" onClick={onBack} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        পিছনে যান
      </Button>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                ডায়াগনস্টিক টেস্ট - {examType.toUpperCase()}
              </CardTitle>
              <CardDescription>
                আপনার বর্তমান প্রস্তুতি স্তর নির্ধারণ করুন
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
              <span>বিষয়: {question.subject}</span>
              <span>টপিক: {question.topic}</span>
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

          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800 text-center">
              💡 এই টেস্টটি আপনার বর্তমান প্রস্তুতি স্তর নির্ধারণ করবে এবং পার্সোনালাইজড স্টাডি প্লান তৈরি করতে সাহায্য করবে
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}