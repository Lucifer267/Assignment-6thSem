import React from 'react';
import { Feedback, SortOption } from '../types';
import FeedbackCard from './FeedbackCard';

interface FeedbackListProps {
  feedbacks: Feedback[];
  onDelete: (id: string) => void;
  onSortChange: (sort: SortOption) => void;
  currentSort: SortOption;
  newFeedbackId?: string | null;
}

const FeedbackList: React.FC<FeedbackListProps> = ({
  feedbacks,
  onDelete,
  onSortChange,
  currentSort,
  newFeedbackId,
}) => {
  if (feedbacks.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-gray-500 font-medium">No feedback entries yet. Be the first to submit!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <h3 className="text-lg font-semibold">All Feedback ({feedbacks.length})</h3>

        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm font-medium text-gray-600">
            Sort by:
          </label>
          <select
            id="sort"
            value={currentSort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="latest">Latest First</option>
            <option value="highest-rated">Highest Rated</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {feedbacks.map((feedback) => (
          <FeedbackCard
            key={feedback.id}
            feedback={feedback}
            onDelete={onDelete}
            isNew={feedback.id === newFeedbackId}
          />
        ))}
      </div>
    </div>
  );
};

export default FeedbackList;
