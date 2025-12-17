// Welcome to Liquida Academy - Course Data
// This is the official course with 19 modules

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number // index of correct option
}

export interface Quiz {
  id: string
  moduleId: string
  title: string
  questions: QuizQuestion[]
  passingScore: number // percentage (e.g., 70)
}

export interface Module {
  id: string
  title: string
  description: string
  position: number
  duration: string
  videoPlaybackId: string | null // Mux playback ID - will be added when videos are uploaded
  quiz: Quiz | null
}

export interface Course {
  id: string
  title: string
  description: string
  imageUrl: string
  modules: Module[]
  totalDuration: string
  isPublished: boolean
}

// Course: Welcome to Liquida Academy
export const liquidaAcademyCourse: Course = {
  id: 'welcome-to-liquida-academy',
  title: 'Welcome to Liquida Academy',
  description: 'Your comprehensive introduction to Liquida Academy. Master the fundamentals and start your learning journey with us.',
  imageUrl: '/course-liquida-academy.jpg',
  totalDuration: '19 modules',
  isPublished: true,
  modules: [
    {
      id: 'module-1',
      title: 'Module 1: Introduction to Liquida Academy',
      description: 'Get started with an overview of the academy, its mission, and what you will learn.',
      position: 1,
      duration: '',
      videoPlaybackId: 'adP7s4vakW6YZ02GyaCyq5dnMF6RNd00QDcAlFpjFVh1U', // Liquida Business Model - Intro Video
      quiz: null
    },
    {
      id: 'module-1-2',
      title: 'Module 1.2: The Strategic Foundation of Liquida',
      description: 'Understand the strategic foundation and core principles that drive Liquida.',
      position: 1.5,
      duration: '',
      videoPlaybackId: 'ReBtYCOifHlW7kJf0201hU9s202jWRP6GZjsPCACSx5QrM',
      quiz: null
    },
    {
      id: 'module-1-3',
      title: 'Module 1.3: Positioning, Messaging & Market Dominance',
      description: 'Learn how to position your brand, craft compelling messaging, and achieve market dominance.',
      position: 1.6,
      duration: '',
      videoPlaybackId: 'WT00LwdGmXIYZIyo9MibT5UMeTEcaaiTEHF4BJzzB02NQ',
      quiz: null
    },
    {
      id: 'module-1-4',
      title: 'Module 1.4: The Liquida Value Ladder & Offer Ecosystem',
      description: 'Explore the Liquida value ladder and understand how the offer ecosystem works.',
      position: 1.7,
      duration: '',
      videoPlaybackId: 'DrR7jIqICxAZemFZGokWCmkkij7ozNrX7RxsEC02dl3U',
      quiz: null
    },
    {
      id: 'module-1-5',
      title: 'Module 1.5: The Liquida Client Avatar',
      description: 'Define and understand the ideal Liquida client avatar.',
      position: 1.8,
      duration: '',
      videoPlaybackId: 'x8lC6b007q2Nhb6Hr7uA3LA2oDxNm7IDK5xr5tb8Mus4',
      quiz: null
    },
    {
      id: 'module-2',
      title: 'Module 2: CRM Overview & Core Infrastructure Breakdown',
      description: 'Get a comprehensive overview of the CRM system and understand the core infrastructure that powers Liquida.',
      position: 2,
      duration: '',
      videoPlaybackId: 'HLaaWtdwiNRLzXdSH9knX01fx9czXulVd2ztT6euhCbo',
      quiz: null
    },
    {
      id: 'module-2-1',
      title: 'Module 2.1: Pipeline Deep Dive & Opportunity Flow',
      description: 'Take a deep dive into the pipeline system and understand how opportunities flow through the sales process.',
      position: 2.1,
      duration: '',
      videoPlaybackId: 'nEMsuf00o6MCAjfCjs5nASGF71UzCc2zwcv02VCQ8KVeE',
      quiz: null
    },
    {
      id: 'module-2-2',
      title: 'Module 2.2: Tags, Custom Fields & Lead Classification Logic',
      description: 'Learn how to use tags, custom fields, and lead classification logic to organize and segment your contacts effectively.',
      position: 2.2,
      duration: '',
      videoPlaybackId: 'WX02a47M7UbEqJkATjIwM49ahM02VEZbGRomG13XZRQTM',
      quiz: null
    },
    {
      id: 'module-3',
      title: 'Module 3: Core Concepts',
      description: 'Understand the foundational concepts that will be built upon throughout the course.',
      position: 3,
      duration: '',
      videoPlaybackId: null,
      quiz: null
    },
    {
      id: 'module-4',
      title: 'Module 4: Building Blocks',
      description: 'Explore the essential building blocks needed for success.',
      position: 4,
      duration: '',
      videoPlaybackId: null,
      quiz: null
    },
    {
      id: 'module-5',
      title: 'Module 5: Practical Applications',
      description: 'Learn how to apply theoretical knowledge in real-world scenarios.',
      position: 5,
      duration: '',
      videoPlaybackId: null,
      quiz: null
    },
    {
      id: 'module-6',
      title: 'Module 6: Advanced Techniques',
      description: 'Dive deeper into advanced methodologies and techniques.',
      position: 6,
      duration: '',
      videoPlaybackId: null,
      quiz: null
    },
    {
      id: 'module-7',
      title: 'Module 7: Best Practices',
      description: 'Discover industry-standard best practices and guidelines.',
      position: 7,
      duration: '',
      videoPlaybackId: null,
      quiz: null
    },
    {
      id: 'module-8',
      title: 'Module 8: Common Challenges',
      description: 'Learn about common obstacles and how to overcome them.',
      position: 8,
      duration: '',
      videoPlaybackId: null,
      quiz: null
    },
    {
      id: 'module-9',
      title: 'Module 9: Problem Solving',
      description: 'Develop critical problem-solving skills and strategies.',
      position: 9,
      duration: '',
      videoPlaybackId: null,
      quiz: null
    },
    {
      id: 'module-10',
      title: 'Module 10: Case Studies',
      description: 'Analyze real-world case studies and learn from practical examples.',
      position: 10,
      duration: '',
      videoPlaybackId: null,
      quiz: null
    },
    {
      id: 'module-11',
      title: 'Module 11: Tools and Resources',
      description: 'Explore essential tools and resources for success.',
      position: 11,
      duration: '',
      videoPlaybackId: null,
      quiz: null
    },
    {
      id: 'module-12',
      title: 'Module 12: Collaboration Skills',
      description: 'Learn effective collaboration and teamwork strategies.',
      position: 12,
      duration: '',
      videoPlaybackId: null,
      quiz: null
    },
    {
      id: 'module-13',
      title: 'Module 13: Communication Excellence',
      description: 'Master the art of clear and effective communication.',
      position: 13,
      duration: '',
      videoPlaybackId: null,
      quiz: null
    },
    {
      id: 'module-14',
      title: 'Module 14: Time Management',
      description: 'Develop strategies for effective time management.',
      position: 14,
      duration: '',
      videoPlaybackId: null,
      quiz: null
    },
    {
      id: 'module-15',
      title: 'Module 15: Goal Setting',
      description: 'Learn how to set and achieve meaningful goals.',
      position: 15,
      duration: '',
      videoPlaybackId: null,
      quiz: null
    },
    {
      id: 'module-16',
      title: 'Module 16: Continuous Improvement',
      description: 'Embrace the mindset of continuous learning and improvement.',
      position: 16,
      duration: '',
      videoPlaybackId: null,
      quiz: null
    },
    {
      id: 'module-17',
      title: 'Module 17: Assessment and Evaluation',
      description: 'Understand how to assess your progress and evaluate outcomes.',
      position: 17,
      duration: '',
      videoPlaybackId: null,
      quiz: null
    },
    {
      id: 'module-18',
      title: 'Module 18: Putting It All Together',
      description: 'Integrate all concepts learned into a cohesive framework.',
      position: 18,
      duration: '',
      videoPlaybackId: null,
      quiz: null
    },
    {
      id: 'module-19',
      title: 'Module 19: Course Completion and Next Steps',
      description: 'Celebrate your achievement and plan your next learning journey.',
      position: 19,
      duration: '',
      videoPlaybackId: null,
      quiz: null
    }
  ]
}

// Helper function to get total module count
export function getTotalModules(): number {
  return liquidaAcademyCourse.modules.length
}

// Helper function to calculate course duration estimate
export function getCourseDuration(): string {
  return `${liquidaAcademyCourse.modules.length} modules`
}

// Export all courses (for future expansion)
export const allCourses: Course[] = [liquidaAcademyCourse]
