import React, { useState, useEffect, useRef } from 'react';
import { Feedback } from '../types';

interface FeedbackFormProps {
  onSubmit: (feedback: Omit<Feedback, 'id' | 'timestamp'>) => void;
  degreeCatalog: Record<string, ReadonlyArray<{ courseName: string; professorName: string }>>;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmit, degreeCatalog }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    degreeProgram: '',
    courseName: '',
    professorName: '',
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
      case 'degreeProgram':
        if (!value.trim()) error = 'Degree is required.';
        break;
      case 'courseName':
        if (!value.trim()) error = 'Course name is required.';
        break;
      case 'professorName':
        if (!value.trim()) error = 'Professor is required.';
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
    let nextProfessorName = formData.professorName;

    if (name === 'degreeProgram') {
      nextProfessorName = '';
      setFormData((prev) => ({
        ...prev,
        degreeProgram: value,
        courseName: '',
        professorName: '',
      }));
    } else if (name === 'courseName') {
      const selectedCourse = formData.degreeProgram
        ? degreeCatalog[formData.degreeProgram]?.find((course) => course.courseName === value)
        : undefined;
      nextProfessorName = selectedCourse?.professorName || '';

      setFormData((prev) => ({
        ...prev,
        courseName: value,
        professorName: nextProfessorName,
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: val }));
    }

    if (isTouched[name]) {
      const error = validate(name, val);
      setErrors(prev => ({ ...prev, [name]: error }));
    }

    if (name === 'degreeProgram' || name === 'courseName') {
      const dependentFields = name === 'degreeProgram' ? ['courseName', 'professorName'] : ['professorName'];
      dependentFields.forEach((field) => {
        if (isTouched[field]) {
          const dependencyValue = field === 'professorName'
            ? nextProfessorName
            : '';
          const dependencyError = validate(field, dependencyValue);
          setErrors((prev) => ({ ...prev, [field]: dependencyError }));
        }
      });
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
        degreeProgram: '',
        courseName: '',
        professorName: '',
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
  const degreeOptions = Object.keys(degreeCatalog);
  const courseOptions = formData.degreeProgram ? degreeCatalog[formData.degreeProgram] || [] : [];

  return (
    <form onSubmit={handleSubmit} className="elevated-panel rounded-2xl p-6 sm:p-8 space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.12em] text-slate-500 mb-2">Student Submission Form</p>
        <h2 className="font-editorial text-3xl text-slate-900 mb-2">Course Evaluation Entry</h2>
        <p className="text-sm text-slate-600">All fields marked with * are required for a valid submission.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="studentName" className="block text-sm font-semibold text-slate-700 mb-2">
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
            className={`w-full px-4 py-2.5 border rounded-xl bg-[#fffdfa] focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 outline-none transition ${
              errors.studentName ? 'border-amber-700' : 'border-[#d8d2c8]'
            }`}
          />
          {errors.studentName && <p className="mt-1 text-sm text-amber-800">{errors.studentName}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-2.5 border rounded-xl bg-[#fffdfa] focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 outline-none transition ${
              errors.email ? 'border-amber-700' : 'border-[#d8d2c8]'
            }`}
          />
          {errors.email && <p className="mt-1 text-sm text-amber-800">{errors.email}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="degreeProgram" className="block text-sm font-semibold text-slate-700 mb-2">
            Degree Program *
          </label>
          <select
            id="degreeProgram"
            name="degreeProgram"
            value={formData.degreeProgram}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-2.5 border rounded-xl bg-[#fffdfa] focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 outline-none transition ${
              errors.degreeProgram ? 'border-amber-700' : 'border-[#d8d2c8]'
            }`}
          >
            <option value="">Select your degree</option>
            {degreeOptions.map((degree) => (
              <option key={degree} value={degree}>
                {degree}
              </option>
            ))}
          </select>
          {errors.degreeProgram && <p className="mt-1 text-sm text-amber-800">{errors.degreeProgram}</p>}
        </div>

        <div>
          <label htmlFor="courseName" className="block text-sm font-semibold text-slate-700 mb-2">
            Course Name *
          </label>
          <select
            id="courseName"
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={!formData.degreeProgram}
            className={`w-full px-4 py-2.5 border rounded-xl bg-[#fffdfa] focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 outline-none transition disabled:bg-slate-100 disabled:text-slate-500 ${
              errors.courseName ? 'border-amber-700' : 'border-[#d8d2c8]'
            }`}
          >
            <option value="">{formData.degreeProgram ? 'Select a course' : 'Select degree first'}</option>
            {courseOptions.map((course) => (
              <option key={course.courseName} value={course.courseName}>
                {course.courseName}
              </option>
            ))}
          </select>
          {errors.courseName && <p className="mt-1 text-sm text-amber-800">{errors.courseName}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="professorName" className="block text-sm font-semibold text-slate-700 mb-2">
            Professor *
          </label>
          <input
            type="text"
            id="professorName"
            name="professorName"
            value={formData.professorName}
            onBlur={handleBlur}
            readOnly
            placeholder="Professor will be auto-filled"
            className={`w-full px-4 py-2.5 border rounded-xl bg-[#f4efe6] focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 outline-none transition ${
              errors.professorName ? 'border-amber-700' : 'border-[#d8d2c8]'
            }`}
          />
          {errors.professorName && <p className="mt-1 text-sm text-amber-800">{errors.professorName}</p>}
        </div>

        <div>
          <label htmlFor="rating" className="block text-sm font-semibold text-slate-700 mb-2">
            Rating *
          </label>
          <select
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-[#d8d2c8] rounded-xl bg-[#fffdfa] focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 outline-none transition"
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
        <label htmlFor="feedbackText" className="block text-sm font-semibold text-slate-700 mb-2">
          Your Feedback *
        </label>
        <textarea
          id="feedbackText"
          name="feedbackText"
          rows={4}
          value={formData.feedbackText}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Describe what helped your learning and what should be improved next term."
          className={`w-full px-4 py-2.5 border rounded-xl bg-[#fffdfa] focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 outline-none transition resize-none ${
            errors.feedbackText ? 'border-amber-700' : 'border-[#d8d2c8]'
          }`}
        />
        {errors.feedbackText && <p className="mt-1 text-sm text-amber-800">{errors.feedbackText}</p>}
      </div>

      <button
        type="submit"
        disabled={!isValid}
        className={`w-full py-3 px-4 font-semibold rounded-xl transition ${
          isValid
            ? 'bg-teal-700 text-white hover:bg-teal-800 active:bg-teal-900 shadow-sm'
            : 'bg-slate-200 text-slate-500 cursor-not-allowed'
        }`}
      >
        Submit Evaluation
      </button>
    </form>
  );
};

export default FeedbackForm;
