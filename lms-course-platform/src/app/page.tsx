'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Award,
  Users,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Star,
  TrendingUp,
  Sparkles,
  Play,
  BookOpen,
  Shield,
  Globe,
  Layers,
  CreditCard,
  Lock,
  FileCheck,
  MonitorPlay,
  PieChart,
  UserPlus,
  BadgeCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'
import { AnimatedCounter } from '@/components/landing/AnimatedCounter'

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-slate-900 to-cyan-950" />
})

// Browser Mockup Component
function BrowserMockup({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-slate-900 shadow-2xl">
      <div className="bg-slate-800 px-4 py-3 flex items-center gap-3 border-b border-white/10">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-slate-700 rounded-md px-4 py-1 text-xs text-gray-400">
            {title}
          </div>
        </div>
      </div>
      <div className="p-4 bg-slate-950">
        {children}
      </div>
    </div>
  )
}

// Dashboard Mockup
function DashboardMockup() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500" />
          <span className="font-bold text-white">Your Academy</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">Student</span>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Enrolled', value: '3', color: 'violet' },
          { label: 'Progress', value: '67%', color: 'cyan' },
          { label: 'Completed', value: '12', color: 'green' },
          { label: 'Certificates', value: '2', color: 'amber' },
        ].map((stat) => (
          <div key={stat.label} className="bg-slate-800/50 rounded-lg p-3 text-center">
            <div className={`text-lg font-bold text-${stat.color}-400`}>{stat.value}</div>
            <div className="text-[10px] text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Course Cards */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-gray-400">Continue Learning</h3>
        {[
          { title: 'Business Fundamentals', progress: 75, modules: '8/12' },
          { title: 'Sales Mastery', progress: 30, modules: '3/10' },
        ].map((course) => (
          <div key={course.title} className="bg-slate-800/30 rounded-lg p-3 flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-violet-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-white">{course.title}</div>
              <div className="text-[10px] text-gray-500">{course.modules} modules</div>
              <div className="mt-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full" style={{ width: `${course.progress}%` }} />
              </div>
            </div>
            <div className="text-xs font-bold text-cyan-400">{course.progress}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Video Player Mockup
function VideoPlayerMockup() {
  return (
    <div className="space-y-4">
      {/* Video */}
      <div className="relative aspect-video bg-slate-800 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-cyan-500/10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center cursor-pointer hover:bg-white/30 transition-all">
            <Play className="w-8 h-8 text-white fill-white ml-1" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full w-[45%] bg-violet-500 rounded-full" />
          </div>
          <div className="flex justify-between mt-2 text-xs text-white/80">
            <span>12:34</span>
            <span>27:50</span>
          </div>
        </div>
      </div>

      {/* Module Info */}
      <div className="flex gap-4">
        <div className="flex-1">
          <h3 className="text-sm font-bold text-white">Module 3: Sales Pipeline Mastery</h3>
          <p className="text-xs text-gray-400 mt-1">Learn to build and optimize your sales funnel...</p>
        </div>
        <Button size="sm" className="bg-gradient-to-r from-violet-600 to-cyan-600 text-xs">
          Next Module
        </Button>
      </div>
    </div>
  )
}

// Progress Tracker Mockup
function ProgressMockup() {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-gray-400">Course Progress</span>
        <span className="text-lg font-bold text-violet-400">67%</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div className="h-full w-[67%] bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full" />
      </div>
      <div className="space-y-2 mt-4">
        {[
          { title: 'Introduction', completed: true },
          { title: 'Core Concepts', completed: true },
          { title: 'Sales Pipeline', completed: true },
          { title: 'CRM Setup', current: true },
          { title: 'Advanced Tactics', locked: true },
          { title: 'Final Assessment', locked: true },
        ].map((module, i) => (
          <div key={i} className={`flex items-center gap-3 p-2 rounded-lg ${module.current ? 'bg-violet-500/10 border border-violet-500/30' : ''}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              module.completed ? 'bg-green-500' : module.current ? 'bg-violet-500' : 'bg-slate-700'
            }`}>
              {module.completed ? (
                <CheckCircle className="w-4 h-4 text-white" />
              ) : module.locked ? (
                <Lock className="w-3 h-3 text-gray-500" />
              ) : (
                <Play className="w-3 h-3 text-white" />
              )}
            </div>
            <span className={`text-xs ${module.locked ? 'text-gray-600' : 'text-gray-300'}`}>{module.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Quiz Mockup
function QuizMockup() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-400">Question 3 of 5</span>
        <span className="text-xs text-violet-400">60%</span>
      </div>
      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div className="h-full w-[60%] bg-gradient-to-r from-violet-500 to-cyan-500" />
      </div>
      <div className="bg-slate-800/50 rounded-xl p-4 mt-4">
        <h3 className="text-sm font-semibold text-white mb-4">What is the primary goal of a sales pipeline?</h3>
        <div className="space-y-2">
          {[
            'Track inventory levels',
            'Visualize and manage sales opportunities',
            'Calculate employee salaries',
            'Monitor website traffic',
          ].map((option, i) => (
            <div key={i} className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
              i === 1 ? 'border-violet-500 bg-violet-500/20 text-violet-300' : 'border-white/10 text-gray-400 hover:border-white/20'
            }`}>
              {option}
            </div>
          ))}
        </div>
        <Button className="w-full mt-4 bg-gradient-to-r from-violet-600 to-cyan-600 text-sm">
          Submit Answer
        </Button>
      </div>
    </div>
  )
}

// Admin Dashboard Mockup
function AdminMockup() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-bold text-white">Admin Dashboard</span>
        </div>
        <Button size="sm" className="bg-violet-600 text-xs h-7">
          <UserPlus className="w-3 h-3 mr-1" /> Add Student
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Students', value: '156', icon: Users },
          { label: 'Completion', value: '73%', icon: TrendingUp },
          { label: 'Certificates', value: '89', icon: Award },
        ].map((stat) => (
          <div key={stat.label} className="bg-slate-800/50 rounded-lg p-3 text-center">
            <stat.icon className="w-4 h-4 text-violet-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">{stat.value}</div>
            <div className="text-[10px] text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-slate-800/30 rounded-lg overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="text-left p-2 text-gray-400">Student</th>
              <th className="text-left p-2 text-gray-400">Progress</th>
              <th className="text-left p-2 text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'John Smith', progress: 85, active: true },
              { name: 'Sarah Wilson', progress: 62, active: true },
              { name: 'Mike Brown', progress: 100, active: false },
            ].map((student) => (
              <tr key={student.name} className="border-t border-white/5">
                <td className="p-2 text-white">{student.name}</td>
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${student.progress}%` }} />
                    </div>
                    <span className="text-gray-400">{student.progress}%</span>
                  </div>
                </td>
                <td className="p-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] ${student.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {student.active ? 'Active' : 'Completed'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Certificate Mockup
function CertificateMockup() {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-white/10 text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-cyan-500 to-violet-500" />
      <div className="absolute top-4 right-4">
        <BadgeCheck className="w-8 h-8 text-cyan-400" />
      </div>
      <Award className="w-12 h-12 text-amber-400 mx-auto mb-3" />
      <div className="text-[10px] text-gray-500 uppercase tracking-wider">Certificate of Completion</div>
      <div className="text-lg font-bold text-white mt-2">Business Fundamentals</div>
      <div className="text-sm text-gray-400 mt-1">Awarded to <span className="text-cyan-400">John Smith</span></div>
      <div className="text-xs text-gray-500 mt-4">Issued: January 5, 2026</div>
      <div className="text-[10px] text-gray-600 mt-1">Certificate ID: CERT-2026-00847</div>
    </div>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            CourseForge
          </Link>
          <div className="flex items-center gap-4">
            <Link href="#features" className="text-gray-400 hover:text-white transition-colors hidden md:block">
              Features
            </Link>
            <Link href="#demo" className="text-gray-400 hover:text-white transition-colors hidden md:block">
              Live Demo
            </Link>
            <Link href="#pricing" className="text-gray-400 hover:text-white transition-colors hidden md:block">
              Pricing
            </Link>
            <Button asChild size="sm" className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500">
              <Link href="/sign-in" className="flex items-center gap-2">
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 bg-gradient-to-br from-violet-950 via-slate-900 to-cyan-950">
        <div className="hidden md:block">
          <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-slate-900 to-cyan-950" />}>
            <HeroScene />
          </Suspense>
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 border border-violet-500/30 rounded-full px-4 py-2 mb-8"
          >
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-violet-300">Launch Your Online Course Business Today</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-white via-violet-200 to-cyan-200 bg-clip-text text-transparent">
              Turn Your Course Into a
            </span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Digital University
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-8 px-4"
          >
            We build custom-branded learning platforms for course creators. Track student progress,
            create certificates, set your own pricing, and scale your education business.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
          >
            <Button asChild size="lg" className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-violet-500/25">
              <Link href="#demo" className="flex items-center gap-2">
                See Live Demo
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl">
              <Link href="#pricing" className="flex items-center gap-2">
                View Pricing
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-6 text-sm text-gray-500"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Custom Branding
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Video Hosting Included
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Student Progress Tracking
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Set Your Own Price
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-white/50"
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 50, suffix: '+', label: 'Courses Launched' },
              { value: 10000, suffix: '+', label: 'Students Enrolled' },
              { value: 99, suffix: '%', label: 'Uptime' },
              { value: 4.9, suffix: '/5', label: 'Client Rating' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-gray-400 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-violet-400 font-medium mb-4 block">EVERYTHING YOU NEED</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Your Complete
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"> Learning Platform</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              We handle the tech so you can focus on creating amazing content and growing your audience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <MonitorPlay className="w-6 h-6" />, title: 'HD Video Hosting', description: 'Stream your courses in HD with our Mux-powered video infrastructure. No buffering, no limits.', gradient: 'from-violet-500 to-purple-600' },
              { icon: <BarChart3 className="w-6 h-6" />, title: 'Progress Tracking', description: 'Real-time tracking of every student\'s progress. See who\'s engaged and who needs help.', gradient: 'from-cyan-500 to-blue-600' },
              { icon: <FileCheck className="w-6 h-6" />, title: 'Interactive Quizzes', description: 'Test knowledge with built-in quizzes. Set passing scores and track results.', gradient: 'from-pink-500 to-rose-600' },
              { icon: <Award className="w-6 h-6" />, title: 'Custom Certificates', description: 'Auto-generate branded certificates when students complete your course.', gradient: 'from-amber-500 to-orange-600' },
              { icon: <CreditCard className="w-6 h-6" />, title: 'Flexible Pricing', description: 'Charge monthly, yearly, or one-time. Set your own prices and keep more profit.', gradient: 'from-green-500 to-emerald-600' },
              { icon: <Users className="w-6 h-6" />, title: 'Student Management', description: 'Admin dashboard to add students, set deadlines, and manage your entire academy.', gradient: 'from-indigo-500 to-violet-600' },
              { icon: <Shield className="w-6 h-6" />, title: 'Secure Access', description: 'Protected content with user authentication. Only paying students see your material.', gradient: 'from-red-500 to-pink-600' },
              { icon: <PieChart className="w-6 h-6" />, title: 'Analytics Dashboard', description: 'Deep insights into student engagement, completion rates, and revenue.', gradient: 'from-teal-500 to-cyan-600' },
              { icon: <Globe className="w-6 h-6" />, title: 'Custom Branding', description: 'Your logo, your colors, your domain. It looks and feels like YOUR platform.', gradient: 'from-fuchsia-500 to-purple-600' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 hover:border-violet-500/50 transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Preview Section */}
      <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-cyan-400 font-medium mb-4 block">SEE IT IN ACTION</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              What Your Students
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent"> Will Experience</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              A beautiful, intuitive learning experience that keeps students engaged and coming back.
            </p>
          </motion.div>

          {/* Mockups Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-violet-400" /> Student Dashboard
              </h3>
              <BrowserMockup title="youracademy.com/dashboard">
                <DashboardMockup />
              </BrowserMockup>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <MonitorPlay className="w-5 h-5 text-cyan-400" /> Video Learning
              </h3>
              <BrowserMockup title="youracademy.com/course/module-3">
                <VideoPlayerMockup />
              </BrowserMockup>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" /> Progress Tracking
              </h3>
              <BrowserMockup title="Progress Sidebar">
                <ProgressMockup />
              </BrowserMockup>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-pink-400" /> Interactive Quizzes
              </h3>
              <BrowserMockup title="Module Quiz">
                <QuizMockup />
              </BrowserMockup>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" /> Certificates
              </h3>
              <div className="rounded-xl overflow-hidden border border-white/10 bg-slate-900 shadow-2xl p-4">
                <CertificateMockup />
              </div>
            </motion.div>
          </div>

          {/* Admin Preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2 justify-center">
              <Shield className="w-5 h-5 text-amber-400" /> Powerful Admin Dashboard
            </h3>
            <div className="max-w-2xl mx-auto">
              <BrowserMockup title="youracademy.com/admin">
                <AdminMockup />
              </BrowserMockup>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section id="demo" className="py-24 bg-slate-950">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-pink-400 font-medium mb-4 block">LIVE EXAMPLE</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              See a Real Platform
              <span className="bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent"> We Built</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              This is Liquida Academy - a custom learning platform we built for a client.
              Your platform can look just like this, customized with your brand.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative rounded-2xl overflow-hidden border-2 border-violet-500/30 shadow-2xl shadow-violet-500/10">
              <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-sm font-bold px-4 py-2 rounded-full">
                Live Demo
              </div>

              <div className="bg-slate-900 p-2">
                <div className="bg-slate-800 rounded-t-lg px-4 py-2 flex items-center gap-3 border-b border-white/10">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="bg-slate-700 rounded-md px-4 py-1 text-sm text-gray-400">
                      liquida-academy.vercel.app
                    </div>
                  </div>
                </div>

                {/* Demo Content */}
                <div className="bg-slate-950 p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500" />
                      <div>
                        <div className="font-bold text-white">Liquida Academy</div>
                        <div className="text-xs text-gray-500">19 Professional Modules</div>
                      </div>
                    </div>
                    <span className="text-xs bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full">Student View</span>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { title: 'Introduction to Liquida Academy', progress: 100 },
                      { title: 'Strategic Foundation', progress: 100 },
                      { title: 'Positioning & Market Dominance', progress: 75 },
                      { title: 'Value Ladder & Offer Ecosystem', progress: 0 },
                      { title: 'Client Avatar', progress: 0 },
                      { title: 'CRM Overview', progress: 0 },
                    ].map((module, i) => (
                      <div key={i} className="bg-slate-800/50 rounded-lg p-4 border border-white/5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            module.progress === 100 ? 'bg-green-500' : module.progress > 0 ? 'bg-violet-500' : 'bg-slate-700'
                          }`}>
                            {module.progress === 100 ? (
                              <CheckCircle className="w-4 h-4 text-white" />
                            ) : module.progress > 0 ? (
                              <Play className="w-4 h-4 text-white" />
                            ) : (
                              <Lock className="w-4 h-4 text-gray-500" />
                            )}
                          </div>
                          <div className="text-xs font-medium text-white leading-tight">{module.title}</div>
                        </div>
                        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${module.progress === 100 ? 'bg-green-500' : 'bg-violet-500'}`} style={{ width: `${module.progress}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center pt-4">
                    <Button asChild className="bg-gradient-to-r from-violet-600 to-cyan-600">
                      <Link href="/sign-in" className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Explore Full Demo
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center text-gray-500 text-sm mt-6">
              * Sign up for a free demo account to explore all features
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-amber-400 font-medium mb-4 block">SIMPLE PRICING</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              One Platform,
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent"> Built For You</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              We build your custom platform, you keep 100% of your course revenue.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Setup Package */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-slate-800/50 border border-white/10 rounded-3xl p-8"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Platform Setup</h3>
                <p className="text-gray-400">One-time build fee</p>
              </div>

              <div className="text-center mb-8">
                <div className="text-5xl font-bold text-white">Custom</div>
                <p className="text-sm text-gray-500 mt-2">Based on your requirements</p>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  'Custom branded platform',
                  'Up to 50 video modules',
                  'Quiz & assessment system',
                  'Certificate generation',
                  'Student dashboard',
                  'Admin dashboard',
                  'Payment integration',
                  'Mobile responsive design',
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <Button asChild className="w-full py-6 text-lg bg-white text-slate-900 hover:bg-gray-100">
                <Link href="#contact">Get a Quote</Link>
              </Button>
            </motion.div>

            {/* Monthly Hosting */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-violet-500/50 rounded-3xl p-8"
            >
              <div className="absolute top-0 right-0 bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-sm font-bold px-4 py-2 rounded-bl-xl rounded-tr-2xl">
                RECOMMENDED
              </div>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Monthly Hosting</h3>
                <p className="text-gray-400">Keep your platform running</p>
              </div>

              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-white">$99</span>
                  <span className="text-xl text-gray-400">/month</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Billed monthly, cancel anytime</p>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  'Unlimited students',
                  'HD video streaming',
                  '99.9% uptime guarantee',
                  'SSL security included',
                  'Daily backups',
                  'Email support',
                  'Platform updates',
                  'Keep 100% of revenue',
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <Button asChild size="lg" className="w-full py-6 text-lg bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500">
                <Link href="#contact">Start Your Academy</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-950">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-green-400 font-medium mb-4 block">SUCCESS STORIES</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Course Creators
              <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent"> Love Us</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Mitchell',
                role: 'Business Coach',
                content: 'I went from selling PDFs to running a full online academy. My students love the professional feel and I\'ve tripled my revenue.',
                rating: 5
              },
              {
                name: 'Marcus Chen',
                role: 'Fitness Instructor',
                content: 'The progress tracking keeps my clients accountable. I can see exactly who\'s completing workouts and who needs motivation.',
                rating: 5
              },
              {
                name: 'Jennifer Adams',
                role: 'Marketing Consultant',
                content: 'Having my own branded platform makes me look so much more professional than using generic course sites. Worth every penny.',
                rating: 5
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/50 border border-white/10 rounded-2xl p-6"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="contact" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-600" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Launch Your Academy?
            </h2>
            <p className="text-xl text-white/80 mb-10">
              Let's build your custom learning platform. Schedule a free consultation
              and see how we can turn your course into a thriving online business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-gray-100 px-10 py-6 text-lg rounded-xl shadow-lg font-semibold">
                <Link href="mailto:hello@courseforge.com" className="flex items-center gap-2">
                  Schedule Free Call
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-white/10 backdrop-blur text-white border border-white/30 hover:bg-white/20 px-10 py-6 text-lg rounded-xl">
                <Link href="/sign-in">
                  Try Demo
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-950 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                CourseForge
              </h3>
              <p className="text-gray-500 text-sm">
                Turn your course into a digital university.
              </p>
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link href="#features" className="hover:text-white transition-colors">Features</Link>
              <Link href="#demo" className="hover:text-white transition-colors">Demo</Link>
              <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
              <Link href="#contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} CourseForge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
