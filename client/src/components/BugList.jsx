import React from 'react';
import { useBugs } from '../hooks/useBugs';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RoomsNav from './RoomsNav.jsx';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { deleteBug } from '../utils/api';


function BugList() {
  const { bugs, loading, error } = useBugs();
  const [page, setPage] = React.useState(1);
  const bugsPerPage = 5;
  const [localBugs, setLocalBugs] = React.useState(bugs);
  React.useEffect(() => { setLocalBugs(bugs); }, [bugs]);
  const totalPages = Math.ceil(localBugs.length / bugsPerPage);
  const paginatedBugs = localBugs.slice((page - 1) * bugsPerPage, page * bugsPerPage);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDelete = async (bugId) => {
    if (!window.confirm('Are you sure you want to delete this bug?')) return;
    try {
      await deleteBug(bugId);
      setLocalBugs((prev) => prev.filter((b) => b._id !== bugId));
    } catch (err) {
      alert('Failed to delete bug.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex flex-col items-center py-4 px-4">
      <div className="w-full max-w-3xl">
        <div className="mb-8 gap-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between w-full">
            <div className="flex-1">
              <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Bug Tracker</h1>
              {user && (
                <div className="text-gray-200 text-sm">Welcome, <span className="font-semibold">{user.username}</span></div>
              )}
            </div>
            <div className="hidden md:block">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition font-semibold mb-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <RoomsNav />
        </div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white mb-2">My Bugs Report</h2>
          <div className="flex flex-col items-end">
            <div className="block md:hidden mb-2">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition font-semibold"
              >
                Logout
              </button>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Link to="/new" className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">+ Report Bug</Link>
            </div>
          </div>
        </div>
        <div className="bg-white/90 rounded-2xl shadow-lg p-8">
          {loading && <div className="flex justify-center py-8"><span className="loader"></span></div>}
          {error && <p className="text-red-500 text-center font-medium">{error}</p>}
          {!loading && !error && (
            <ul className="divide-y divide-gray-200">
              {localBugs.length === 0 ? (
                <li className="text-gray-500 py-8 text-center text-lg">No bugs reported yet.</li>
              ) : (
                <React.Fragment>
                  {paginatedBugs.map((bug) => (
                    <li key={bug._id} className="py-6 flex flex-col md:flex-row md:items-center md:justify-between hover:bg-gray-100 transition rounded-xl px-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-bold text-xl text-gray-800">{bug.title}</span>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${bug.status === 'open' ? 'bg-red-100 text-red-700' : bug.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{bug.status}</span>
                        </div>
                        <div className="text-gray-600 text-base mb-1">{bug.description}</div>
                        <div className="text-gray-400 text-xs">
                          Created: {new Date(bug.createdAt).toLocaleString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: true,
                            timeZoneName: 'short'
                          })}
                          {/* Only show author for room bugs, not personal bugs */}
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 flex-shrink-0 flex gap-2 items-center">
                        <Link to={`/edit/${bug._id}`} className="h-10 w-10 flex items-center justify-center bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition">
                          <FaEdit size={20} />
                        </Link>
                        <button
                          title="Delete bug"
                          onClick={() => handleDelete(bug._id)}
                          className="h-10 w-10 flex items-center justify-center bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
                        >
                          <FaTrash size={20} />
                        </button>
                      </div>
                    </li>
                  ))}
                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-6 gap-2">
                      <button
                        className="px-3 py-1 rounded bg-gray-700 text-white font-semibold disabled:opacity-50"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        Previous
                      </button>
                      <span className="text-white px-2 py-1">Page {page} of {totalPages}</span>
                      <button
                        className="px-3 py-1 rounded bg-gray-700 text-white font-semibold disabled:opacity-50"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </React.Fragment>
              )}
            </ul>
          )}
        </div>
      </div>
      {/* Loader CSS */}
      <style>{`
        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default BugList;
