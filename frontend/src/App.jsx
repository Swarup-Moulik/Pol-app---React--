import React from 'react'
import Theme from './components/Theme'
import { Toaster } from './components/ui/toaster';
import { ToastContainer } from 'react-toastify';
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Login from '@/pages/Login';
import Home from '@/pages/Home';
import Profile from '@/pages/Profile';
import CreatePoll from '@/pages/CreatePoll';
import CurrentPoll from '@/pages/CurrentPoll';
import PastPoll from '@/pages/PastPoll';
import Poll from '@/pages/Poll'
import Result from './pages/Result';

const App = () => {
  const location = useLocation(); // ✅ Get current path
  const hideNavbarAndFooter = location.pathname === '/login'; // 👈 You can add more routes if needed
  return (
    <div className="min-h-screen flex flex-col">
      <ToastContainer position="top-center" autoClose={2000} />
      <Toaster />
      <Theme />
      <main className="flex-1">
      {!hideNavbarAndFooter && <Navbar />} {/* 👈 Conditionally render */}
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Home />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/createpoll' element={<CreatePoll />} />
        <Route path='/currentpoll' element={<CurrentPoll />} />
        <Route path='/pastpoll' element={<PastPoll />} />
        <Route path='/poll/:pollID' element={<Poll />} />
        <Route path='/result/:pollID' element={<Result />} />
      </Routes>
      </main>
      {!hideNavbarAndFooter && <Footer />} {/* 👈 Conditionally render */}
    </div>
  )
}

export default App
