'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

// Types
interface UserProfile {
  personal: {
    name: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    address: string;
    avatar: string;
    joinDate: string;
  };
  academic: {
    institution: string;
    degree: string;
    graduationYear: string;
    cgpa: string;
    bcsExam: string;
    targetCadre: string;
    preparationStart: string;
    studyHours: string;
  };
  stats: {
    examsTaken: number;
    totalQuestions: number;
    averageScore: number;
    accuracy: number;
    currentRank: number;
    improvement: number;
    streak: number;
    studyTime: string;
  };
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    studyReminders: boolean;
    weeklyReports: boolean;
    publicProfile: boolean;
    language: string;
    theme: string;
  };
  subscription: {
    plan: string;
    status: string;
    since: string;
    expires: string;
    features: string[];
  };
}

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  isPublic: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  progress?: number;
  totalLessons?: number;
  completedLessons?: number;
}

interface Subject {
  id: string;
  name: string;
  description: string;
  courseId: string;
  order: number;
  createdAt: string;
  progress?: number;
  completedLessons?: number;
  totalLessons?: number;
  lessons?: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  content: string;
  estimatedMarks: number;
  importance: 'low' | 'medium' | 'high';
  subjectId: string;
  order: number;
  isPublished: boolean;
  createdAt: string;
  completed?: boolean;
  score?: number;
  timeSpent?: number;
  lastAccessed?: string;
}

interface UserProgress {
  id: string;
  userId: string;
  lessonId: string;
  courseId: string;
  completed: boolean;
  score: number | null;
  timeSpent: number;
  lastAccessed: string;
  createdAt: string;
}

interface UserStats {
  totalCourses: number;
  totalLessons: number;
  completedLessons: number;
  totalStudyTime: number;
  averageScore: number;
  courseProgress: Array<{
    courseId: string;
    courseTitle: string;
    totalLessons: number;
    completedLessons: number;
    progress: number;
  }>;
  recentActivity: Array<{
    lessonTitle: string;
    subjectName: string;
    courseTitle: string;
    completed: boolean;
    score: number | null;
    timeSpent: number;
    lastAccessed: string;
  }>;
}

