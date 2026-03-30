import { useState, useEffect, useRef, useMemo } from 'react';
import FeedbackForm from './components/FeedbackForm';
import FeedbackList from './components/FeedbackList';
import { Feedback, SortOption } from './types';

export default function App() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('latest');
  const [newFeedbackId, setNewFeedbackId] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('student_feedback');
    if (saved) {
      try {
        setFeedbacks(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved feedback', e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('student_feedback', JSON.stringify(feedbacks));
  }, [feedbacks]);

  const handleAddFeedback = (data: Omit<Feedback, 'id' | 'timestamp'>) => {
    const newFeedback: Feedback = {
      ...data,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    setFeedbacks(prev => [newFeedback, ...prev]);
    setNewFeedbackId(newFeedback.id);

    // Clear "new" highlight after 3 seconds
    setTimeout(() => setNewFeedbackId(null), 3000);

    // Scroll to list
    setTimeout(() => {
      listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleDeleteFeedback = (id: string) => {
    setFeedbacks(prev => prev.filter(f => f.id !== id));
  };

  const sortedFeedbacks = useMemo(() => {
    const sorted = [...feedbacks];
    if (sortOption === 'latest') {
      return sorted.sort((a, b) => b.timestamp - a.timestamp);
    } else if (sortOption === 'highest-rated') {
      return sorted.sort((a, b) => b.rating - a.rating || b.timestamp - a.timestamp);
    }
    return sorted;
  }, [feedbacks, sortOption]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-semibold">Course Feedback System</h1>
          <p className="text-sm text-gray-600 mt-1">Collect and manage course feedback</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Introduction Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">Submit Your Feedback</h2>
          <p className="text-gray-600 mb-8 max-w-2xl">
            Help us improve our courses by sharing your honest feedback. Your input helps us understand what's working well and what needs improvement.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="text-2xl font-bold text-blue-600 mb-2">{feedbacks.length}</div>
              <div className="text-gray-600">Total Feedback Entries</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {feedbacks.length > 0 
                  ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
                  : '-'
                }
              </div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {feedbacks.length > 0 
                  ? [...new Set(feedbacks.map(f => f.courseName))].length
                  : '-'
                }
              </div>
              <div className="text-gray-600">Courses Reviewed</div>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-6">How to Submit</h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded font-semibold text-sm">1</span>
                <div>
                  <p className="font-medium">Enter Your Info</p>
                  <p className="text-sm text-gray-600">Provide your name and email</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded font-semibold text-sm">2</span>
                <div>
                  <p className="font-medium">Select Course</p>
                  <p className="text-sm text-gray-600">Choose the course to review</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded font-semibold text-sm">3</span>
                <div>
                  <p className="font-medium">Rate & Review</p>
                  <p className="text-sm text-gray-600">Give a rating and write your feedback</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <FeedbackForm onSubmit={handleAddFeedback} />
          </div>
        </section>

        {/* List Section */}
        <section ref={listRef}>
          <h2 className="text-2xl font-bold mb-8">Feedback Entries</h2>
          <FeedbackList
            feedbacks={sortedFeedbacks}
            onDelete={handleDeleteFeedback}
            onSortChange={setSortOption}
            currentSort={sortOption}
            newFeedbackId={newFeedbackId}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-20">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <p className="text-sm text-gray-600">
            © 2026 Course Feedback System. All feedback is stored locally in your browser.
          </p>
        </div>
      </footer>
    </div>
  );
}
