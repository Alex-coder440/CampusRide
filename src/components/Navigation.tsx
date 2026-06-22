import { MapPin, Navigation as NavIcon, User, LogIn, Menu, X, LogOut, Car, UserCircle } from 'lucide-react';
import { ViewState } from '../App';
import { useState } from 'react';

interface NavigationProps {
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
  user?: import('../types').User | null;
  onLogout?: () => void;
}

export default function Navigation({ currentView, setCurrentView, user, onLogout }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (target: ViewState) => {
    setCurrentView(target);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#fcfcfc]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1200px]">
        <div className="flex h-24 items-center justify-between relative">
          <div className="flex items-center cursor-pointer group hover:scale-[1.02] active:scale-[0.98] transition-transform" onClick={() => handleNav('home')}>
            <span className="text-xl font-bold tracking-tight text-black flex items-center">
              <Car className="w-5 h-5 mr-1.5" />
              CampusRide.
            </span>
          </div>

          {/* Desktop Nav - Centered items */}
          <nav className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2 bg-white px-6 py-2 rounded-full shadow-sm border border-gray-100 gap-8 text-[12px] font-semibold text-gray-500">
            <button 
              onClick={() => handleNav('home')} 
              className={`transition-colors hover:text-black hover:scale-105 active:scale-95 ${currentView === 'home' ? 'text-black' : ''}`}
            >
              Home
            </button>
            <button 
              onClick={() => handleNav('features')} 
              className={`transition-colors hover:text-black hover:scale-105 active:scale-95 ${currentView === 'features' ? 'text-black' : ''}`}
            >
              Features
            </button>
            {user && (
              <button 
                onClick={() => {
                  if (user.role === 'student') handleNav('student_portal');
                  else if (user.role === 'driver') handleNav('driver_portal');
                  else if (user.role === 'admin') handleNav('admin_portal');
                }}
                className={`transition-colors hover:text-black hover:scale-105 active:scale-95 ${(currentView === 'student_portal' || currentView === 'driver_portal' || currentView === 'admin_portal') ? 'text-black' : ''}`}
              >
                {user.role === 'student' ? 'Student Portal' : user.role === 'driver' ? 'Driver Portal' : 'Admin Portal'}
              </button>
            )}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <button
                onClick={() => handleNav('profile')}
                className="flex items-center gap-3 bg-white pl-3 pr-6 py-2.5 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md text-left"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0 border border-gray-200">
                  {user.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <UserCircle className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-black font-bold text-sm leading-none">{user.name.split(' ')[0]}</span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-[4px] leading-none">{user.role}</span>
                </div>
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-white px-1 py-1 rounded-full border border-gray-100 shadow-sm transition-all hover:shadow-md">
                <button 
                  onClick={() => handleNav('login')}
                  className="text-gray-500 hover:text-black transition-all hover:scale-105 active:scale-95 text-[12px] font-semibold px-4 py-1.5"
                >
                  Log in
                </button>
                <button 
                  onClick={() => handleNav('auth_student')}
                  className="bg-black text-white text-[12px] font-semibold px-4 py-1.5 rounded-full transition-all hover:bg-gray-800 hover:scale-105 active:scale-95 hover:shadow-md"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 text-black hover:text-gray-600 z-10 relative"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#fcfcfc]">
          <div className="space-y-1 px-4 pb-6 pt-4 border-t border-gray-100">
            <button 
              onClick={() => handleNav('home')} 
              className="block w-full text-left px-4 py-3 text-sm font-bold text-gray-400 hover:text-black"
            >
              Start Here
            </button>
            <button 
              onClick={() => handleNav('features')} 
              className="block w-full text-left px-4 py-3 text-sm font-bold text-gray-400 hover:text-black"
            >
              See Features
            </button>
            {user && (
              <button 
                onClick={() => {
                  if (user.role === 'student') handleNav('student_portal');
                  else if (user.role === 'driver') handleNav('driver_portal');
                  else if (user.role === 'admin') handleNav('admin_portal');
                }}
                className="block w-full text-left px-4 py-3 text-sm font-bold text-gray-400 hover:text-black"
              >
                {user.role === 'student' ? 'Student Portal' : user.role === 'driver' ? 'Driver Portal' : 'Admin Portal'}
              </button>
            )}
            <div className="my-4 border-t border-gray-100 pt-4">
              {user ? (
                <>
                  <button
                    onClick={() => {
                      handleNav('profile');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 mx-2 w-[calc(100%-16px)] bg-white border border-gray-100 rounded-xl shadow-sm text-black mb-2 hover:bg-gray-50 text-left transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0 border border-gray-200">
                      {user.avatar ? (
                        <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <UserCircle className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="font-bold text-sm leading-none">{user.name.split(' ')[0]}</span>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-[4px] leading-none">{user.role}</span>
                    </div>
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => handleNav('login')}
                    className="block w-full text-left px-4 py-3 text-sm font-bold text-gray-400 hover:text-black"
                  >
                    Log in
                  </button>
                  <button 
                    onClick={() => handleNav('auth_student')}
                    className="mt-4 block w-full px-4 py-3 text-left text-sm font-bold text-black"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
