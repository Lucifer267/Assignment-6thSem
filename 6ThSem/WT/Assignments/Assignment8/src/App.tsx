import { useState, useEffect, useRef, useMemo } from 'react';
import FeedbackForm from './components/FeedbackForm';
import FeedbackList from './components/FeedbackList';
import { Feedback, SortOption } from './types';

const DEGREE_COURSE_CATALOG = {
  'Computer Engineering': [
    { courseName: 'Data Structures and Algorithms', professorName: 'Prof. Aarav Sharma' },
    { courseName: 'Operating Systems', professorName: 'Prof. Neha Kulkarni' },
    { courseName: 'Computer Networks', professorName: 'Prof. Rohan Mehta' },
    { courseName: 'Database Management Systems', professorName: 'Prof. Priya Nair' },
  ],
  Law: [
    { courseName: 'Constitutional Law', professorName: 'Prof. Ananya Deshmukh' },
    { courseName: 'Criminal Law', professorName: 'Prof. Vivek Rao' },
    { courseName: 'Contract Law', professorName: 'Prof. Kavya Menon' },
    { courseName: 'Jurisprudence', professorName: 'Prof. Siddharth Jain' },
  ],
  Medicine: [
    { courseName: 'Anatomy', professorName: 'Dr. Meera Iyer' },
    { courseName: 'Physiology', professorName: 'Dr. Arjun Malhotra' },
    { courseName: 'Pharmacology', professorName: 'Dr. Nisha Bansal' },
    { courseName: 'Pathology', professorName: 'Dr. Kunal Verma' },
  ],
  'Mechanical Engineering': [
    { courseName: 'Thermodynamics', professorName: 'Prof. Aditya Patil' },
    { courseName: 'Fluid Mechanics', professorName: 'Prof. Sneha Reddy' },
    { courseName: 'Machine Design', professorName: 'Prof. Harsh Vora' },
    { courseName: 'Manufacturing Processes', professorName: 'Prof. Deepa Krishnan' },
  ],
  'Civil Engineering': [
    { courseName: 'Structural Analysis', professorName: 'Prof. Ishita Ghosh' },
    { courseName: 'Geotechnical Engineering', professorName: 'Prof. Manav Arora' },
    { courseName: 'Transportation Engineering', professorName: 'Prof. Tanya Kapoor' },
    { courseName: 'Construction Management', professorName: 'Prof. Rahul Batra' },
  ],
  'Business Administration': [
    { courseName: 'Financial Accounting', professorName: 'Prof. Ritu Agarwal' },
    { courseName: 'Marketing Management', professorName: 'Prof. Nitin Sethi' },
    { courseName: 'Business Analytics', professorName: 'Prof. Pooja Sinha' },
    { courseName: 'Organizational Behavior', professorName: 'Prof. Akash Chawla' },
  ],
  Psychology: [
    { courseName: 'Cognitive Psychology', professorName: 'Prof. Rhea Thomas' },
    { courseName: 'Developmental Psychology', professorName: 'Prof. Amanpreet Kaur' },
    { courseName: 'Abnormal Psychology', professorName: 'Prof. Farhan Ali' },
    { courseName: 'Counseling Psychology', professorName: 'Prof. Diya Fernandes' },
  ],
} as const;

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
        const parsed = JSON.parse(saved) as Partial<Feedback>[];
        const migrated = parsed.map((item) => ({
          ...item,
          degreeProgram: item.degreeProgram || 'Not specified',
          professorName: item.professorName || 'Not specified',
        })) as Feedback[];
        setFeedbacks(migrated);
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

  const handleUpdateFeedbackUser = (id: string, studentName: string, email: string) => {
    setFeedbacks((prev) => {
      const target = prev.find((item) => item.id === id);
      if (!target) return prev;

      // Propagate identity corrections to all entries from the same user email.
      return prev.map((item) => (
        item.id === id || item.email === target.email
          ? { ...item, studentName, email }
          : item
      ));
    });
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

  const averageRating = feedbacks.length
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : '-';

  const coursesReviewed = feedbacks.length
    ? [...new Set(feedbacks.map(f => f.courseName))].length
    : '-';

  return (
    <div className="min-h-screen text-slate-800">
      <header className="sticky top-0 z-10 backdrop-blur-sm border-b border-[#d8d2c8] bg-[#f1eee8]/90">
        <div className="max-w-6xl mx-auto px-5 py-5 sm:px-6">
          <p className="text-xs tracking-[0.18em] uppercase text-teal-800 font-semibold">Academic Quality Office</p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="font-editorial text-3xl sm:text-4xl text-slate-900">Teaching Feedback Portal</h1>
            <p className="text-sm text-slate-600 max-w-md">
              Structured student feedback for course delivery, faculty communication, and learning outcomes.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-10 sm:px-6 sm:py-12">
        <section className="fade-rise">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
            <div className="elevated-panel rounded-2xl p-5 lg:p-6">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500 mb-3">Submissions Logged</p>
              <p className="font-editorial text-4xl text-teal-800">{feedbacks.length}</p>
              <p className="text-sm text-slate-600 mt-3">Responses currently retained in this browser session.</p>
            </div>
            <div className="elevated-panel rounded-2xl p-5 lg:p-6">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500 mb-3">Average Course Rating</p>
              <p className="font-editorial text-4xl text-teal-800">{averageRating}</p>
              <p className="text-sm text-slate-600 mt-3">Calculated from all submitted course evaluations.</p>
            </div>
            <div className="elevated-panel rounded-2xl p-5 lg:p-6">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500 mb-3">Courses Reviewed</p>
              <p className="font-editorial text-4xl text-teal-800">{coursesReviewed}</p>
              <p className="text-sm text-slate-600 mt-3">Unique courses with at least one student response.</p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-14 items-start">
          <aside className="lg:col-span-4 space-y-4">
            <div className="soft-panel rounded-2xl p-6 fade-rise">
              <h2 className="font-editorial text-2xl text-slate-900 mb-2">Submit Formal Feedback</h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                Use this form to provide constructive feedback on course quality. Entries should be specific and respectful to support actionable review.
              </p>
            </div>
            <div className="elevated-panel rounded-2xl p-6 fade-rise">
              <h3 className="text-base font-semibold text-slate-900 mb-4">Review Workflow</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-teal-50 text-teal-800 font-semibold text-sm border border-teal-200">1</span>
                  <div>
                    <p className="font-medium text-slate-900">Identify Course Context</p>
                    <p className="text-sm text-slate-600">Select your degree program and the specific course.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-teal-50 text-teal-800 font-semibold text-sm border border-teal-200">2</span>
                  <div>
                    <p className="font-medium text-slate-900">Rate Learning Experience</p>
                    <p className="text-sm text-slate-600">Assign a rating aligned with your classroom experience.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-teal-50 text-teal-800 font-semibold text-sm border border-teal-200">3</span>
                  <div>
                    <p className="font-medium text-slate-900">Document Observations</p>
                    <p className="text-sm text-slate-600">Share strengths and improvements with clear examples.</p>
                  </div>
                </li>
              </ul>
            </div>
          </aside>

          <div className="lg:col-span-8 fade-rise">
            <FeedbackForm onSubmit={handleAddFeedback} degreeCatalog={DEGREE_COURSE_CATALOG} />
          </div>
        </section>

        <section ref={listRef} className="fade-rise">
          <div className="mb-6">
            <h2 className="font-editorial text-3xl text-slate-900">Feedback Records</h2>
            <p className="text-sm text-slate-600 mt-2">Recent submissions and highly rated experiences are shown below.</p>
          </div>
          <FeedbackList
            feedbacks={sortedFeedbacks}
            onDelete={handleDeleteFeedback}
            onUpdateUser={handleUpdateFeedbackUser}
            onSortChange={setSortOption}
            currentSort={sortOption}
            newFeedbackId={newFeedbackId}
          />
        </section>
      </main>

      <footer className="border-t border-[#d8d2c8] mt-16 bg-[#fffaf0]/80">
        <div className="max-w-6xl mx-auto px-5 py-6 sm:px-6">
          <p className="text-sm text-slate-600">
            Internal quality feedback interface. Entries are stored locally on this browser.
          </p>
        </div>
      </footer>
    </div>
  );
}
