import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { resourcesAPI, quizAPI } from '../services/api';

const Quiz = () => {
  const { resourceId } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [resource, setResource] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [results, setResults] = useState(null);

  const fetchQuizData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await resourcesAPI.getById(resourceId);
      setResource(response.resource);
      setQuizzes(response.quizzes || []);
      
      if (response.quizzes && response.quizzes.length > 0) {
        // Initialize answers array with null values
        setAnswers(new Array(response.quizzes.length).fill(null));
      } else {
        setError('No quiz questions available for this resource.');
      }
      
    } catch (error) {
      console.error('Error fetching quiz data:', error);
      setError('Failed to load quiz. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [resourceId]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchQuizData();
  }, [resourceId, isAuthenticated, navigate, fetchQuizData]);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    
    // Update answers array
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizzes.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1]);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1]);
    }
  };

  const submitQuiz = async () => {
    // Check if all questions are answered
    const unanswered = answers.some(answer => answer === null);
    if (unanswered) {
      setError('Please answer all questions before submitting.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await quizAPI.submit(parseInt(resourceId), answers);
      setResults(response);
      setQuizCompleted(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setError('Failed to submit quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score) => {
    if (score >= 90) return { emoji: '🌟', title: 'Excellent!' };
    if (score >= 70) return { emoji: '✅', title: 'Well Done!' };
    if (score >= 50) return { emoji: '📚', title: 'Keep Learning!' };
    return { emoji: '💪', title: 'Try Again!' };
  };

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !quizzes.length) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz Unavailable</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link
            to={`/resources/${resourceId}`}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Resource
          </Link>
        </div>
      </div>
    );
  }

  if (quizCompleted && results) {
    const badge = getScoreBadge(results.score);
    
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-6">{badge.emoji}</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{badge.title}</h1>
          <p className="text-lg text-gray-600 mb-8">You've completed the quiz for "{resource?.title}"</p>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className={`text-3xl font-bold mb-2 ${getScoreColor(results.score)}`}>
                  {Math.round(results.score)}%
                </div>
                <div className="text-gray-600">Final Score</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {results.correct_answers}
                </div>
                <div className="text-gray-600">Correct Answers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {results.total_questions}
                </div>
                <div className="text-gray-600">Total Questions</div>
              </div>
            </div>
          </div>

          {results.passed ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center mb-4">
                <span className="text-2xl mr-2">🎉</span>
                <span className="text-lg font-semibold text-green-800">
                  Congratulations! You passed the quiz!
                </span>
              </div>
              <p className="text-green-600">
                You've demonstrated strong knowledge of emergency preparedness. Your progress has been saved.
              </p>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center mb-4">
                <span className="text-2xl mr-2">📚</span>
                <span className="text-lg font-semibold text-yellow-800">
                  Keep studying to improve your score!
                </span>
              </div>
              <p className="text-yellow-600">
                Review the resource material and try again. You need 70% or higher to pass.
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={`/resources/${resourceId}`}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Resource
            </Link>
            <Link
              to="/profile"
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
            >
              View Your Progress
            </Link>
            <Link
              to="/resources"
              className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors"
            >
              Browse More Resources
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentQuiz = quizzes[currentQuestion];
  const progress = ((currentQuestion + 1) / quizzes.length) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <Link
            to={`/resources/${resourceId}`}
            className="text-blue-600 hover:text-blue-700"
          >
            ← Back to Resource
          </Link>
          <div className="text-sm text-gray-500">
            Question {currentQuestion + 1} of {quizzes.length}
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          🧠 Knowledge Quiz: {resource?.title}
        </h1>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-sm text-gray-600 mt-2">
          {Math.round(progress)}% complete
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Question Card */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {currentQuiz?.question}
        </h2>

        <div className="space-y-4">
          {currentQuiz?.options?.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                selectedAnswer === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                  selectedAnswer === index
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {selectedAnswer === index && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <span className="font-medium mr-3 text-gray-700">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="text-gray-900">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestion === 0}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← Previous
        </button>

        <div className="flex space-x-2">
          {quizzes.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentQuestion(index);
                setSelectedAnswer(answers[index]);
              }}
              className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                index === currentQuestion
                  ? 'bg-blue-600 text-white'
                  : answers[index] !== null
                  ? 'bg-green-200 text-green-800'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestion === quizzes.length - 1 ? (
          <button
            onClick={submitQuiz}
            disabled={submitting || selectedAnswer === null}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        )}
      </div>

      {/* Quiz Info */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Quiz Instructions</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>• Select the best answer for each question</li>
          <li>• You can navigate between questions using the Previous/Next buttons</li>
          <li>• You need 70% or higher to pass the quiz</li>
          <li>• Your progress will be saved automatically when you complete the quiz</li>
        </ul>
      </div>
    </div>
  );
};

export default Quiz;
