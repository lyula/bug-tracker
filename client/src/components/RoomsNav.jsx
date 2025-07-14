import React, { useEffect, useState } from 'react';
import { getMyRooms } from '../utils/rooms';
import { Link, useLocation, useParams } from 'react-router-dom';

export default function RoomsNav() {
  const [rooms, setRooms] = useState([]);
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    getMyRooms().then(setRooms).catch(() => setRooms([]));
  }, []);


  // If on a room page (e.g. /rooms/:id), show only a back arrow
  const isRoomPage = location.pathname.startsWith('/rooms/') && location.pathname.split('/').length === 3;
  const isMyRoomsPage = location.pathname === '/rooms/my';

  if (isRoomPage) {
    return (
      <nav className="flex flex-wrap gap-2 mb-6">
        <Link to="/rooms/my" className="flex items-center px-3 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition shadow">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          <span className="hidden sm:inline">Back to Rooms</span>
        </Link>
      </nav>
    );
  }

  if (isMyRoomsPage) {
    return (
      <nav className="flex flex-wrap gap-2 mb-6">
        <Link to="/bug-reports" className="flex items-center px-3 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition shadow">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          <span className="hidden sm:inline">Back to Bug Reports</span>
        </Link>
      </nav>
    );
  }

  // Hide room buttons on /bug-reports page
  if (location.pathname === '/bug-reports') {
    return (
      <nav className="flex flex-wrap gap-2 mb-6">
        <Link to="/rooms/my" className={`px-5 py-2 rounded-lg font-semibold shadow bg-gray-200 text-gray-800`}>My Rooms</Link>
        <Link to="/rooms/create" className="px-5 py-2 rounded-lg bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition">+ Create Room</Link>
        <Link to="/rooms/join" className="px-5 py-2 rounded-lg bg-purple-600 text-white font-semibold shadow hover:bg-purple-700 transition">Join Room</Link>
      </nav>
    );
  }
  return (
    <nav className="flex flex-wrap gap-2 mb-6">
      <Link to="/rooms/my" className={`px-5 py-2 rounded-lg font-semibold shadow ${location.pathname === '/rooms/my' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>My Rooms</Link>
      {rooms.map(room => (
        <Link key={room._id} to={`/rooms/${room._id}`} className={`px-5 py-2 rounded-lg font-semibold shadow ${location.pathname === `/rooms/${room._id}` ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>{room.name}</Link>
      ))}
      <Link to="/rooms/create" className="px-5 py-2 rounded-lg bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition">+ Create Room</Link>
      <Link to="/rooms/join" className="px-5 py-2 rounded-lg bg-purple-600 text-white font-semibold shadow hover:bg-purple-700 transition">Join Room</Link>
    </nav>
  );
}
