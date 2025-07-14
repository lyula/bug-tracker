
import RoomsNav from './RoomsNav.jsx';
import React, { useEffect, useState } from 'react';
import { fetchRoomBugs, createRoomBug, getRoom } from '../utils/rooms';
import { updateRoomBugStatus } from '../utils/roomBugs';
import { updateRoomBug } from '../utils/roomBugEdit';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RoomBugs() {
  const [showMembers, setShowMembers] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editBug, setEditBug] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });
  const [editError, setEditError] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const { id } = useParams();
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', status: 'open' });
  const [page, setPage] = useState(1);
  const bugsPerPage = 5;
  const totalPages = Math.ceil(bugs.length / bugsPerPage);
  const paginatedBugs = bugs.slice((page - 1) * bugsPerPage, page * bugsPerPage);
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    getRoom(id).then(setRoom).catch(() => setRoom(null));
    fetchBugsForRoom();
    // eslint-disable-next-line
  }, [id]);

  const fetchBugsForRoom = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRoomBugs(id);
      setBugs(data);
    } catch (err) {
      setError('Failed to load bugs');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    try {
      await createRoomBug(id, form);
      setForm({ title: '', description: '', status: 'open' });
      fetchBugsForRoom();
    } catch (err) {
      setFormError('Failed to create bug');
    } finally {
      setFormLoading(false);
    }
  };


  // Status update and delete for room bugs are not implemented in backend
  // so those buttons are removed for now.


  // Always render the dark background, even during loading
  if (!room && !loading) return <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex items-center justify-center"><div className="text-center text-white py-12">Room not found.</div></div>;

  const isAdmin = user && room && room.admin && (user._id === room.admin._id);

  const handleStatusChange = async (bugId, newStatus) => {
    try {
      await updateRoomBugStatus(id, bugId, newStatus);
      fetchBugsForRoom();
    } catch (err) {
      alert('Failed to update bug status');
    }
  };

  // Open edit modal and set form values
  const openEditModal = (bug) => {
    setEditBug(bug);
    setEditForm({ title: bug.title, description: bug.description });
    setEditError(null);
    setEditModal(true);
  };

  // Handle edit form change
  const handleEditFormChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Submit edit form
  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError(null);
    try {
      await updateRoomBug(id, editBug._id, editForm);
      setEditModal(false);
      setEditBug(null);
      fetchBugsForRoom();
    } catch (err) {
      setEditError('Failed to update bug');
    } finally {
      setEditLoading(false);
    }
  };

  // Check if user is bug author or admin
  const canEditBug = (bug) => {
    if (!user) return false;
    if (isAdmin) return true;
    if (bug.creator && (bug.creator._id === user._id || bug.creator === user._id)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex flex-col items-center justify-start py-12 px-4">
      <div className="w-full max-w-3xl">
        {loading ? (
          <div className="flex justify-center py-32 w-full">
            <span className="loader"></span>
          </div>
        ) : (
          <>
            <RoomsNav />
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Room: {room.name}</h1>
                <div className="text-gray-200 text-sm">Code: <span className="font-mono bg-gray-900 text-green-400 rounded px-2 py-1">{room.code}</span></div>
                <div className="text-gray-400 text-xs mt-1">Admin: {room.admin?.username}</div>
                {room.members && (
                  <>
                    <button
                      type="button"
                      className="text-blue-400 text-xs mt-1 focus:outline-none hover:text-blue-500 transition font-semibold"
                      onClick={() => setShowMembers((prev) => !prev)}
                      style={{ textDecoration: 'none' }}
                    >
                      Members: {room.members.length}
                    </button>
                    {showMembers && (
                      <div className="bg-gray-800 rounded-lg p-3 mt-2 shadow-lg">
                        <div className="text-gray-200 text-xs font-semibold mb-1">Usernames:</div>
                        <ul className="text-gray-300 text-xs list-disc list-inside">
                          {room.members.map((member) => (
                            <li key={member._id || member.id}>{member.username}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="flex-shrink-0 flex items-center justify-end w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
                >
                  Report Bug
                </button>
              </div>
            </div>
            <div className="bg-white/90 rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Bugs</h2>
              {error && <p className="text-red-500 text-center font-medium">{error}</p>}
              <ul className="divide-y divide-gray-200">
                {bugs.length === 0 ? (
                  <li className="text-gray-500 py-8 text-center text-lg">No bugs reported yet.</li>
                ) : (
                  <>
                    {paginatedBugs.map((bug) => (
                      <li key={bug._id} className="py-6 flex flex-col md:flex-row md:items-center md:justify-between hover:bg-gray-100 transition rounded-xl px-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-bold text-xl text-gray-800">{bug.title}</span>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${bug.status === 'open' ? 'bg-red-100 text-red-700' : bug.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{bug.status}</span>
                            {canEditBug(bug) && (
                              <button
                                className="ml-2 px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition"
                                onClick={() => openEditModal(bug)}
                                title="Edit bug"
                              >
                                Edit
                              </button>
                            )}
                          </div>
                          <div className="text-gray-600 text-base mb-1">{bug.description}</div>
                          {bug.creator && bug.creator.username && (
                            <div className="text-xs text-blue-700 font-semibold mb-1">Author: {bug.creator.username}</div>
                          )}
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
                          </div>
                        </div>
                        {isAdmin && (
                          <div className="mt-4 md:mt-0 flex flex-col gap-2 items-end">
                            <label className="text-xs text-gray-700 font-semibold mb-1">Update Status:</label>
                            <div className="relative w-40">
                              <select
                                value={bug.status}
                                onChange={e => handleStatusChange(bug._id, e.target.value)}
                                className="block w-full px-4 py-2 pr-8 rounded-lg border border-gray-300 bg-white text-gray-800 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition appearance-none text-sm font-semibold hover:border-blue-400 cursor-pointer"
                                style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}
                              >
                                <option value="open">Open</option>
                                <option value="in-progress">In Progress</option>
                                <option value="closed">Closed</option>
                                <option value="complete">Complete</option>
                                <option value="resolved">Resolved</option>
                              </select>
                              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                              </span>
                            </div>
                          </div>
                        )}
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
                  </>
                )}
              </ul>
            </div>
            {/* Modal for reporting a bug */}
            {showModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg relative animate-fade-in">
                  <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    onClick={() => setShowModal(false)}
                    aria-label="Close"
                  >
                    &times;
                  </button>
                  <h2 className="text-xl font-bold mb-4 text-gray-800">Report a Bug</h2>
                  <form onSubmit={async (e) => {
                    await handleFormSubmit(e);
                    if (!formError) setShowModal(false);
                  }} className="space-y-5">
                    <div>
                      <label className="block mb-1 text-gray-700">Title</label>
                      <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300"
                        placeholder="Enter bug title"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-gray-700">Description</label>
                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300"
                        placeholder="Describe the bug..."
                        required
                        rows={3}
                      />
                    </div>
                    {formError && <p className="text-red-500 text-center font-medium text-sm">{formError}</p>}
                    <button
                      type="submit"
                      className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={formLoading}
                    >
                      {formLoading ? 'Reporting...' : 'Report Bug'}
                    </button>
                  </form>
                </div>
                <style>{`
                  .animate-fade-in {
                    animation: fadeIn 0.2s ease;
                  }
                  @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                  }
                `}</style>
              </div>
            )}

            {/* Modal for editing a bug */}
            {editModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg relative animate-fade-in">
                  <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    onClick={() => setEditModal(false)}
                    aria-label="Close"
                  >
                    &times;
                  </button>
                  <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Bug</h2>
                  <form onSubmit={handleEditFormSubmit} className="space-y-5">
                    <div>
                      <label className="block mb-1 text-gray-700">Title</label>
                      <input
                        type="text"
                        name="title"
                        value={editForm.title}
                        onChange={handleEditFormChange}
                        className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300"
                        placeholder="Edit bug title"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-gray-700">Description</label>
                      <textarea
                        name="description"
                        value={editForm.description}
                        onChange={handleEditFormChange}
                        className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300"
                        placeholder="Edit bug description..."
                        required
                        rows={3}
                      />
                    </div>
                    {editError && <p className="text-red-500 text-center font-medium text-sm">{editError}</p>}
                    <button
                      type="submit"
                      className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={editLoading}
                    >
                      {editLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                </div>
                <style>{`
                  .animate-fade-in {
                    animation: fadeIn 0.2s ease;
                  }
                  @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                  }
                `}</style>
              </div>
            )}
          </>
        )}
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
