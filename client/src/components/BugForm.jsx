import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createBug, updateBug } from '../utils/api';
import { useBugs } from '../hooks/useBugs';

function BugForm() {
  const { id } = useParams();
  const { bugs } = useBugs();
  const [form, setForm] = useState({ title: '', description: '', status: 'open' });
  useEffect(() => {
    if (id) {
      const bug = bugs.find((b) => b._id === id);
      if (bug) {
        setForm({
          title: bug.title || '',
          description: bug.description || '',
          status: bug.status || 'open',
        });
      }
    }
  }, [id, bugs]);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (id) {
        await updateBug(id, form);
      } else {
        await createBug(form);
      }
      navigate('/bug-reports');
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving bug');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-700/50 relative">
        <div className="absolute left-6 top-6">
          <button
            type="button"
            onClick={() => navigate('/bug-reports')}
            className="flex items-center px-3 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition shadow"
            aria-label="Back to bug reports"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            <span className="hidden sm:inline">Back</span>
          </button>
        </div>
        <h1 className="text-3xl font-bold text-white mb-8 text-center tracking-tight">
          {id ? 'Edit Bug' : 'Report New Bug'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-200">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 outline-none transition-all duration-300 hover:border-purple-400"
              placeholder="Enter bug title"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-200">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 outline-none transition-all duration-300 hover:border-purple-400"
              placeholder="Describe the bug..."
              required
              rows={4}
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-200">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-600 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 outline-none transition-all duration-300 hover:border-purple-400"
            >
              <option value="open" className="bg-gray-900">Open</option>
              <option value="in-progress" className="bg-gray-900">In Progress</option>
              <option value="resolved" className="bg-gray-900">Resolved</option>
            </select>
          </div>
          {error && <p className="text-red-400 text-center font-medium text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-lg shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
            disabled={loading}
          >
            {loading ? 'Saving...' : id ? 'Update Bug' : 'Report Bug'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BugForm;