import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BusBooking from './pages/BusBooking';
import Map from './pages/Map';
import StatisticsDashboard from './pages/StatisticsDashboard';
import MyPage from './pages/MyPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buses" element={<BusBooking />} />
        <Route path="/map" element={<Map />} />
        <Route path="/statistics" element={<StatisticsDashboard />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
