import React, { useState } from 'react';
import { Star, Trash2, Clock, Pencil, Check, X } from 'lucide-react';
import { Feedback } from '../types';

interface FeedbackCardProps {
  feedback: Feedback;
  onDelete: (id: string) => void;
  onUpdateUser: (id: string, studentName: string, email: string) => void;
  isNew?: boolean;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback, onDelete, onUpdateUser, isNew }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(feedback.studentName);
  const [draftEmail, setDraftEmail] = useState(feedback.email);
  const [editError, setEditError] = useState('');

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  };

  const startEdit = () => {
    setDraftName(feedback.studentName);
    setDraftEmail(feedback.email);
    setEditError('');
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setDraftName(feedback.studentName);
    setDraftEmail(feedback.email);
    setEditError('');
  };

  const saveEdit = () => {
    const trimmedName = draftName.trim();
    const trimmedEmail = draftEmail.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (trimmedName.length < 3) {
      setEditError('Name must be at least 3 characters.');
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      setEditError('Please enter a valid email address.');
      return;
    }

    onUpdateUser(feedback.id, trimmedName, trimmedEmail);
    setIsEditing(false);
    setEditError('');
  };

  return (
    <div
      className={`elevated-panel rounded-2xl p-6 transition-all duration-300 ${
        isNew ? 'border-teal-700 ring-2 ring-teal-100' : 'hover:-translate-y-0.5'
      }`}
    >
      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-[#d8d2c8] bg-[#f8f4ec] p-2">
        <span className="text-[11px] uppercase tracking-[0.1em] font-semibold text-slate-600 px-2">Admin Controls</span>
        {isEditing ? (
          <>
            <button
              onClick={saveEdit}
              className="inline-flex items-center gap-1 rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-800 transition-colors"
              title="Save user details"
            >
              <Check size={14} />
              Save Changes
            </button>
            <button
              onClick={cancelEdit}
              className="inline-flex items-center gap-1 rounded-lg border border-[#d8d2c8] bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              title="Cancel editing"
            >
              <X size={14} />
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={startEdit}
            className="inline-flex items-center gap-1 rounded-lg border border-teal-700 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800 hover:bg-teal-100 transition-colors"
            title="Edit user name and email"
          >
            <Pencil size={14} />
            Edit Name / Email
          </button>
        )}
        <button
          onClick={() => onDelete(feedback.id)}
          className="inline-flex items-center gap-1 rounded-lg border border-amber-700/40 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition-colors"
          title="Delete feedback"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>

      <div className="flex justify-between items-start mb-4">
        <div>
          {isEditing ? (
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Student Name</label>
              <input
                type="text"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                className="w-full max-w-[240px] px-3 py-1.5 border border-[#d8d2c8] rounded-lg bg-[#fffdfa] text-slate-900 text-sm font-medium outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600"
              />
            </div>
          ) : (
            <h3 className="font-semibold text-slate-900">{feedback.studentName}</h3>
          )}
          <p className="text-xs text-teal-800 font-semibold tracking-wide mt-1 uppercase">{feedback.degreeProgram}</p>
          <p className="text-sm text-slate-700 mt-1">{feedback.courseName}</p>
          <p className="text-xs text-slate-500 mt-1">{feedback.professorName}</p>
        </div>
        <div />
      </div>

      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={17}
            className={`${i < feedback.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-300'}`}
          />
        ))}
      </div>

      {/* Feedback Text */}
      <p className="text-slate-700 mb-6 leading-relaxed">{feedback.feedbackText}</p>

      {/* Footer */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-[#ece5d9] text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <Clock size={12} />
          {formatDate(feedback.timestamp)}
        </div>
        {isEditing ? (
          <div className="w-full sm:w-[240px] space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Email</label>
            <input
              type="email"
              value={draftEmail}
              onChange={(e) => setDraftEmail(e.target.value)}
              className="w-full px-3 py-1.5 border border-[#d8d2c8] rounded-lg bg-[#fffdfa] text-slate-700 text-xs font-mono outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600"
            />
          </div>
        ) : (
          <div className="font-mono text-slate-400">
            {feedback.email}
          </div>
        )}
      </div>
      {isEditing && editError && (
        <p className="mt-3 text-xs text-amber-800">{editError}</p>
      )}
    </div>
  );
};

export default FeedbackCard;
