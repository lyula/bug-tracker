import React, { useEffect, useState } from 'react';
import { getMyRooms, deleteRoom } from '../utils/rooms';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MyRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    getMyRooms()
      .then(setRooms)
      .catch(() => setError('Failed to load rooms'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room? This cannot be undone.')) return;
    try {
      await deleteRoom(roomId);
      setRooms((prev) => prev.filter((room) => room._id !== roomId));
    } catch (err) {
      alert('Failed to delete room.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex flex-col items-center justify-start py-12 px-4">
      <div className="w-full max-w-2xl">
        {/* Back Button */}
        <div className="mb-4">
          <Link to="/bug-reports" className="inline-flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition font-semibold shadow">
            &larr; Back to Bug Reports
          </Link>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-8">My Rooms</h1>
        {loading && <div className="text-white">Loading...</div>}
        {error && <div className="text-red-400">{error}</div>}
        {!loading && !error && (
          <ul className="space-y-4">
            {rooms.length === 0 ? (
              <li className="text-gray-300 text-center">You have not joined or created any rooms yet.</li>
            ) : (
              rooms.map(room => (
                <li key={room._id} className="bg-white/90 rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-bold text-lg text-gray-900">{room.name}</div>
                    <div className="text-gray-600 text-sm">Code: <span className="font-mono bg-gray-900 text-green-400 rounded px-2 py-1">{room.code}</span></div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 mt-4 md:mt-0">
                    <Link to={`/rooms/${room._id}`} className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-semibold">View Room</Link>
                    {user && room.admin && (user._id === (room.admin._id || room.admin)) && (
                      <button
                        className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition font-semibold"
                        onClick={() => handleDelete(room._id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
