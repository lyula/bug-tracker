import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import BugList from './components/BugList.jsx';
import BugForm from './components/BugForm.jsx';
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import RoomsNav from './components/RoomsNav.jsx';
import MyRooms from './components/MyRooms.jsx';
import CreateRoom from './components/CreateRoom.jsx';
import JoinRoom from './components/JoinRoom.jsx';
import RoomBugs from './components/RoomBugs.jsx';
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/bug-reports" element={<BugList />} />
          <Route path="/new" element={<BugForm />} />
          <Route path="/edit/:id" element={<BugForm />} />
          <Route path="/rooms/my" element={<MyRooms />} />
          <Route path="/rooms/create" element={<CreateRoom />} />
          <Route path="/rooms/join" element={<JoinRoom />} />
          <Route path="/rooms/:id" element={<RoomBugs />} />
          <Route path="/" element={<Login />} />
        </Routes>
        
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
