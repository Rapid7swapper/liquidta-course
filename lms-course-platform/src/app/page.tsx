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
  Target,
  Zap,
  Star,
  TrendingUp,
  DollarSign,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'
import { AnimatedCounter } from '@/components/landing/AnimatedCounter'

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-slate-900 to-cyan-950" />
})

const modules = [
  { title: 'Introduction to Liquida Academy', description: 'Overview of the academy, its mission, and what you will learn' },
  { title: 'The Strategic Foundation of Liquida', description: 'Core principles and strategic foundation that drive success' },
  { title: 'Positioning, Messaging & Market Dominance', description: 'Craft compelling messaging and achieve market dominance' },
  { title: 'The Liquida Value Ladder & Offer Ecosystem', description: 'Master the value ladder and offer ecosystem' },
  { title: 'The Liquida Client Avatar', description: 'Define and understand your ideal client avatar' },
  { title: 'CRM Overview & Core Infrastructure', description: 'Comprehensive CRM system and infrastructure breakdown' },
  { title: 'Pipeline Deep Dive & Opportunity Flow', description: 'Master the pipeline system and opportunity flow' },
  { title: 'Tags, Custom Fields & Lead Classification', description: 'Organize and segment contacts effectively' },
  { title: 'Core Concepts', description: 'Foundational concepts for business success' },
  { title: 'Building Blocks', description: 'Essential building blocks for scaling' },
  { title: 'Practical Applications', description: 'Apply knowledge in real-world scenarios' },
  { title: 'Advanced Techniques', description: 'Advanced methodologies and strategies' },
  { title: 'Best Practices', description: 'Industry-standard guidelines' },
  { title: 'Common Challenges & Solutions', description: 'Overcome obstacles effectively' },
  { title: 'Problem Solving', description: 'Critical problem-solving skills' },
  { title: 'Case Studies', description: 'Learn from real-world examples' },
  { title: 'Tools and Resources', description: 'Essential tools for success' },
  { title: 'Collaboration & Communication', description: 'Master teamwork and communication' },
  { title: 'Course Completion & Next Steps', description: 'Plan your next learning journey' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Liquida Academy
          </Link>
          <div className="flex items-center gap-4">
            <Link href="#pricing" className="text-gray-400 hover:text-white transition-colors hidden md:block">
              Pricing
            </Link>
            <Link href="#modules" className="text-gray-400 hover:text-white transition-colors hidden md:block">
              Curriculum
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
            <span className="text-sm text-violet-300">Master Business Growth in 19 Comprehensive Modules</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-white via-violet-200 to-cyan-200 bg-clip-text text-transparent">
              Scale Your Business
            </span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Like a Pro
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-8 px-4"
          >
            Learn the exact strategies, CRM systems, and sales frameworks used by top-performing businesses.
            From positioning to pipeline mastery - everything you need to dominate your market.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
          >
            <Button asChild size="lg" className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-violet-500/25">
              <Link href="/sign-in" className="flex items-center gap-2">
                Start Learning Today
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2 text-gray-400">
              <DollarSign className="w-5 h-5 text-green-400" />
              <span className="text-2xl font-bold text-white">$100</span>
              <span>/month</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-6 text-sm text-gray-500"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              19 Video Modules
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Lifetime Access
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Certificate of Completion
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Cancel Anytime
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
              { value: 19, suffix: '', label: 'Expert Modules' },
              { value: 500, suffix: '+', label: 'Students Enrolled' },
              { value: 98, suffix: '%', label: 'Success Rate' },
              { value: 24, suffix: '/7', label: 'Access' },
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

      {/* What You'll Learn Section */}
      <section className="py-24 bg-slate-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-violet-400 font-medium mb-4 block">WHAT YOU'LL MASTER</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Transform Your Business
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"> Skills</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Our comprehensive curriculum covers everything from strategic positioning to advanced CRM mastery.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Target className="w-6 h-6" />, title: 'Strategic Positioning', description: 'Learn how to position yourself as the go-to expert in your market', gradient: 'from-violet-500 to-purple-600' },
              { icon: <TrendingUp className="w-6 h-6" />, title: 'Sales Pipeline Mastery', description: 'Build and optimize a sales pipeline that converts consistently', gradient: 'from-cyan-500 to-blue-600' },
              { icon: <Users className="w-6 h-6" />, title: 'Client Avatar Definition', description: 'Identify and attract your ideal customers with precision', gradient: 'from-pink-500 to-rose-600' },
              { icon: <BarChart3 className="w-6 h-6" />, title: 'CRM Infrastructure', description: 'Set up systems that scale with your business growth', gradient: 'from-amber-500 to-orange-600' },
              { icon: <Zap className="w-6 h-6" />, title: 'Value Ladder Creation', description: 'Design offers that maximize customer lifetime value', gradient: 'from-green-500 to-emerald-600' },
              { icon: <Award className="w-6 h-6" />, title: 'Market Dominance', description: 'Strategies to become the undisputed leader in your niche', gradient: 'from-indigo-500 to-violet-600' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
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

      {/* Course Modules Section */}
      <section id="modules" className="py-24 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-cyan-400 font-medium mb-4 block">FULL CURRICULUM</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">19 Comprehensive</span> Modules
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              A complete business education designed to take you from beginner to expert.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {modules.map((module, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-4 bg-slate-800/30 border border-white/5 rounded-xl p-4 hover:border-violet-500/30 transition-all"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{module.title}</h3>
                  <p className="text-gray-500 text-sm">{module.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-950">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-pink-400 font-medium mb-4 block">SIMPLE PRICING</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Invest in Your
              <span className="bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent"> Future</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-lg mx-auto"
          >
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-violet-500/50 rounded-3xl p-8 md:p-10 overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-sm font-bold px-4 py-2 rounded-bl-xl">
                BEST VALUE
              </div>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Full Academy Access</h3>
                <p className="text-gray-400">Everything you need to master business growth</p>
              </div>

              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl md:text-6xl font-bold text-white">$100</span>
                  <span className="text-xl text-gray-400">/month</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Cancel anytime. No hidden fees.</p>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  'All 19 video modules',
                  'Lifetime access to content',
                  'Certificate of completion',
                  'CRM templates & resources',
                  'Pipeline frameworks',
                  'Client avatar worksheets',
                  'Private community access',
                  'Monthly Q&A sessions',
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <Button asChild size="lg" className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white py-6 text-lg rounded-xl shadow-lg shadow-violet-500/25">
                <Link href="/sign-in" className="flex items-center justify-center gap-2">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>

              <p className="text-center text-gray-500 text-sm mt-4">
                Join 500+ students already enrolled
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-slate-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-amber-400 font-medium mb-4 block">SUCCESS STORIES</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              What Our Students
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent"> Say</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Marcus Johnson',
                role: 'Business Owner',
                content: 'The CRM and pipeline modules completely transformed how I manage my business. I\'ve doubled my close rate in just 3 months!',
                rating: 5
              },
              {
                name: 'Jennifer Martinez',
                role: 'Sales Consultant',
                content: 'Understanding the value ladder and positioning strategies gave me so much more confidence. My revenue has increased by 40%.',
                rating: 5
              },
              {
                name: 'David Thompson',
                role: 'Agency Owner',
                content: 'The client avatar module alone was worth the entire investment. I finally know exactly who I\'m targeting and how to reach them.',
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

      {/* FAQ Section */}
      <section className="py-24 bg-slate-950">
        <div className="container mx-auto px-6 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-green-400 font-medium mb-4 block">FAQ</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Common
              <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent"> Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {[
              { q: 'How long do I have access to the course?', a: 'You have lifetime access to all course materials once you\'re enrolled. Learn at your own pace!' },
              { q: 'Is there a money-back guarantee?', a: 'Yes! We offer a 30-day money-back guarantee. If you\'re not satisfied, we\'ll refund your payment.' },
              { q: 'Can I cancel my subscription anytime?', a: 'Absolutely. You can cancel anytime from your dashboard. No questions asked.' },
              { q: 'Do I get a certificate?', a: 'Yes, upon completing all 19 modules, you\'ll receive a verified certificate of completion.' },
              { q: 'What if I need help during the course?', a: 'You\'ll have access to our private community and monthly Q&A sessions with instructors.' },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-800/30 border border-white/5 rounded-xl p-6"
              >
                <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
                <p className="text-gray-400">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
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
              Ready to Scale Your Business?
            </h2>
            <p className="text-xl text-white/80 mb-4">
              Join 500+ students who are already transforming their businesses with our proven strategies.
            </p>
            <p className="text-2xl font-bold text-white mb-10">
              Only $100/month - Cancel Anytime
            </p>
            <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-gray-100 px-10 py-6 text-lg rounded-xl shadow-lg font-semibold">
              <Link href="/sign-in" className="flex items-center gap-2 text-slate-900">
                Get Instant Access
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-950 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                Liquida Academy
              </h3>
              <p className="text-gray-500 text-sm">
                Master the art of business growth.
              </p>
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms</Link>
              <Link href="#" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Liquida Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
