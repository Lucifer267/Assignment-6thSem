import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Building2, Clock, Sparkles, Search, Filter, Briefcase } from 'lucide-react';

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

export default function JobList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs?active_only=true');
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
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
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  const locations = [...new Set(jobs.map(j => j.location))];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse shadow-sm border border-slate-200">
              <div className="h-6 bg-slate-100 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-slate-100 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-slate-100 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
          Find Your <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">Dream Job</span>
        </h1>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Discover opportunities from top companies. Your next career move starts here.
        </p>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white backdrop-blur-sm rounded-2xl p-4 mb-8 border border-slate-200 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search jobs or companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>
          <div className="relative sm:w-64">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 appearance-none focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer"
            >
              <option value="">All Locations</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-2 mb-6 text-slate-600"
      >
        <Briefcase className="w-4 h-4" />
        <span className="text-sm">
          {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} available
        </span>
      </motion.div>

      {/* Job Cards */}
      <div className="grid gap-4">
        {filteredJobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <Link
              to={`/jobs/${job.slug}`}
              className="block bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-200 hover:bg-slate-50 transition-all group shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                      {job.job_title}
                    </h2>
                    {isNew(job.posted_date) && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-full border border-emerald-100">
                        <Sparkles className="w-3 h-3" />
                        New
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-3">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-slate-500" />
                      {job.company_name}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      {job.location}
                    </span>
                  </div>
                  
                  <p className="text-slate-500 text-sm line-clamp-2">
                    {job.description}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-slate-500 sm:text-right">
                  <Clock className="w-4 h-4" />
                  {formatDate(job.posted_date)}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-slate-700" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No jobs found</h3>
            <p className="text-slate-600">Try adjusting your search or filters</p>
        </motion.div>
      )}
    </div>
  );
}
