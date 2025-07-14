import React, { useState } from 'react';
import { createRoom } from '../utils/rooms';
import { useNavigate } from 'react-router-dom';

export default function CreateRoom() {
  const [name, setName] = useState('');
  const [room, setRoom] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await createRoom(name);
      setRoom(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 px-4">
      <div className="w-full max-w-md bg-gray-800/90 rounded-2xl shadow-xl p-8 border border-gray-700/50">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Create Shared Room</h2>
        {room ? (
          <div className="text-center">
            <p className="text-green-400 font-semibold mb-2">Room created!</p>
            <p className="text-white">Room Name: <span className="font-bold">{room.name}</span></p>
            <p className="text-white">Share this code with your team:</p>
            <div className="text-2xl font-mono bg-gray-900 text-green-400 rounded p-2 my-2 inline-block">{room.code}</div>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => navigate(`/rooms/${room._id}`)}>Go to Room</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-1 text-gray-200">Room Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 outline-none transition-all duration-300"
                placeholder="Enter room name"
                required
              />
            </div>
            {error && <p className="text-red-400 text-center font-medium text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold text-lg shadow-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Room'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
