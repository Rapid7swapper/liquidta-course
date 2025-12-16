'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, ChevronRight, Award, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Quiz, QuizQuestion } from '@/lib/course-data'

interface ModuleQuizProps {
  quiz: Quiz
  onQuizComplete: (score: number, passed: boolean) => void
  onRetry?: () => void
}

export default function ModuleQuiz({ quiz, onQuizComplete, onRetry }: ModuleQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCurrentCorrect, setIsCurrentCorrect] = useState<boolean | null>(null)

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const totalQuestions = quiz.questions.length
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100

  const handleAnswerSelect = (optionIndex: number) => {
    if (showFeedback) return // Prevent changing answer after feedback

    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionIndex
    }))
  }

  const handleSubmitAnswer = () => {
    const isCorrect = selectedAnswers[currentQuestion.id] === currentQuestion.correctAnswer
    setIsCurrentCorrect(isCorrect)
    setShowFeedback(true)
  }

  const handleNextQuestion = () => {
    setShowFeedback(false)
    setIsCurrentCorrect(null)

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      // Calculate final score
      const correctAnswers = quiz.questions.filter(
        q => selectedAnswers[q.id] === q.correctAnswer
      ).length
      const score = Math.round((correctAnswers / totalQuestions) * 100)
      const passed = score >= quiz.passingScore

      setShowResults(true)
      onQuizComplete(score, passed)
    }
  }

  const handleRetry = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setShowResults(false)
    setShowFeedback(false)
    setIsCurrentCorrect(null)
    onRetry?.()
  }

  // Calculate score for results
  const correctAnswers = quiz.questions.filter(
    q => selectedAnswers[q.id] === q.correctAnswer
  ).length
  const finalScore = Math.round((correctAnswers / totalQuestions) * 100)
  const passed = finalScore >= quiz.passingScore

  if (showResults) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full"
      >
        <Card className="bg-slate-900/50 border-white/10">
          <CardContent className="pt-8 pb-8">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                  passed
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                    : 'bg-gradient-to-br from-red-500 to-rose-600'
                }`}
              >
                {passed ? (
                  <Award className="w-12 h-12 text-white" />
                ) : (
                  <XCircle className="w-12 h-12 text-white" />
                )}
              </motion.div>

              <h2 className="text-2xl font-bold text-white mb-2">
                {passed ? 'Congratulations!' : 'Keep Learning!'}
              </h2>
              <p className="text-gray-400 mb-6">
                {passed
                  ? 'You passed the quiz and can move to the next module.'
                  : 'You need to score at least ' + quiz.passingScore + '% to pass.'}
              </p>

              <div className="bg-slate-800/50 rounded-xl p-6 mb-6 max-w-sm mx-auto">
                <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  {finalScore}%
                </div>
                <p className="text-gray-400 text-sm">
                  {correctAnswers} of {totalQuestions} questions correct
                </p>
                <div className="mt-4">
                  <Progress
                    value={finalScore}
                    className={`h-2 ${passed ? 'bg-green-900/30' : 'bg-red-900/30'}`}
                  />
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                {!passed && (
                  <Button
                    onClick={handleRetry}
                    variant="outline"
                    className="border-white/10 hover:bg-white/10"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                )}
                {passed && (
                  <Button
                    onClick={() => onQuizComplete(finalScore, passed)}
                    className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500"
                  >
                    Continue to Next Module
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <span className="text-sm text-gray-400">{Math.round(progressPercentage)}%</span>
        </div>
        <Progress value={progressPercentage} className="h-2 bg-slate-700" />
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card className="bg-slate-900/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg">
                {currentQuestion.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswers[currentQuestion.id] === index
                  const isCorrectAnswer = index === currentQuestion.correctAnswer

                  let optionStyle = 'bg-slate-800/50 border-white/10 hover:border-violet-500/50'

                  if (showFeedback) {
                    if (isCorrectAnswer) {
                      optionStyle = 'bg-green-500/20 border-green-500/50'
                    } else if (isSelected && !isCorrectAnswer) {
                      optionStyle = 'bg-red-500/20 border-red-500/50'
                    }
                  } else if (isSelected) {
                    optionStyle = 'bg-violet-500/20 border-violet-500/50'
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showFeedback}
                      className={`w-full p-4 rounded-lg border text-left transition-all ${optionStyle} ${
                        showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            showFeedback && isCorrectAnswer
                              ? 'border-green-400 bg-green-500/20'
                              : showFeedback && isSelected && !isCorrectAnswer
                              ? 'border-red-400 bg-red-500/20'
                              : isSelected
                              ? 'border-violet-400 bg-violet-500/20'
                              : 'border-gray-500'
                          }`}
                        >
                          {showFeedback && isCorrectAnswer && (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          )}
                          {showFeedback && isSelected && !isCorrectAnswer && (
                            <XCircle className="w-4 h-4 text-red-400" />
                          )}
                          {!showFeedback && isSelected && (
                            <div className="w-2.5 h-2.5 rounded-full bg-violet-400" />
                          )}
                        </div>
                        <span
                          className={`${
                            showFeedback && isCorrectAnswer
                              ? 'text-green-300'
                              : showFeedback && isSelected && !isCorrectAnswer
                              ? 'text-red-300'
                              : 'text-white'
                          }`}
                        >
                          {option}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Feedback Message */}
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 p-4 rounded-lg ${
                    isCurrentCorrect
                      ? 'bg-green-500/20 border border-green-500/30'
                      : 'bg-red-500/20 border border-red-500/30'
                  }`}
                >
                  <p
                    className={`text-sm font-medium ${
                      isCurrentCorrect ? 'text-green-300' : 'text-red-300'
                    }`}
                  >
                    {isCurrentCorrect ? 'Correct!' : 'Incorrect.'}
                    {!isCurrentCorrect && (
                      <span className="text-gray-400 ml-1">
                        The correct answer was: {currentQuestion.options[currentQuestion.correctAnswer]}
                      </span>
                    )}
                  </p>
                </motion.div>
              )}

              {/* Action Button */}
              <div className="mt-6 flex justify-end">
                {!showFeedback ? (
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={selectedAnswers[currentQuestion.id] === undefined}
                    className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 disabled:opacity-50"
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextQuestion}
                    className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500"
                  >
                    {currentQuestionIndex < totalQuestions - 1 ? (
                      <>
                        Next Question
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      'See Results'
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
