import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Building2, Clock, ArrowLeft, Sparkles, Share2, Bookmark, ExternalLink } from 'lucide-react';

interface Job {
  id: number;
  job_title: string;
  company_name: string;
  location: string;
  description: string;
  slug: string;
  posted_date: string;
  is_active: boolean;
}

export default function JobDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [slug]);

  const fetchJob = async () => {
    try {
      const res = await fetch(`/api/jobs?slug=${slug}`);
      const data = await res.json();
      setJob(data);
    } catch (err) {
      console.error('Failed to fetch job:', err);
    } finally {
      setLoading(false);
    }
  };

  const isNew = (dateStr: string) => {
    const posted = new Date(dateStr);
    const now = new Date();
    const hoursDiff = (now.getTime() - posted.getTime()) / (1000 * 60 * 60);
    return hoursDiff < 24;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error('Failed to copy');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-100 rounded w-1/4 mb-8"></div>
          <div className="h-12 bg-slate-100 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-slate-100 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-slate-100 rounded w-full"></div>
            <div className="h-4 bg-slate-100 rounded w-full"></div>
            <div className="h-4 bg-slate-100 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ExternalLink className="w-8 h-8 text-slate-700" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Job not found</h2>
        <p className="text-slate-600 mb-6">This job listing may have been removed or doesn't exist.</p>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-medium rounded-xl hover:bg-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Back Link */}
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to all jobs
        </Link>

        {/* Job Header */}
        <div className="bg-white backdrop-blur-sm rounded-2xl p-8 border border-slate-200 mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold text-slate-900">
                  {job.job_title}
                </h1>
                {isNew(job.posted_date) && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 text-sm font-medium rounded-full border border-emerald-100">
                    <Sparkles className="w-4 h-4" />
                    New
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-6 text-slate-600">
                <span className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-500" />
                  <span className="font-medium text-slate-900">{job.company_name}</span>
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-cyan-500" />
                  {job.location}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-slate-500" />
                  {formatDate(job.posted_date)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-3 bg-slate-50 rounded-xl text-slate-600 hover:text-white hover:bg-slate-100 transition-all relative"
                title="Share job"
              >
                <Share2 className="w-5 h-5" />
                {copied && (
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-emerald-500 text-white text-xs rounded whitespace-nowrap">
                    Copied!
                  </span>
                )}
              </button>
              <button
                className="p-3 bg-slate-50 rounded-xl text-slate-600 hover:text-white hover:bg-slate-100 transition-all"
                title="Save job"
              >
                <Bookmark className="w-5 h-5" />
              </button>
            </div>
          </div>

          <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40">
            Apply for this position
          </button>
        </div>

        {/* Job Description */}
        <div className="bg-white backdrop-blur-sm rounded-2xl p-8 border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Job Description</h2>
          <div className="prose max-w-none">
            <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
              {job.description}
            </div>
          </div>
        </div>

        {/* Company Info */}
        <div className="bg-white backdrop-blur-sm rounded-2xl p-8 border border-slate-200 mt-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">About {job.company_name}</h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl flex items-center justify-center text-2xl font-bold text-slate-900">
              {job.company_name.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-medium text-slate-900">{job.company_name}</h3>
              <p className="text-slate-600 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {job.location}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
