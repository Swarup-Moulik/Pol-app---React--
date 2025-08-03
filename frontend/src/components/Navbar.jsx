import { Bell, User, Menu, X } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { NavLink } from 'react-router-dom'
import SearchBar from './SearchBar'
import { PollContext } from '../context/pollContext'
import Theme from './Theme'

const Navbar = () => {
  const { navigate } = useContext(PollContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const logOut = () => {
    localStorage.removeItem('token');
    navigate('/login');
  }
  return (
    <nav className="relative overflow-visible bg-card border-b border-border w-full">
      <div className="flex justify-between items-center px-4 md:px-12 py-4">
        {/* Left side */}
        <div className="flex items-center gap-6">
          <NavLink to="/" className="font-bold text-2xl pl-2 text-primary">
            Pollap
          </NavLink>
          {/* Desktop Links */}
          <div className="hidden md:flex font-semibold gap-6 text-lg text-primary pt-1">
            <NavLink to="/createpoll" className="card-hover">
              Create
            </NavLink>
            <div className="relative group cursor-pointer">
              <div className="hover:text-primary transition-colors duration-200">Explore</div>
              <div className="absolute left-0 top-full hidden group-hover:flex flex-col gap-2 bg-foreground border border-border p-2 rounded-md shadow-lg w-36 z-50
                  animate-fadeIn transition-all duration-300">
                <NavLink
                  to="/currentpoll"
                  className="hover:bg-muted hover:text-primary px-3 py-1 rounded transition-colors duration-150"
                >
                  Current Poll
                </NavLink>
                <NavLink
                  to="/pastpoll"
                  className="hover:bg-muted hover:text-primary px-3 py-1 rounded transition-colors duration-150"
                >
                  Past Poll
                </NavLink>
              </div>
            </div>
          </div>
        </div>
        {/* Right side */}
        <div className="hidden md:flex w-[32%] items-center gap-6 text-primary">
          <SearchBar />
          <NavLink to="/profile">
            <User />
          </NavLink>
          <div onClick={logOut} className="card-hover cursor-pointer">
            Log Out
          </div>
          <Theme />
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden w-full flex justify-end pr-12 items-center gap-5">
          <NavLink to="/profile">
            <User size={18} />
          </NavLink>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
          <Theme />
        </div>
      </div>
      <div
        className={`absolute top-full left-0 w-full bg-card shadow-md z-50 transform transition-transform duration-500 ease-in-out md:hidden
        ${mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}
      >
        <div className="flex flex-col px-6 py-4 gap-4 text-primary font-medium text-lg">
          <NavLink to="/createpoll" className="card-hover" onClick={() => setMobileMenuOpen(false)}>
            Create
          </NavLink>
          <NavLink to="/currentpoll" onClick={() => setMobileMenuOpen(false)}>Current Poll</NavLink>
          <NavLink to="/pastpoll" onClick={() => setMobileMenuOpen(false)}>Past Poll</NavLink>
          <div onClick={logOut} className="card-hover cursor-pointer">
            Log Out
          </div>
          <div className="flex justify-center gap-2">
            <SearchBar />
          </div>
        </div>
      </div>

    </nav >
  )
}

export default Navbar
