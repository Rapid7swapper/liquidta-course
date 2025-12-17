'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  BookOpen,
  Award,
  Users,
  CheckCircle,
  ArrowRight,
  GraduationCap,
  BarChart3,
  Shield,
  Zap,
  Globe,
  LogIn
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'
import { AnimatedCounter } from '@/components/landing/AnimatedCounter'
import { FeatureCard } from '@/components/landing/FeatureCard'
import { TestimonialCard } from '@/components/landing/TestimonialCard'

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-slate-900 to-cyan-950" />
})

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Liquida Capital
          </Link>
          <Button asChild size="sm" className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500">
            <Link href="/sign-in" className="flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col md:flex-row items-center justify-center pt-20 md:pt-16 bg-gradient-to-br from-violet-950 via-slate-900 to-cyan-950">
        {/* Desktop: 3D scene as background */}
        <div className="hidden md:block">
          <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-slate-900 to-cyan-950" />}>
            <HeroScene />
          </Suspense>
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center py-8 md:py-0">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-violet-200 to-cyan-200 bg-clip-text text-transparent"
          >
            Liquida Capital
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Training Academy
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8 md:mb-10 px-4"
          >
            Exclusive professional training for Liquida Capital team members. Master the skills you need to excel with our comprehensive certification program.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center"
          >
            <Button asChild size="lg" className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white px-6 md:px-8 py-5 md:py-6 text-base md:text-lg rounded-xl shadow-lg shadow-violet-500/25">
              <Link href="/sign-in" className="flex items-center gap-2">
                Access Training Portal
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-8 md:mt-16 flex flex-col md:flex-row flex-wrap justify-center gap-4 md:gap-8 text-sm text-gray-500"
          >
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Invite-only access
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Expert-led instruction
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Industry certification
            </div>
          </motion.div>
        </div>

        {/* Mobile: 3D scene below content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="md:hidden w-full h-[300px] relative mt-8"
        >
          <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-slate-900 to-cyan-950" />}>
            <HeroScene />
          </Suspense>
        </motion.div>

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
          <div className="grid grid-cols-3 gap-8">
            {[
              { value: 100, suffix: '+', label: 'Team Members Trained' },
              { value: 15, suffix: '+', label: 'Professional Courses' },
              { value: 98, suffix: '%', label: 'Completion Rate' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-gray-400 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-violet-400 font-medium mb-4 block">WHY CHOOSE US</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything You Need to
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"> Succeed</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Our platform combines cutting-edge technology with expert instruction to deliver an unmatched learning experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BookOpen className="w-7 h-7 text-white" />}
              title="Interactive Learning"
              description="Engage with hands-on projects, real-world scenarios, and interactive exercises that make learning stick."
              gradient="bg-gradient-to-br from-violet-500 to-purple-600"
              delay={0}
            />
            <FeatureCard
              icon={<GraduationCap className="w-7 h-7 text-white" />}
              title="Expert Instructors"
              description="Learn from industry professionals and thought leaders with years of real-world experience."
              gradient="bg-gradient-to-br from-cyan-500 to-blue-600"
              delay={0.1}
            />
            <FeatureCard
              icon={<Award className="w-7 h-7 text-white" />}
              title="Verified Certificates"
              description="Earn industry-recognized certificates that showcase your skills to employers worldwide."
              gradient="bg-gradient-to-br from-pink-500 to-rose-600"
              delay={0.2}
            />
            <FeatureCard
              icon={<BarChart3 className="w-7 h-7 text-white" />}
              title="Progress Tracking"
              description="Monitor your learning journey with detailed analytics and personalized recommendations."
              gradient="bg-gradient-to-br from-amber-500 to-orange-600"
              delay={0.3}
            />
            <FeatureCard
              icon={<Users className="w-7 h-7 text-white" />}
              title="Community Support"
              description="Join a thriving community of learners, share insights, and collaborate on projects."
              gradient="bg-gradient-to-br from-green-500 to-emerald-600"
              delay={0.4}
            />
            <FeatureCard
              icon={<Zap className="w-7 h-7 text-white" />}
              title="Learn at Your Pace"
              description="Access content anytime, anywhere. Learn on your schedule with lifetime access to courses."
              gradient="bg-gradient-to-br from-indigo-500 to-violet-600"
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-cyan-400 font-medium mb-4 block">HOW IT WORKS</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Start Learning in
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent"> 3 Simple Steps</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-violet-500 via-cyan-500 to-violet-500 -translate-y-1/2" />

            {[
              { step: '01', title: 'Contact Your Advisor', description: 'Reach out to your Liquida Advisor to get your training account set up and access credentials.', icon: <Users className="w-8 h-8" /> },
              { step: '02', title: 'Access Your Training', description: 'Log in to your personalized dashboard and explore your assigned courses and materials.', icon: <BookOpen className="w-8 h-8" /> },
              { step: '03', title: 'Complete & Certify', description: 'Work through the modules at your pace, complete assessments, and earn your certification.', icon: <GraduationCap className="w-8 h-8" /> },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/30 relative z-10">
                  {item.icon}
                </div>
                <span className="text-6xl font-bold text-white/5 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4">{item.step}</span>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-slate-950">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-pink-400 font-medium mb-4 block">TESTIMONIALS</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Loved by
              <span className="bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent"> Thousands</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              See what our learners have to say about their experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              name="Marcus Johnson"
              role="Sales Representative"
              content="The CRM training modules completely changed how I manage my pipeline. I now close deals faster and more efficiently than ever before."
              rating={5}
              delay={0}
            />
            <TestimonialCard
              name="Jennifer Martinez"
              role="Account Manager"
              content="Understanding the Liquida business model and value ladder has given me so much more confidence when speaking with clients. Highly recommend!"
              rating={5}
              delay={0.1}
            />
            <TestimonialCard
              name="David Thompson"
              role="Team Lead"
              content="The strategic foundation modules provided incredible insights into positioning and messaging. My team's performance has improved significantly."
              rating={5}
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
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
              Ready to Advance Your Skills?
            </h2>
            <p className="text-xl text-white/80 mb-10">
              Access your exclusive training portal and start your certification journey with Liquida Capital.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-gray-100 px-8 py-6 text-lg rounded-xl shadow-lg font-semibold">
                <Link href="/sign-in" className="flex items-center gap-2 text-slate-900">
                  Access Portal
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white bg-white text-slate-900 hover:bg-gray-100 px-8 py-6 text-lg rounded-xl">
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-slate-950 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                Liquida Capital
              </h3>
              <p className="text-gray-400 mb-6">
                Empowering our team with world-class professional training.
              </p>
              <div className="flex gap-4">
                <Globe className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Shield className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>

            {[
              { title: 'Training', links: ['Courses', 'Certifications', 'Progress', 'Resources'] },
              { title: 'Company', links: ['About Us', 'Our Team', 'Contact'] },
              { title: 'Support', links: ['Help Center', 'FAQ', 'Privacy', 'Terms'] },
            ].map((column) => (
              <div key={column.title}>
                <h4 className="font-semibold text-white mb-4">{column.title}</h4>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link}>
                      <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-white/10 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} Liquida Capital. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
