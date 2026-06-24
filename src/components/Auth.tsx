import { ViewState } from '../App';
import * as motion from 'motion/react-client';
import { User, Car } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import type { User as UserType } from '../types';

interface AuthProps {
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
  onLogin: (user: UserType) => void;
}

export default function Auth({ currentView, setCurrentView, onLogin }: AuthProps) {
  const isLogin = currentView === 'login';
  const initialTab = currentView === 'auth_driver' ? 'driver' : 'student';
  const [activeTab, setActiveTab] = useState<'student' | 'driver' | 'admin'>(initialTab);
  const [driverType, setDriverType] = useState<'within' | 'out' | 'welfare'>('within');

  // Input states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [matricNo, setMatricNo] = useState('');
  const [shuttleNo, setShuttleNo] = useState('');
  const [email, setEmail] = useState('');
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [driverName, setDriverName] = useState('');
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    if (currentView === 'auth_driver') setActiveTab('driver');
    else if (currentView === 'auth_student') setActiveTab('student');
  }, [currentView]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let name = '';
    if (activeTab === 'student') {
      name = isLogin ? (email.split('@')[0] || 'Student') : `${firstName} ${lastName}`.trim();
    } else if (activeTab === 'driver') {
      name = isLogin ? (email.split('@')[0] || 'Driver') : driverName;
    } else {
      name = isLogin ? 'Admin' : adminName;
    }
    
    const newUserId = Math.floor(Math.random() * 2000000000).toString();
    
    try {
      if (activeTab === 'student') {
        await fetch('/api/students/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            FirstName: firstName || 'Student',
            LastName: lastName || '',
            MatricNumber: matricNo || `M-${newUserId}`,
            Email: email,
            Name: name
          })
        });
      } else if (activeTab === 'driver') {
        // Driver registration logic should perhaps only happen on !isLogin, 
        // but if they are logging in, we just assume they exist. To be safe, upsert isn't there for driver,
        // so we'll only do it if !isLogin or we can just try to register them.
        if (!isLogin) {
          await fetch('/api/drivers/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              FullName: name,
              ShuttleNo: shuttleNo || `S-${newUserId}`,
              Email: email
            })
          });
        }
      } else if (activeTab === 'admin') {
         await fetch('/api/admins/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              FullName: name || 'Admin',
              Email: email
            })
          });
      }
    } catch (err) {
      console.error('Failed to update Postgres backend:', err);
    }

    if (!isLogin) {
      try {
        if (activeTab === 'admin') {
          await fetch('/api/sheets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sheetName: 'Admin', data: [adminId, adminName, email, '', '', '', '', '', '', newUserId] })
          });
        } else {
          // Log Registration action to Admin sheet for verification later
          await fetch('/api/sheets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
               sheetName: 'Admin', 
               updateKey: newUserId,
               data: ['', '', '', name, email, 'No', '', '', '', newUserId] 
            })
          });
        }
      } catch (err) {
        console.error('Failed to log to sheet:', err);
      }
    }
    
    onLogin({
      id: newUserId,
      name: name || 'User',
      role: activeTab,
      email: email || 'user@example.com',
      driverType: activeTab === 'driver' ? driverType : undefined,
      status: isLogin ? 'verified' : (activeTab === 'admin' ? 'verified' : 'pending'),
      matricNo,
      shuttleNo,
    });
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center py-20 px-4 sm:px-6 bg-[#fcfcfc] relative overflow-hidden">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="text-center mb-10 pb-10 border-b border-gray-200">
          <h2 className="text-4xl font-black text-black tracking-tighter mb-4">
            {isLogin ? 'Welcome back.' : 'Create account.'}
          </h2>
          <p className="text-base text-gray-600 font-medium">
            {isLogin 
              ? 'Sign in to your CampusRide account'
              : 'Join CampusRide and start moving smarter'}
          </p>
        </div>

        {/* Auth form area */}
        <div>
          <div className="flex p-1 bg-gray-50 mb-8 border border-gray-200">
            {(['student', 'driver', 'admin'] as const).map(tab => (
              <button
                key={tab}
                className={`flex-1 text-xs uppercase tracking-widest font-bold py-3 transition-all ${activeTab === tab ? 'bg-black text-white' : 'text-gray-400 hover:text-black hover:bg-gray-100'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {isLogin ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 block uppercase tracking-widest">
                  {activeTab === 'student' ? 'Student email' : activeTab === 'driver' ? 'Email address' : 'Admin ID'}
                </label>
                <input 
                  key="login-email"
                  type={activeTab === 'admin' ? 'text' : 'email'}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={activeTab === 'student' ? 'you@campus.edu' : activeTab === 'admin' ? 'admin_01' : 'driver@mail.com'} 
                  className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-black outline-none transition text-black placeholder:text-gray-400 font-medium text-sm rounded-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 block uppercase tracking-widest">Password</label>
                <input 
                  key="login-password"
                  type="password"
                  required
                  placeholder="••••••••" 
                  className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-black outline-none transition text-black placeholder:text-gray-400 font-medium text-sm rounded-none"
                />
              </div>
              <button 
                type="submit"
                className="w-full h-12 mt-6 font-bold text-xs uppercase tracking-widest text-white bg-black hover:bg-gray-800 transition-all active:scale-[0.98] rounded-none"
              >
                Sign in
              </button>
            </form>
          ) : activeTab === 'student' ? (
          <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-gray-400 block uppercase tracking-widest">First name</label>
                 <input key="student-firstname" type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Ada" className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-black outline-none transition text-sm text-black placeholder:text-gray-400 font-medium rounded-none" />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-gray-400 block uppercase tracking-widest">Last name</label>
                 <input key="student-lastname" type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Okafor" className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-black outline-none transition text-sm text-black placeholder:text-gray-400 font-medium rounded-none" />
               </div>
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-bold text-gray-400 block uppercase tracking-widest">Student email</label>
               <input key="student-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ada@campus.edu" className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-black outline-none transition text-sm text-black placeholder:text-gray-400 font-medium rounded-none" />
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-bold text-gray-400 block uppercase tracking-widest">Mat. number</label>
               <input key="student-reg" type="text" value={matricNo} onChange={(e) => setMatricNo(e.target.value)} required placeholder="29ZB000000" className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-black outline-none transition text-sm text-black placeholder:text-gray-400 font-medium rounded-none" />
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-bold text-gray-400 block uppercase tracking-widest">Password</label>
               <input key="student-password" type="password" required placeholder="••••••••" className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-black outline-none transition text-sm text-black placeholder:text-gray-400 font-medium rounded-none" />
             </div>
             <button 
                type="submit"
                className="w-full h-12 mt-6 font-bold text-xs uppercase tracking-widest text-white bg-black hover:bg-gray-800 transition-all active:scale-[0.98] rounded-none"
              >
                Create account
              </button>
          </form>
        ) : activeTab === 'driver' ? (
          <form onSubmit={handleSubmit} className="space-y-5">
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
               <button 
                type="button" 
                onClick={() => setDriverType('within')}
                className={`flex flex-col items-center p-3 rounded-none border transition-all ${driverType === 'within' ? 'border-black bg-gray-50 text-black' : 'border-gray-200 bg-white hover:border-gray-300 text-gray-500'}`}>
                 <div className="text-xl mb-1 text-center">🏫</div>
                 <div className="text-[10px] font-bold uppercase tracking-widest mt-1">Campus</div>
               </button>
               <button 
                type="button"
                onClick={() => setDriverType('out')} 
                className={`flex flex-col items-center p-3 rounded-none border transition-all ${driverType === 'out' ? 'border-black bg-gray-50 text-black' : 'border-gray-200 bg-white hover:border-gray-300 text-gray-500'}`}>
                 <div className="text-xl mb-1 text-center">🛣️</div>
                 <div className="text-[10px] font-bold uppercase tracking-widest mt-1">Outside</div>
               </button>
               <button 
                type="button"
                onClick={() => setDriverType('welfare')} 
                className={`flex flex-col items-center p-3 rounded-none border transition-all ${driverType === 'welfare' ? 'border-black bg-gray-50 text-black' : 'border-gray-200 bg-white hover:border-gray-300 text-gray-500'}`}>
                 <div className="text-xl mb-1 text-center">🤝</div>
                 <div className="text-[10px] font-bold uppercase tracking-widest mt-1">Welfare</div>
               </button>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-gray-400 block uppercase tracking-widest">Full name</label>
                 <input key="driver-name" type="text" required value={driverName} onChange={(e) => setDriverName(e.target.value)} placeholder="Driver Name" className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-black outline-none transition text-sm text-black placeholder:text-gray-400 font-medium rounded-none" />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-gray-400 block uppercase tracking-widest">Shuttle No</label>
                 <input key="driver-plate" type="text" value={shuttleNo} onChange={(e) => setShuttleNo(e.target.value)} required placeholder="10" className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-black outline-none transition text-sm text-black placeholder:text-gray-400 font-medium rounded-none" />
               </div>
             </div>
             
             <div className="space-y-2">
               <label className="text-[10px] font-bold text-gray-400 block uppercase tracking-widest">Email</label>
               <input key="driver-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="driver@mail.com" className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-black outline-none transition text-sm text-black placeholder:text-gray-400 font-medium rounded-none" />
             </div>
             
             <div className="space-y-2">
               <label className="text-[10px] font-bold text-gray-400 block uppercase tracking-widest">Password</label>
               <input key="driver-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-black outline-none transition text-sm text-black placeholder:text-gray-400 font-medium rounded-none" />
             </div>
             
             <button 
                type="submit"
                className="w-full h-12 mt-6 font-bold text-xs uppercase tracking-widest text-white bg-black hover:bg-gray-800 transition-all active:scale-[0.98] rounded-none"
              >
                Submit for approval
              </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
             <div className="space-y-2">
               <label className="text-[10px] font-bold text-gray-400 block uppercase tracking-widest">Admin ID</label>
               <input key="admin-id" type="text" required value={adminId} onChange={(e) => setAdminId(e.target.value)} placeholder="admin_01" className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-black outline-none transition text-sm text-black placeholder:text-gray-400 font-medium rounded-none" />
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-bold text-gray-400 block uppercase tracking-widest">Full name</label>
               <input key="admin-name" type="text" required value={adminName} onChange={(e) => setAdminName(e.target.value)} placeholder="John Doe" className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-black outline-none transition text-sm text-black placeholder:text-gray-400 font-medium rounded-none" />
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-bold text-gray-400 block uppercase tracking-widest">Email</label>
               <input key="admin-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@campus.edu" className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-black outline-none transition text-sm text-black placeholder:text-gray-400 font-medium rounded-none" />
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-bold text-gray-400 block uppercase tracking-widest">Password</label>
               <input key="admin-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-black outline-none transition text-sm text-black placeholder:text-gray-400 font-medium rounded-none" />
             </div>
             <button 
                type="submit"
                className="w-full h-12 mt-6 font-bold text-xs uppercase tracking-widest text-white bg-black hover:bg-gray-800 transition-all active:scale-[0.98] rounded-none"
              >
                Create Account
              </button>
          </form>
        )}
        </div>

        <div className="mt-12 text-center text-[10px] text-gray-400 font-bold tracking-widest uppercase">
          {isLogin ? (
            <>Don't have an account? <button onClick={() => setCurrentView('auth_student')} className="text-black hover:underline transition-all ml-2">Sign up</button></>
          ) : (
            <>Already have an account? <button onClick={() => setCurrentView('login')} className="text-black hover:underline transition-all ml-2">Sign in</button></>
          )}
        </div>
      </motion.div>
    </div>
  );
}
