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
      duration: '15 min',
      videoPlaybackId: 'adP7s4vakW6YZ02GyaCyq5dnMF6RNd00QDcAlFpjFVh1U', // Liquida Business Model - Intro Video
      quiz: null
    },
    {
      id: 'module-1-2',
      title: 'Module 1.2: The Strategic Foundation of Liquida',
      description: 'Understand the strategic foundation and core principles that drive Liquida.',
      position: 1.5,
      duration: '15 min',
      videoPlaybackId: 'ReBtYCOifHlW7kJf0201hU9s202jWRP6GZjsPCACSx5QrM',
      quiz: null
    },
    {
      id: 'module-1-3',
      title: 'Module 1.3: Positioning, Messaging & Market Dominance',
      description: 'Learn how to position your brand, craft compelling messaging, and achieve market dominance.',
      position: 1.6,
      duration: '15 min',
      videoPlaybackId: 'WT00LwdGmXIYZIyo9MibT5UMeTEcaaiTEHF4BJzzB02NQ',
      quiz: null
    },
    {
      id: 'module-1-4',
      title: 'Module 1.4: The Liquida Value Ladder & Offer Ecosystem',
      description: 'Explore the Liquida value ladder and understand how the offer ecosystem works.',
      position: 1.7,
      duration: '15 min',
      videoPlaybackId: 'DrR7jIqICxAZemFZGokWCmkkij7ozNrX7RxsEC02dl3U',
      quiz: null
    },
    {
      id: 'module-1-5',
      title: 'Module 1.5: The Liquida Client Avatar',
      description: 'Define and understand the ideal Liquida client avatar.',
      position: 1.8,
      duration: '15 min',
      videoPlaybackId: 'kcYoKC402CEqnmWwRNJSU22802LutIGSINR0201RGZN5QNA',
      quiz: {
        id: 'quiz-1',
        moduleId: 'module-1-5',
        title: 'Introduction Quiz',
        passingScore: 70,
        questions: [
          {
            id: 'q1-1',
            question: 'What is the primary goal of Liquida Academy?',
            options: [
              'Entertainment only',
              'Professional development and education',
              'Social networking',
              'Gaming'
            ],
            correctAnswer: 1
          },
          {
            id: 'q1-2',
            question: 'How should you approach this course?',
            options: [
              'Skip to the end',
              'Complete modules in order and take quizzes',
              'Only watch videos',
              'Read summaries only'
            ],
            correctAnswer: 1
          }
        ]
      }
    },
    {
      id: 'module-2',
      title: 'Module 2: Getting Started',
      description: 'Learn how to navigate the platform and set up your learning environment.',
      position: 2,
      duration: '20 min',
      videoPlaybackId: null,
      quiz: {
        id: 'quiz-2',
        moduleId: 'module-2',
        title: 'Getting Started Quiz',
        passingScore: 70,
        questions: [
          {
            id: 'q2-1',
            question: 'Where can you track your course progress?',
            options: [
              'In the dashboard',
              'In email notifications only',
              'On external websites',
              'Progress is not tracked'
            ],
            correctAnswer: 0
          },
          {
            id: 'q2-2',
            question: 'What should you do after completing a module video?',
            options: [
              'Move to the next module immediately',
              'Take the module quiz to test your knowledge',
              'Log out',
              'Delete your account'
            ],
            correctAnswer: 1
          }
        ]
      }
    },
    {
      id: 'module-3',
      title: 'Module 3: Core Concepts',
      description: 'Understand the foundational concepts that will be built upon throughout the course.',
      position: 3,
      duration: '25 min',
      videoPlaybackId: null,
      quiz: {
        id: 'quiz-3',
        moduleId: 'module-3',
        title: 'Core Concepts Quiz',
        passingScore: 70,
        questions: [
          {
            id: 'q3-1',
            question: 'Why are core concepts important?',
            options: [
              'They are not important',
              'They provide foundation for advanced topics',
              'They are optional',
              'They are only for beginners'
            ],
            correctAnswer: 1
          },
          {
            id: 'q3-2',
            question: 'How should you approach learning new concepts?',
            options: [
              'Memorize without understanding',
              'Skip difficult parts',
              'Understand and practice consistently',
              'Only learn what seems easy'
            ],
            correctAnswer: 2
          }
        ]
      }
    },
    {
      id: 'module-4',
      title: 'Module 4: Building Blocks',
      description: 'Explore the essential building blocks needed for success.',
      position: 4,
      duration: '30 min',
      videoPlaybackId: null,
      quiz: {
        id: 'quiz-4',
        moduleId: 'module-4',
        title: 'Building Blocks Quiz',
        passingScore: 70,
        questions: [
          {
            id: 'q4-1',
            question: 'What is the purpose of building blocks in learning?',
            options: [
              'To make content longer',
              'To create a solid foundation for complex topics',
              'To confuse learners',
              'They serve no purpose'
            ],
            correctAnswer: 1
          },
          {
            id: 'q4-2',
            question: 'How do building blocks relate to each other?',
            options: [
              'They are independent and unrelated',
              'Each builds upon the previous ones',
              'They can be learned in any order',
              'Only the first one matters'
            ],
            correctAnswer: 1
          }
        ]
      }
    },
    {
      id: 'module-5',
      title: 'Module 5: Practical Applications',
      description: 'Learn how to apply theoretical knowledge in real-world scenarios.',
      position: 5,
      duration: '35 min',
      videoPlaybackId: null,
      quiz: {
        id: 'quiz-5',
        moduleId: 'module-5',
        title: 'Practical Applications Quiz',
        passingScore: 70,
        questions: [
          {
            id: 'q5-1',
            question: 'Why is practical application important?',
            options: [
              'It is not important',
              'It reinforces theoretical learning',
              'It replaces theory',
              'It is optional'
            ],
            correctAnswer: 1
          },
          {
            id: 'q5-2',
            question: 'When should you practice what you learn?',
            options: [
              'Only during exams',
              'Never',
              'Regularly throughout your learning journey',
              'Only at the end of the course'
            ],
            correctAnswer: 2
          }
        ]
      }
    },
    {
      id: 'module-6',
      title: 'Module 6: Advanced Techniques',
      description: 'Dive deeper into advanced methodologies and techniques.',
      position: 6,
      duration: '40 min',
      videoPlaybackId: null,
      quiz: {
        id: 'quiz-6',
        moduleId: 'module-6',
        title: 'Advanced Techniques Quiz',
        passingScore: 70,
        questions: [
          {
            id: 'q6-1',
            question: 'When should you move to advanced techniques?',
            options: [
              'Before learning basics',
              'After mastering foundational concepts',
              'Whenever you feel like it',
              'Never'
            ],
            correctAnswer: 1
          },
          {
            id: 'q6-2',
            question: 'How do advanced techniques differ from basics?',
            options: [
              'They are exactly the same',
              'They build upon and extend basic concepts',
              'They are completely unrelated',
              'They are easier'
            ],
            correctAnswer: 1
          }
        ]
      }
    },
    {
      id: 'module-7',
      title: 'Module 7: Best Practices',
      description: 'Discover industry-standard best practices and guidelines.',
      position: 7,
      duration: '30 min',
      videoPlaybackId: null,
      quiz: {
        id: 'quiz-7',
        moduleId: 'module-7',
        title: 'Best Practices Quiz',
        passingScore: 70,
        questions: [
          {
            id: 'q7-1',
            question: 'What defines a best practice?',
            options: [
              'Personal preference only',
              'Proven methods that deliver consistent results',
              'The newest trend',
              'The oldest method'
            ],
            correctAnswer: 1
          },
          {
            id: 'q7-2',
            question: 'Why should you follow best practices?',
            options: [
              'Because rules must be followed blindly',
              'To improve efficiency and reduce errors',
              'They are mandatory by law',
              'There is no reason'
            ],
            correctAnswer: 1
          }
        ]
      }
    },
    {
      id: 'module-8',
      title: 'Module 8: Common Challenges',
      description: 'Learn about common obstacles and how to overcome them.',
      position: 8,
      duration: '25 min',
      videoPlaybackId: null,
      quiz: {
        id: 'quiz-8',
        moduleId: 'module-8',
        title: 'Common Challenges Quiz',
        passingScore: 70,
        questions: [
          {
            id: 'q8-1',
            question: 'What is the best approach when facing challenges?',
            options: [
              'Give up immediately',
              'Analyze, learn, and adapt',
              'Ignore them',
              'Blame others'
            ],
            correctAnswer: 1
          },
          {
            id: 'q8-2',
            question: 'How can challenges benefit your learning?',
            options: [
              'They cannot benefit learning',
              'They provide opportunities for growth',
              'They only cause frustration',
              'They should be avoided at all costs'
            ],
            correctAnswer: 1
          }
        ]
      }
    },
    {
      id: 'module-9',
      title: 'Module 9: Problem Solving',
      description: 'Develop critical problem-solving skills and strategies.',
      position: 9,
      duration: '35 min',
      videoPlaybackId: null,
      quiz: {
        id: 'quiz-9',
        moduleId: 'module-9',
        title: 'Problem Solving Quiz',
        passingScore: 70,
        questions: [
          {
            id: 'q9-1',
            question: 'What is the first step in problem solving?',
            options: [
              'Jump to solutions immediately',
              'Clearly define and understand the problem',
              'Ask someone else to solve it',
              'Ignore the problem'
            ],
            correctAnswer: 1
          },
          {
            id: 'q9-2',
            question: 'Why is systematic problem solving important?',
            options: [
              'It wastes time',
              'It ensures thorough and effective solutions',
              'It is not important',
              'It only works for simple problems'
            ],
            correctAnswer: 1
          }
        ]
      }
    },
    {
      id: 'module-10',
      title: 'Module 10: Case Studies',
      description: 'Analyze real-world case studies and learn from practical examples.',
      position: 10,
      duration: '40 min',
      videoPlaybackId: null,
      quiz: {
        id: 'quiz-10',
        moduleId: 'module-10',
        title: 'Case Studies Quiz',
        passingScore: 70,
        questions: [
          {
            id: 'q10-1',
            question: 'What is the value of studying case studies?',
            options: [
              'No value',
              'Learn from real-world successes and failures',
              'Entertainment only',
              'They are outdated'
            ],
            correctAnswer: 1
          },
          {
            id: 'q10-2',
            question: 'How should you approach analyzing a case study?',
            options: [
              'Skim through quickly',
              'Analyze context, decisions, and outcomes thoroughly',
              'Only read the conclusion',
              'Skip them entirely'
            ],
            correctAnswer: 1
          }
        ]
      }
    },
    {
      id: 'module-11',
      title: 'Module 11: Tools and Resources',
      description: 'Explore essential tools and resources for success.',
      position: 11,
      duration: '30 min',
      videoPlaybackId: null,
      quiz: {
        id: 'quiz-11',
        moduleId: 'module-11',
        title: 'Tools and Resources Quiz',
        passingScore: 70,
        questions: [
          {
            id: 'q11-1',
            question: 'Why is it important to know available tools?',
            options: [
              'It is not important',
              'Tools increase efficiency and productivity',
              'Tools are expensive',
              'Only experts need tools'
            ],
            correctAnswer: 1
          },
          {
            id: 'q11-2',
            question: 'How should you select the right tools?',
            options: [
              'Always choose the most expensive',
              'Match tools to your specific needs and goals',
              'Use as many tools as possible',
              'Avoid tools entirely'
            ],
            correctAnswer: 1
          }
        ]
      }
    },
    {
      id: 'module-12',
      title: 'Module 12: Collaboration Skills',
      description: 'Learn effective collaboration and teamwork strategies.',
      position: 12,
      duration: '25 min',
      videoPlaybackId: null,
      quiz: {
        id: 'quiz-12',
        moduleId: 'module-12',
        title: 'Collaboration Skills Quiz',
        passingScore: 70,
        questions: [
          {
            id: 'q12-1',
            question: 'What makes effective collaboration?',
            options: [
              'Working alone',
              'Clear communication, shared goals, and mutual respect',
              'Competing with teammates',
              'Avoiding feedback'
            ],
            correctAnswer: 1
          },
          {
            id: 'q12-2',
            question: 'How should conflicts be handled in a team?',
            options: [
              'Ignore them',
              'Address them constructively and find solutions',
              'Let them escalate',
              'Leave the team'
            ],
            correctAnswer: 1
          }
        ]
      }
    },
    {
      id: 'module-13',
      title: 'Module 13: Communication Excellence',
      description: 'Master the art of clear and effective communication.',
      position: 13,
      duration: '30 min',
      videoPlaybackId: null,
      quiz: {
        id: 'quiz-13',
        moduleId: 'module-13',
        title: 'Communication Excellence Quiz',
        passingScore: 70,
        questions: [
          {
            id: 'q13-1',
            question: 'What is key to effective communication?',
            options: [
              'Using complex vocabulary',
              'Clarity, active listening, and appropriate tone',
              'Speaking as fast as possible',
              'Avoiding eye contact'
            ],
            correctAnswer: 1
          },
          {
            id: 'q13-2',
            question: 'Why is feedback important in communication?',
            options: [
              'It is not important',
              'It ensures understanding and enables improvement',
              'It wastes time',
              'Only negative feedback matters'
            ],
            correctAnswer: 1
          }
        ]
      }
    },
    {
      id: 'module-14',
      title: 'Module 14: Time Management',
      description: 'Develop strategies for effective time management.',
      position: 14,
      duration: '25 min',
      videoPlaybackId: null,
      quiz: {
        id: 'quiz-14',
        moduleId: 'module-14',
        title: 'Time Management Quiz',
        passingScore: 70,
        questions: [
          {
            id: 'q14-1',
            question: 'What is the foundation of good time management?',
            options: [
              'Working longer hours',
              'Prioritization and planning',
              'Multitasking everything',
              'Avoiding breaks'
            ],
            correctAnswer: 1
          },
          {
            id: 'q14-2',
            question: 'How should you handle unexpected tasks?',
            options: [
              'Panic and abandon your schedule',
              'Assess priority and adjust schedule accordingly',
              'Ignore them completely',
              'Do them immediately regardless of importance'
            ],
            correctAnswer: 1
          }
        ]
      }
    },
    {
      id: 'module-15',
      title: 'Module 15: Goal Setting',
      description: 'Learn how to set and achieve meaningful goals.',
      position: 15,
      duration: '30 min',
      videoPlaybackId: null,
      quiz: {
        id: 'quiz-15',
        moduleId: 'module-15',
        title: 'Goal Setting Quiz',
        passingScore: 70,
        questions: [
          {
            id: 'q15-1',
            question: 'What makes a goal effective?',
            options: [
              'Being vague and open-ended',
              'Being specific, measurable, and time-bound',
              'Being impossible to achieve',
              'Having no deadline'
            ],
            correctAnswer: 1
          },
          {
            id: 'q15-2',
            question: 'How should you track goal progress?',
            options: [
              'Do not track at all',
              'Regularly review and measure against milestones',
              'Only check at the deadline',
              'Let others track for you'
            ],
            correctAnswer: 1
          }
        ]
      }
    },
    {
      id: 'module-16',
      title: 'Module 16: Continuous Improvement',
      description: 'Embrace the mindset of continuous learning and improvement.',
      position: 16,
      duration: '25 min',
      videoPlaybackId: null,
      quiz: {
        id: 'quiz-16',
        moduleId: 'module-16',
        title: 'Continuous Improvement Quiz',
        passingScore: 70,
        questions: [
          {
            id: 'q16-1',
            question: 'What is continuous improvement?',
            options: [
              'Making changes only when forced',
              'Ongoing effort to enhance skills and processes',
              'Achieving perfection once',
              'Avoiding change'
            ],
            correctAnswer: 1
          },
          {
            id: 'q16-2',
            question: 'How do you maintain a growth mindset?',
            options: [
              'Believe abilities are fixed',
              'Embrace challenges and learn from failures',
              'Avoid difficult tasks',
              'Compare yourself negatively to others'
            ],
            correctAnswer: 1
          }
        ]
      }
    },
    {
      id: 'module-17',
      title: 'Module 17: Assessment and Evaluation',
      description: 'Understand how to assess your progress and evaluate outcomes.',
      position: 17,
      duration: '30 min',
      videoPlaybackId: null,
      quiz: {
        id: 'quiz-17',
        moduleId: 'module-17',
        title: 'Assessment and Evaluation Quiz',
        passingScore: 70,
        questions: [
          {
            id: 'q17-1',
            question: 'Why is self-assessment valuable?',
            options: [
              'It is not valuable',
              'It helps identify strengths and areas for improvement',
              'It only creates anxiety',
              'Only external assessments matter'
            ],
            correctAnswer: 1
          },
          {
            id: 'q17-2',
            question: 'How often should you evaluate your progress?',
            options: [
              'Never',
              'Only at the end',
              'Regularly at defined intervals',
              'Only when problems arise'
            ],
            correctAnswer: 2
          }
        ]
      }
    },
    {
      id: 'module-18',
      title: 'Module 18: Putting It All Together',
      description: 'Integrate all concepts learned into a cohesive framework.',
      position: 18,
      duration: '35 min',
      videoPlaybackId: null,
      quiz: {
        id: 'quiz-18',
        moduleId: 'module-18',
        title: 'Integration Quiz',
        passingScore: 70,
        questions: [
          {
            id: 'q18-1',
            question: 'Why is integration of concepts important?',
            options: [
              'It is not important',
              'It creates a complete understanding and enables application',
              'It makes things more confusing',
              'Only individual concepts matter'
            ],
            correctAnswer: 1
          },
          {
            id: 'q18-2',
            question: 'How do you apply integrated knowledge?',
            options: [
              'Keep concepts separate',
              'Connect related ideas and apply holistically',
              'Forget previous modules',
              'Only use the latest information'
            ],
            correctAnswer: 1
          }
        ]
      }
    },
    {
      id: 'module-19',
      title: 'Module 19: Course Completion and Next Steps',
      description: 'Celebrate your achievement and plan your next learning journey.',
      position: 19,
      duration: '20 min',
      videoPlaybackId: null,
      quiz: {
        id: 'quiz-19',
        moduleId: 'module-19',
        title: 'Final Quiz',
        passingScore: 70,
        questions: [
          {
            id: 'q19-1',
            question: 'What should you do after completing this course?',
            options: [
              'Forget everything learned',
              'Apply knowledge and continue learning',
              'Stop learning entirely',
              'Repeat the course exactly the same way'
            ],
            correctAnswer: 1
          },
          {
            id: 'q19-2',
            question: 'How can you maximize the value of this course?',
            options: [
              'Never revisit the content',
              'Practice, apply, and share what you learned',
              'Keep the knowledge to yourself',
              'Move to unrelated topics immediately'
            ],
            correctAnswer: 1
          }
        ]
      }
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
