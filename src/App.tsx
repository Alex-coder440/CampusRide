import { useState, useEffect } from 'react';
import Home from './components/Home';
import Rides from './components/Rides';
import Auth from './components/Auth';
import Navigation from './components/Navigation';
import DriverPortal from './components/DriverPortal';
import AdminPortal from './components/AdminPortal';
import Profile from './components/Profile';
import Features from './components/Features';
import { User, Ride, WelfareApplication, ExeatApplication } from './types';
import { io } from 'socket.io-client';
import { logToSheet } from './utils/sheets';

export type ViewState = 'home' | 'features' | 'rides' | 'auth_student' | 'auth_driver' | 'login' | 'student_portal' | 'driver_portal' | 'admin_portal' | 'profile';

const initialUsers: User[] = [];

const initialWelfareApps: WelfareApplication[] = [];

const initialExeatApps: ExeatApplication[] = [];

const socket = io(); // Connects to the host that served the page

export default function App() {
  const [currentViewInternal, setCurrentViewInternal] = useState<ViewState>(() => {
    const savedView = localStorage.getItem('appState_view');
    return (savedView as ViewState) || 'home';
  });
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('appState_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    localStorage.setItem('appState_view', currentViewInternal);
  }, [currentViewInternal]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('appState_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('appState_user');
    }
  }, [user]);

  const [rides, setRides] = useState<Ride[]>([]);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [welfareApplications, setWelfareApplications] = useState<WelfareApplication[]>(initialWelfareApps);
  const [exeatApplications, setExeatApplications] = useState<ExeatApplication[]>(initialExeatApps);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [pendingNavView, setPendingNavView] = useState<ViewState | null>(null);

  const currentView = currentViewInternal;

  useEffect(() => {
    socket.on("rides:init", (initialRidesServer: Ride[]) => {
      setRides(initialRidesServer);
    });

    socket.on("rides:updated", (updatedRides: Ride[]) => {
      setRides(updatedRides);
    });

    socket.on("users:init", (initialUsersServer: User[]) => {
      setUsers(initialUsersServer);
    });

    socket.on("users:updated", (updatedUsers: User[]) => {
      setUsers(updatedUsers);
      setUser(prev => {
        if (!prev) return null;
        const matchingUser = updatedUsers.find(u => u.id === prev.id);
        return matchingUser ? matchingUser : prev;
      });
    });

    socket.on("welfare:init", (initialWelfareServer: WelfareApplication[]) => {
      setWelfareApplications(initialWelfareServer);
    });

    socket.on("welfare:updated", (updatedWelfare: WelfareApplication[]) => {
      setWelfareApplications(updatedWelfare);
    });

    socket.on("exeat:init", (initialExeatServer: ExeatApplication[]) => {
      setExeatApplications(initialExeatServer);
    });

    socket.on("exeat:updated", (updatedExeat: ExeatApplication[]) => {
      setExeatApplications(updatedExeat);
    });

    return () => {
      socket.off("rides:init");
      socket.off("rides:updated");
      socket.off("users:init");
      socket.off("users:updated");
      socket.off("welfare:init");
      socket.off("welfare:updated");
      socket.off("exeat:init");
      socket.off("exeat:updated");
    };
  }, []);

  const setCurrentView = (view: ViewState) => {
    if (currentView === 'profile' && hasUnsavedChanges) {
      setPendingNavView(view);
      setShowUnsavedDialog(true);
    } else {
      setCurrentViewInternal(view);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const handleLogin = (loggedUser: User) => {
    // Basic persistent user addition for mock
    let serverUser = users.find(u => u.email === loggedUser.email) || loggedUser;
    
    if (!users.find(u => u.email === loggedUser.email)) {
      socket.emit("users:add", loggedUser);
    }

    setUser(serverUser);
    if (serverUser.role === 'student') setCurrentView('student_portal');
    else if (serverUser.role === 'driver') setCurrentView('driver_portal');
    else if (serverUser.role === 'admin') setCurrentView('admin_portal');
    else setCurrentView('home');
  };

  const verifyUser = (userId: string) => {
    const u = users.find(userItem => userItem.id === userId);
    if (u) {
      socket.emit("users:update", { ...u, status: 'verified' });
      if (user?.id === userId) setUser({ ...u, status: 'verified' });

      // Log verification to Admin sheet
      if (user && user.role === 'admin') {
        logToSheet('Admin', [
          user.id,
          user.name,
          user.email,
          '',
          '',
          'Yes',
          '', '', '',
          u.id
        ], u.id);
      }
    }
  };

  const rejectUser = (userId: string) => {
    const u = users.find(userItem => userItem.id === userId);
    if (u) {
      socket.emit("users:update", { ...u, status: 'rejected' });
      if (user?.id === userId) setUser({ ...u, status: 'rejected' });
    }
  };

  const updateWelfareStatus = (appId: string, status: 'approved' | 'rejected') => {
    socket.emit("welfare:updateStatus", { id: appId, status });
    const app = welfareApplications.find(a => a.id === appId);
    if (app && user && user.role === 'admin' && status === 'approved') {
       logToSheet('Admin', [
          user.id,
          user.name,
          user.email,
          '', '', '',
          '', // do not overwrite applicant name
          '', // do not overwrite approval type
          'Yes',
          appId // appId is user.id
       ], appId);
    }
  };

  const updateExeatStatus = (appId: string, status: 'approved' | 'rejected') => {
    socket.emit("exeat:updateStatus", { id: appId, status });
    const app = exeatApplications.find(a => a.id === appId);
    if (app && user && user.role === 'admin' && status === 'approved') {
       logToSheet('Admin', [
          user.id,
          user.name,
          user.email,
          '', '', '',
          '',
          '',
          'Yes',
          appId + '-exeat'
       ], appId + '-exeat');
    }
  };

  const handleLogout = () => {
    if (currentView === 'profile' && hasUnsavedChanges) {
      setPendingNavView('logout_action' as any);
      setShowUnsavedDialog(true);
    } else {
      setUser(null);
      setCurrentViewInternal('home');
    }
  };

  const bookRide = async (rideId: string, seats: number = 1, destination: string = '', time: string = '', pickup: string = '') => {
    if (!user || user.role !== 'student') return;
    
    const ride = rides.find(r => r.id === rideId);
    const driverId = ride ? parseInt(ride.driverId) || 1 : 1;
    const amount = ride ? ride.price * seats : 0;

    try {
      await fetch('/api/rides/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          MatricNumber: user.matricNo || `M-${user.id}`,
          DriverID: driverId,
          Seats: seats,
          Location: pickup || ride?.from || 'Campus',
          Destination: destination || ride?.to || 'Off Campus',
          Amount: amount,
          Time: time || new Date().toISOString()
        })
      });
    } catch (err) {
      console.error('Failed to book ride in Postgres:', err);
    }

    // Emit to server
    socket.emit("rides:book", { rideId, seats, user, destination, time, pickup });
  };

  const addRide = async (ride: Ride) => {
    try {
      await fetch('/api/rides/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          DriverID: parseInt(ride.driverId) || 1,
          Seats: ride.seats,
          Location: ride.from
        })
      });
    } catch (err) {
      console.error('Failed to post ride to Postgres:', err);
    }

    socket.emit("rides:add", ride);
  };

  const updateRideStatus = (rideId: string, status: 'scheduled' | 'active' | 'completed') => {
    socket.emit("rides:updateStatus", { rideId, status });
  };

  const submitWelfare = async (firstName: string, lastName: string, matricNo: string, fileName: string, fileDataURL?: string) => {
    if (!user) return;
    
    try {
      await fetch('/api/appeals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Name: `${firstName} ${lastName}`,
          Type: 'Welfare'
        })
      });
    } catch (err) {
      console.error('Failed to submit appeal to Postgres:', err);
    }

    const appId = Math.random().toString(36).substr(2, 9);
    socket.emit("welfare:submit", { id: user.id /* using user.id historically */, firstName, lastName, matricNo, fileName, fileDataURL, status: 'pending' });
    
    // Log Welfare submission action to Admin sheet for approval later
    logToSheet('Admin', [
      '', '', '', '', '', '',
      `${firstName} ${lastName}`,
      'Welfare',
      'No',
      user.id
    ], user.id);
  };

  const submitExeat = async (firstName: string, lastName: string, matricNo: string, fileName: string, fileDataURL?: string) => {
    if (!user) return;
    
    try {
      await fetch('/api/appeals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Name: `${firstName} ${lastName}`,
          Type: 'Exeat'
        })
      });
    } catch (err) {
      console.error('Failed to submit appeal to Postgres:', err);
    }

    socket.emit("exeat:submit", { id: user.id, firstName, lastName, matricNo, fileName, fileDataURL, status: 'pending' });
    
    // Log Exeat submission action to Admin sheet for approval later
    logToSheet('Admin', [
      '', '', '', '', '', '',
      `${firstName} ${lastName}`,
      'Exeat',
      'No',
      user.id + '-exeat'
    ], user.id + '-exeat');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    socket.emit("users:update", updatedUser);
  };

  // Keep a dummy navigation logic to switch
  return (
    <div className="min-h-screen bg-white font-sans text-black selection:bg-black/10 flex flex-col">
      <Navigation currentView={currentView} setCurrentView={setCurrentView} user={user} onLogout={handleLogout} />
      
      <main className="flex-1 flex flex-col">
        {currentView === 'home' && <Home setCurrentView={setCurrentView} />}
        {currentView === 'features' && <Features />}
        {(currentView === 'rides' || currentView === 'student_portal') && (
          <Rides 
            setCurrentView={setCurrentView} 
            user={user} 
            rides={rides} 
            bookRide={bookRide}
            welfareApplications={welfareApplications}
            submitWelfare={submitWelfare}
            exeatApplications={exeatApplications}
            submitExeat={submitExeat}
          />
        )}
        {currentView === 'driver_portal' && (
          <DriverPortal user={user} rides={rides} addRide={addRide} updateRideStatus={updateRideStatus} />
        )}
        {currentView === 'admin_portal' && (
          <AdminPortal 
            users={users} 
            verifyUser={verifyUser}
            rejectUser={rejectUser}
            rides={rides}
            welfareApplications={welfareApplications}
            updateWelfareStatus={updateWelfareStatus}
            exeatApplications={exeatApplications}
            updateExeatStatus={updateExeatStatus}
          />
        )}
        {currentView === 'profile' && (
          <Profile user={user} rides={rides} onUpdateUser={handleUpdateUser} onLogout={handleLogout} setHasUnsavedChanges={setHasUnsavedChanges} />
        )}
        {(currentView === 'auth_student' || currentView === 'auth_driver' || currentView === 'login') && (
          <Auth currentView={currentView} setCurrentView={setCurrentView} onLogin={handleLogin} />
        )}
      </main>

      {showUnsavedDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm px-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Unsaved Changes</h3>
            <p className="text-gray-500 text-sm mb-6">You have unsaved changes in your profile. Are you sure you want to leave without saving?</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowUnsavedDialog(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowUnsavedDialog(false);
                  setHasUnsavedChanges(false);
                  if (pendingNavView === 'logout_action' as any) {
                    setUser(null);
                    setCurrentViewInternal('home');
                  } else if (pendingNavView) {
                    setCurrentViewInternal(pendingNavView);
                  }
                  setPendingNavView(null);
                }}
                className="px-4 py-2 text-sm font-bold text-white bg-black rounded-xl hover:bg-gray-800 transition"
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
