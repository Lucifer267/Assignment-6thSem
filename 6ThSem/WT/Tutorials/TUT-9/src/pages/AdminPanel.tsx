import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Eye, EyeOff, Save, X, Briefcase } from 'lucide-react';

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

interface JobForm {
  job_title: string;
  company_name: string;
  location: string;
  description: string;
  slug: string;
  is_active: boolean;
}

const emptyForm: JobForm = {
  job_title: '',
  company_name: '',
  location: '',
  description: '',
  slug: '',
  is_active: true
};

export default function AdminPanel() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<JobForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string, company: string) => {
    const base = `${title}-at-${company}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return `${base}-${Date.now().toString(36)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const slug = form.slug || generateSlug(form.job_title, form.company_name);
      
      if (editingId) {
        await fetch('/api/jobs', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...form, slug })
        });
      } else {
        await fetch('/api/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, slug })
        });
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      fetchJobs();
    } catch (err) {
      console.error('Failed to save job:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (job: Job) => {
    setForm({
      job_title: job.job_title,
      company_name: job.company_name,
      location: job.location,
      description: job.description,
      slug: job.slug,
      is_active: job.is_active
    });
    setEditingId(job.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    
    try {
      await fetch('/api/jobs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      fetchJobs();
    } catch (err) {
      console.error('Failed to delete job:', err);
    }
  };

  const toggleActive = async (job: Job) => {
    try {
      await fetch('/api/jobs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: job.id, is_active: !job.is_active })
      });
      fetchJobs();
    } catch (err) {
      console.error('Failed to toggle job:', err);
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-slate-100 rounded w-48"></div>
          <div className="h-64 bg-slate-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Panel</h1>
            <p className="text-slate-600 mt-1">Manage job listings</p>
            </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition-all shadow-lg shadow-emerald-500/25"
          >
            <Plus className="w-5 h-5" />
            Add New Job
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && cancelForm()}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-slate-900">
                  {editingId ? 'Edit Job' : 'Create New Job'}
                </h2>
                <button
                  onClick={cancelForm}
                  className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.job_title}
                      onChange={(e) => setForm({ ...form, job_title: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      placeholder="e.g. Senior Software Engineer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.company_name}
                      onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      placeholder="e.g. Google"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    placeholder="e.g. San Francisco, CA (Remote)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none"
                    placeholder="Enter full job description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Slug (auto-generated if empty)
                  </label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    placeholder="senior-software-engineer-at-google"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-300 bg-white text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0"
                  />
                  <label htmlFor="is_active" className="text-slate-700">
                    Active (visible to job seekers)
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={cancelForm}
                    className="flex-1 px-6 py-3 bg-slate-50 text-slate-700 font-medium rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition-all disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    {saving ? 'Saving...' : (editingId ? 'Update Job' : 'Create Job')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Jobs Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {jobs.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-slate-700" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No jobs yet</h3>
              <p className="text-slate-600 mb-6">Create your first job listing to get started</p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-medium rounded-xl hover:bg-emerald-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add New Job
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Job Title</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Company</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700 hidden sm:table-cell">Location</th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-slate-700">Status</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id} className="border-b border-slate-200/60 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-slate-900 font-medium">{job.job_title}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{job.company_name}</td>
                      <td className="px-6 py-4 text-slate-600 hidden sm:table-cell">{job.location}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ${
                          job.is_active
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {job.is_active ? (
                            <><Eye className="w-3 h-3" /> Active</>
                          ) : (
                            <><EyeOff className="w-3 h-3" /> Inactive</>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toggleActive(job)}
                            className={`p-2 rounded-lg transition-colors ${
                              job.is_active
                                ? 'text-slate-600 hover:text-amber-600 hover:bg-amber-50'
                                : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={job.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {job.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleEdit(job)}
                            className="p-2 text-slate-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(job.id)}
                            className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
