import React, { useState } from 'react';
import { joinRoom } from '../utils/rooms';
import { useNavigate } from 'react-router-dom';

export default function JoinRoom() {
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const room = await joinRoom(code);
      navigate(`/rooms/${room._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Error joining room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 px-4">
      <div className="w-full max-w-md bg-gray-800/90 rounded-2xl shadow-xl p-8 border border-gray-700/50">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Join Shared Room</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-gray-200">Room Code</label>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 outline-none transition-all duration-300"
              placeholder="Enter room code"
              required
            />
          </div>
          {error && <p className="text-red-400 text-center font-medium text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-lg shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Joining...' : 'Join Room'}
          </button>
        </form>
      </div>
    </div>
  );
}
