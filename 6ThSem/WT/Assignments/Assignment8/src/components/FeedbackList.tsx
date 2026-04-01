import React from 'react';
import { Feedback, SortOption } from '../types';
import FeedbackCard from './FeedbackCard';

interface FeedbackListProps {
  feedbacks: Feedback[];
  onDelete: (id: string) => void;
  onUpdateUser: (id: string, studentName: string, email: string) => void;
  onSortChange: (sort: SortOption) => void;
  currentSort: SortOption;
  newFeedbackId?: string | null;
}

const FeedbackList: React.FC<FeedbackListProps> = ({
  feedbacks,
  onDelete,
  onUpdateUser,
  onSortChange,
  currentSort,
  newFeedbackId,
}) => {
  if (feedbacks.length === 0) {
    return (
      <div className="text-center py-16 soft-panel rounded-2xl">
        <p className="font-medium text-slate-700">No submissions yet. Your feedback will appear here once submitted.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#d8d2c8] pb-4">
        <h3 className="text-lg font-semibold text-slate-900">All Records ({feedbacks.length})</h3>

        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm font-medium text-slate-600">
            Sort by:
          </label>
          <select
            id="sort"
            value={currentSort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="px-3 py-2 border border-[#d8d2c8] rounded-xl text-sm bg-[#fffdfa] focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 outline-none"
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
            onUpdateUser={onUpdateUser}
            isNew={feedback.id === newFeedbackId}
          />
        ))}
      </div>
    </div>
  );
};

export default FeedbackList;