// Main User Profile Hook
export function useUserProfile() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Fetch user profile
  const {
    data: profile,
    isLoading: isProfileLoading,
    error: profileError,
    refetch: refetchProfile
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async (): Promise<UserProfile> => {
      const response = await fetch('/api/user/profile');
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      return response.json();
    },
    enabled: !!session,
    retry: 2,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<UserProfile>) => {
      const response = await fetch('/api/user/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update profile');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast.success('Profile updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Update stats mutation
  const updateStatsMutation = useMutation({
    mutationFn: async (stats: UserProfile['stats']) => {
      const response = await fetch('/api/user/stats/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stats }),
      });

      if (!response.ok) {
        throw new Error('Failed to update stats');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast.success('Stats updated successfully');
    },
    onError: () => {
      toast.error('Failed to update stats');
    },
  });

  return {
    // Profile data
    profile,
    isProfileLoading,
    profileError,
    refetchProfile,
    
    // Profile mutations
    updateProfile: updateProfileMutation.mutateAsync,
    updateStats: updateStatsMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
  };
}

// Courses Hook
export function useCourses() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Fetch user courses
  const {
    data: courses,
    isLoading: isCoursesLoading,
    error: coursesError,
    refetch: refetchCourses
  } = useQuery({
    queryKey: ['userCourses'],
    queryFn: async (): Promise<{ courses: Course[] }> => {
      const response = await fetch('/api/courses');
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      return response.json();
    },
    enabled: !!session,
    retry: 2,
  });

  // Create course mutation
  const createCourseMutation = useMutation({
    mutationFn: async (courseData: { course: any; subjects: any[] }) => {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create course');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userCourses'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
      toast.success('Course created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Update course mutation
  const updateCourseMutation = useMutation({
    mutationFn: async ({ courseId, data }: { courseId: string; data: Partial<Course> }) => {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update course');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userCourses'] });
      queryClient.invalidateQueries({ queryKey: ['course'] });
      toast.success('Course updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Delete course mutation
  const deleteCourseMutation = useMutation({
    mutationFn: async (courseId: string) => {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete course');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userCourses'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
      toast.success('Course deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    // Courses data
    courses: courses?.courses || [],
    isCoursesLoading,
    coursesError,
    refetchCourses,
    
    // Course mutations
    createCourse: createCourseMutation.mutateAsync,
    updateCourse: updateCourseMutation.mutateAsync,
    deleteCourse: deleteCourseMutation.mutateAsync,
    isCreating: createCourseMutation.isPending,
    isUpdating: updateCourseMutation.isPending,
    isDeleting: deleteCourseMutation.isPending,
  };
}

// Single Course Hook
export function useCourse(courseId: string) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const {
    data: courseData,
    isLoading: isCourseLoading,
    error: courseError,
    refetch: refetchCourse
  } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async (): Promise<{ course: Course; subjects: Subject[] }> => {
      const response = await fetch(`/api/courses/${courseId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch course');
      }
      return response.json();
    },
    enabled: !!session && !!courseId,
    retry: 2,
  });

  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async (progressData: {
      lessonId: string;
      completed?: boolean;
      score?: number;
      timeSpent?: number;
    }) => {
      const response = await fetch('/api/progress', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(progressData),
      });

      if (!response.ok) {
        throw new Error('Failed to update progress');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
    },
    onError: () => {
      toast.error('Failed to update progress');
    },
  });

  // Mark lesson as completed
  const markLessonCompleted = async (lessonId: string, score?: number, timeSpent?: number) => {
    return updateProgressMutation.mutateAsync({
      lessonId,
      completed: true,
      score,
      timeSpent,
    });
  };

  // Update lesson time spent
  const updateLessonTime = async (lessonId: string, timeSpent: number) => {
    return updateProgressMutation.mutateAsync({
      lessonId,
      timeSpent,
    });
  };

  return {
    // Course data
    course: courseData?.course,
    subjects: courseData?.subjects || [],
    isCourseLoading,
    courseError,
    refetchCourse,
    
    // Progress mutations
    updateProgress: updateProgressMutation.mutateAsync,
    markLessonCompleted,
    updateLessonTime,
    isUpdatingProgress: updateProgressMutation.isPending,
  };
}

// User Progress Hook
export function useUserProgress(courseId?: string, lessonId?: string) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const {
    data: progressData,
    isLoading: isProgressLoading,
    error: progressError,
    refetch: refetchProgress
  } = useQuery({
    queryKey: ['userProgress', courseId, lessonId],
    queryFn: async (): Promise<{ progress: UserProgress | UserProgress[] }> => {
      let url = '/api/progress';
      const params = new URLSearchParams();
      
      if (lessonId) {
        params.append('lessonId', lessonId);
      } else if (courseId) {
        params.append('courseId', courseId);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch progress');
      }
      return response.json();
    },
    enabled: !!session,
    retry: 2,
  });

  // Create progress mutation
  const createProgressMutation = useMutation({
    mutationFn: async (progressData: {
      lessonId: string;
      courseId: string;
      completed?: boolean;
      score?: number;
      timeSpent?: number;
    }) => {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(progressData),
      });

      if (!response.ok) {
        throw new Error('Failed to create progress');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
    },
    onError: () => {
      toast.error('Failed to create progress');
    },
  });

  return {
    // Progress data
    progress: progressData?.progress,
    isProgressLoading,
    progressError,
    refetchProgress,
    
    // Progress mutations
    createProgress: createProgressMutation.mutateAsync,
    isCreatingProgress: createProgressMutation.isPending,
  };
}

// User Statistics Hook
export function useUserStats() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const {
    data: statsData,
    isLoading: isStatsLoading,
    error: statsError,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['userStats'],
    queryFn: async (): Promise<{ stats: UserStats }> => {
      const response = await fetch('/api/user/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      return response.json();
    },
    enabled: !!session,
    retry: 2,
  });

  // Refresh stats manually
  const refreshStats = () => {
    queryClient.invalidateQueries({ queryKey: ['userStats'] });
  };

  return {
    // Stats data
    stats: statsData?.stats,
    isStatsLoading,
    statsError,
    refetchStats,
    refreshStats,
  };
}

// Lesson Hook
export function useLesson(lessonId: string) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const {
    data: lessonData,
    isLoading: isLessonLoading,
    error: lessonError,
    refetch: refetchLesson
  } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: async (): Promise<{ lesson: Lesson & { subjectName: string; courseTitle: string; courseId: string }; progress: UserProgress | null }> => {
      const response = await fetch(`/api/lessons/${lessonId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch lesson');
      }
      return response.json();
    },
    enabled: !!session && !!lessonId,
    retry: 2,
  });

  // Update lesson mutation (for teachers)
  const updateLessonMutation = useMutation({
    mutationFn: async (lessonData: Partial<Lesson>) => {
      const response = await fetch(`/api/lessons/${lessonId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lessonData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update lesson');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lesson', lessonId] });
      queryClient.invalidateQueries({ queryKey: ['course'] });
      toast.success('Lesson updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    // Lesson data
    lesson: lessonData?.lesson,
    progress: lessonData?.progress,
    isLessonLoading,
    lessonError,
    refetchLesson,
    
    // Lesson mutations
    updateLesson: updateLessonMutation.mutateAsync,
    isUpdatingLesson: updateLessonMutation.isPending,
  };
}

// Combined Hook for Easy Usage
export function useLearning() {
  const profile = useUserProfile();
  const courses = useCourses();
  const stats = useUserStats();

  return {
    // Profile
    ...profile,
    
    // Courses
    ...courses,
    
    // Stats
    ...stats,

    // Combined loading state
    isLoading: profile.isProfileLoading || courses.isCoursesLoading || stats.isStatsLoading,
  };
}

// Quick progress update hook
export function useQuickProgress() {
  const { updateProgress, isUpdatingProgress } = useCourse('');
  
  const completeLesson = async (lessonId: string, score?: number, timeSpent?: number) => {
    try {
      await updateProgress({
        lessonId,
        completed: true,
        score,
        timeSpent,
      });
      toast.success('Lesson completed!');
    } catch (error) {
      toast.error('Failed to mark lesson as completed');
    }
  };

  const updateStudyTime = async (lessonId: string, timeSpent: number) => {
    try {
      await updateProgress({
        lessonId,
        timeSpent,
      });
    } catch (error) {
      console.error('Failed to update study time');
    }
  };

  return {
    completeLesson,
    updateStudyTime,
    isUpdatingProgress,
  };
}