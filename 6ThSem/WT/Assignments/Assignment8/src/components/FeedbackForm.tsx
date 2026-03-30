import React, { useState, useEffect, useRef } from 'react';
import { Feedback } from '../types';

interface FeedbackFormProps {
  onSubmit: (feedback: Omit<Feedback, 'id' | 'timestamp'>) => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    courseName: '',
    rating: 5,
    feedbackText: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isTouched, setIsTouched] = useState<Record<string, boolean>>({});

  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const validate = (name: string, value: any) => {
    let error = '';
    switch (name) {
      case 'studentName':
        if (!value.trim()) error = 'Name is required.';
        else if (value.trim().length < 3) error = 'Name must be at least 3 characters.';
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) error = 'Email is required.';
        else if (!emailRegex.test(value)) error = 'Please enter a valid email address.';
        break;
      case 'courseName':
        if (!value.trim()) error = 'Course name is required.';
        break;
      case 'feedbackText':
        if (!value.trim()) error = 'Feedback is required.';
        else if (value.trim().length < 10) error = 'Feedback must be at least 10 characters.';
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const val = name === 'rating' ? parseInt(value) : value;

    setFormData(prev => ({ ...prev, [name]: val }));

    if (isTouched[name]) {
      const error = validate(name, val);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setIsTouched(prev => ({ ...prev, [name]: true }));
    const error = validate(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
      const error = validate(key, (formData as any)[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
      setFormData({
        studentName: '',
        email: '',
        courseName: '',
        rating: 5,
        feedbackText: '',
      });
      setIsTouched({});
      setErrors({});
      nameInputRef.current?.focus();
    } else {
      setErrors(newErrors);
      setIsTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    }
  };

  const isValid = Object.keys(formData).every(key => !validate(key, (formData as any)[key]));

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-8 space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Submit Feedback</h2>
        <p className="text-sm text-gray-600">Fill out the form below to submit your course feedback.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-2">
            Your Name *
          </label>
          <input
            ref={nameInputRef}
            type="text"
            id="studentName"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="John Doe"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
              errors.studentName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.studentName && <p className="mt-1 text-sm text-red-600">{errors.studentName}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="john@example.com"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-2">
            Course Name *
          </label>
          <input
            type="text"
            id="courseName"
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g., Introduction to React"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
              errors.courseName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.courseName && <p className="mt-1 text-sm text-red-600">{errors.courseName}</p>}
        </div>

        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
            Rating *
          </label>
          <select
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          >
            <option value={5}>5 - Excellent</option>
            <option value={4}>4 - Good</option>
            <option value={3}>3 - Average</option>
            <option value={2}>2 - Poor</option>
            <option value={1}>1 - Very Poor</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="feedbackText" className="block text-sm font-medium text-gray-700 mb-2">
          Your Feedback *
        </label>
        <textarea
          id="feedbackText"
          name="feedbackText"
          rows={4}
          value={formData.feedbackText}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Share your thoughts on this course. What did you like? What could be improved?"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none ${
            errors.feedbackText ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.feedbackText && <p className="mt-1 text-sm text-red-600">{errors.feedbackText}</p>}
      </div>

      <button
        type="submit"
        disabled={!isValid}
        className={`w-full py-2.5 px-4 font-medium rounded-lg transition ${
          isValid
            ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        Submit Feedback
      </button>
    </form>
  );
};

export default FeedbackForm;
