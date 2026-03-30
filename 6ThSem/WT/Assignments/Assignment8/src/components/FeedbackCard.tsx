import React from 'react';
import { Star, Trash2, Clock } from 'lucide-react';
import { Feedback } from '../types';

interface FeedbackCardProps {
  feedback: Feedback;
  onDelete: (id: string) => void;
  isNew?: boolean;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback, onDelete, isNew }) => {
  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  };

  return (
    <div
      className={`bg-white border rounded-lg p-6 transition-all ${
        isNew ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{feedback.studentName}</h3>
          <p className="text-sm text-gray-600 mt-1">{feedback.courseName}</p>
        </div>
        <button
          onClick={() => onDelete(feedback.id)}
          className="text-gray-400 hover:text-red-600 transition-colors p-1"
          title="Delete feedback"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={`${i < feedback.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>

      {/* Feedback Text */}
      <p className="text-gray-700 mb-6">{feedback.feedbackText}</p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Clock size={12} />
          {formatDate(feedback.timestamp)}
        </div>
        <div className="font-mono text-gray-400">
          {feedback.email}
        </div>
      </div>
    </div>
  );
};

export default FeedbackCard;
