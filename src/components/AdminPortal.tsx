import React, { useState, useMemo } from 'react';
import { User, Ride, WelfareApplication, ExeatApplication } from '../types';
import { 
  ShieldCheck, 
  Users, 
  ShieldAlert, 
  CheckCircle2, 
  UserX, 
  FileText, 
  Eye, 
  Check, 
  X, 
  Compass, 
  Clock, 
  Calendar, 
  MapPin, 
  ClipboardCheck, 
  AlertCircle,
  ArrowRight,
  Star
} from 'lucide-react';
import * as motion from 'motion/react-client';

interface AdminPortalProps {
  users: User[];
  verifyUser: (userId: string) => void;
  rejectUser: (userId: string) => void;
  rides: Ride[];
  welfareApplications: WelfareApplication[];
  updateWelfareStatus: (appId: string, status: 'approved' | 'rejected') => void;
  exeatApplications: ExeatApplication[];
  updateExeatStatus: (appId: string, status: 'approved' | 'rejected') => void;
}

export default function AdminPortal({ 
  users, 
  verifyUser,
  rejectUser,
  rides = [], 
  welfareApplications = [], 
  updateWelfareStatus,
  exeatApplications = [], 
  updateExeatStatus
}: AdminPortalProps) {
  const [mainTab, setMainTab] = useState<'users' | 'approvals' | 'rides'>('users');
  
  // Sub-tabs
  const [userSubTab, setUserSubTab] = useState<'pending' | 'verified'>('pending');
  const [approvalsSubTab, setApprovalsSubTab] = useState<'welfare' | 'exeat'>('welfare');
  const [ridesSubTab, setRidesSubTab] = useState<'posted' | 'booked' | 'completed'>('posted');

  // Selected document for simulation modal
  const [selectedDoc, setSelectedDoc] = useState<{
    studentName: string;
    matricNo: string;
    fileName: string;
    type: 'welfare' | 'exeat';
    fileDataURL?: string;
  } | null>(null);

  // User list logic
  const handleVerify = (userId: string) => {
    verifyUser(userId);
  };

  const handleReject = (userId: string) => {
    rejectUser(userId);
  };

  const displayedUsers = users.filter(u => userSubTab === 'pending' ? u.status === 'pending' : u.status === 'verified');

  // Approvals operations
  const handleWelfareAction = (userId: string, status: 'approved' | 'rejected') => {
    updateWelfareStatus(userId, status);
  };

  const handleExeatAction = (userId: string, status: 'approved' | 'rejected') => {
    updateExeatStatus(userId, status);
  };

  // Student booking details parsing
  const studentBookings = useMemo(() => {
    const list: { 
      id: string; 
      driver: string; 
      type: string; 
      studentName: string; 
      pickup: string; 
      dropoff: string; 
      time: string; 
      seats: number;
    }[] = [];
    rides.forEach(r => {
      const grouped: { [key: string]: { name: string; pickup: string; destination: string; time: string; count: number } } = {};
      r.passengers.forEach(p => {
        const key = `${p.id}-${p.destination || ''}-${p.time || ''}-${p.pickup || ''}`;
        if (!grouped[key]) {
          grouped[key] = {
            name: p.name,
            pickup: p.pickup || r.from,
            destination: p.destination || r.to,
            time: p.time || r.depart,
            count: 0
          };
        }
        grouped[key].count += 1;
      });

      Object.entries(grouped).forEach(([key, val], idx) => {
        list.push({
          id: `${r.id}-${idx}`,
          driver: r.driver,
          type: r.type,
          studentName: val.name,
          pickup: val.pickup,
          dropoff: val.destination && val.destination !== 'Any Destination' ? val.destination : (r.to || 'Any Destination'),
          time: val.time,
          seats: val.count
        });
      });
    });
    return list;
  }, [rides]);

  // Split calculations
  const welfarePendingCount = welfareApplications.filter(a => a.status === 'pending').length;
  const exeatPendingCount = exeatApplications.filter(a => a.status === 'pending').length;
  const totalApprovalsPending = welfarePendingCount + exeatPendingCount;

  const usersPendingCount = users.filter(u => u.status === 'pending').length;

  return (
    <div className="flex-1 bg-[#fcfcfc] py-16 relative w-full h-full min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        
        {/* Page Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-black mb-3">
              Admin Portal.
            </h1>
            <p className="text-gray-500 font-bold text-sm">
              Verify accounts, review student welfare & exeat clearance uploads, and audit real-time rides.
            </p>
          </div>
          
          <div className="flex gap-2 bg-gray-100/50 p-1.5 rounded-2xl border border-gray-200/50 self-start md:self-auto">
            <div className="text-center px-4 py-2 bg-white rounded-xl border border-gray-200/40 shadow-sm">
              <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest">Active Rides</span>
              <span className="text-lg font-black text-black">{rides.filter(r => r.status === 'active').length}</span>
            </div>
            <div className="text-center px-4 py-2 bg-white rounded-xl border border-gray-200/40 shadow-sm animate-pulse">
              <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest">Doc Tasks</span>
              <span className="text-lg font-black text-amber-600">{totalApprovalsPending}</span>
            </div>
          </div>
        </div>

        {/* Master Navigation Tabs */}
        <div className="flex border-b border-gray-200 pb-px mb-12 overflow-x-auto hide-scrollbar gap-8">
          <button 
            onClick={() => setMainTab('users')}
            className={`pb-4 font-bold text-xs uppercase tracking-widest transition-all border-b-2 relative flex items-center gap-2 ${mainTab === 'users' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
          >
            User Accounts
            {usersPendingCount > 0 && (
              <span className="bg-black text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full leading-none">
                {usersPendingCount}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => setMainTab('approvals')}
            className={`pb-4 font-bold text-xs uppercase tracking-widest transition-all border-b-2 relative flex items-center gap-2 ${mainTab === 'approvals' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
          >
            Pending Approvals
            {totalApprovalsPending > 0 && (
              <span className="bg-[#e05252] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none">
                {totalApprovalsPending}
              </span>
            )}
          </button>

          <button 
            onClick={() => setMainTab('rides')}
            className={`pb-4 font-bold text-xs uppercase tracking-widest transition-all border-b-2 relative flex items-center gap-2 ${mainTab === 'rides' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
          >
            Review Rides
          </button>
        </div>


        {/* ======================= SECTION 1: USERS SECTION ======================= */}
        {mainTab === 'users' && (
          <div>
            <div className="flex mb-8 overflow-x-auto hide-scrollbar gap-2">
              <button 
                onClick={() => setUserSubTab('pending')}
                className={`px-5 py-2.5 font-bold text-xs tracking-widest uppercase transition-all rounded-xl border ${userSubTab === 'pending' ? 'bg-black text-white border-black shadow-md' : 'bg-white border-gray-200 text-gray-400 hover:text-black'}`}
              >
                Pending Registrations ({usersPendingCount})
              </button>
              <button 
                onClick={() => setUserSubTab('verified')}
                className={`px-5 py-2.5 font-bold text-xs tracking-widest uppercase transition-all rounded-xl border ${userSubTab === 'verified' ? 'bg-black text-white border-black shadow-md' : 'bg-white border-gray-200 text-gray-400 hover:text-black'}`}
              >
                Verified Accounts
              </button>
            </div>

            <div className="min-h-[300px]">
              {displayedUsers.length === 0 ? (
                <div className="py-20 text-center bg-white border border-gray-100 rounded-3xl shadow-sm">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-1">Roster Empty</h3>
                  <p className="text-gray-400 text-sm max-w-xs mx-auto">No accounts currently match this filter criteria.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {displayedUsers.map((u, i) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.04 }}
                      key={u.id} 
                      className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:shadow-md hover:-translate-y-0.5 border border-gray-100 bg-white rounded-3xl transition-all duration-300 group hover:border-gray-200"
                    >
                      <div className="flex items-center gap-5">
                        <div className="bg-gray-50 w-12 h-12 flex items-center justify-center text-xl border border-gray-100 rounded-xl group-hover:bg-white group-hover:shadow-sm transition-all duration-300">
                          {u.role === 'student' ? '🎓' : u.role === 'admin' ? '🛡️' : '🚘'}
                        </div>
                        <div>
                          <div className="text-black font-black text-base flex flex-wrap items-center gap-2">
                            {u.name}
                            <span className={`text-[9px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full border ${
                              u.role === 'student' ? 'bg-gray-50 text-gray-500 border-gray-200' : 
                              u.role === 'admin' ? 'bg-black text-white border-black' : 
                              'bg-indigo-50 text-indigo-700 border-indigo-100'
                            }`}>
                              {u.role === 'driver' ? `${u.driverType} Driver` : u.role}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400 font-bold mt-0.5">{u.email}</div>
                        </div>
                      </div>
                      
                      {userSubTab === 'pending' && (
                        <div className="flex space-x-2 w-full sm:w-auto mt-2 sm:mt-0">
                          <button 
                            onClick={() => handleVerify(u.id)}
                            className="flex-1 sm:flex-none flex justify-center items-center gap-1.5 px-4 h-11 bg-black text-white font-bold text-xs uppercase tracking-widest hover:bg-gray-800 transition-all rounded-xl shadow-sm hover:shadow active:scale-95"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Verify
                          </button>
                          <button 
                            onClick={() => handleReject(u.id)}
                            className="flex-1 sm:flex-none flex justify-center items-center gap-1.5 px-4 h-11 bg-white text-gray-500 border border-gray-200 hover:text-black hover:border-black font-bold text-xs uppercase tracking-widest transition-all rounded-xl active:scale-95 hover:bg-gray-50"
                          >
                            <UserX className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      )}
                      
                      {userSubTab === 'verified' && (
                        <div className="text-black flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold border border-emerald-100 px-3.5 py-1.5 bg-emerald-50 text-emerald-700 rounded-full select-none">
                          <ShieldAlert className="w-3 h-3" /> Active Security Approved
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}


        {/* ======================= SECTION 2: APPROVALS SECTION ======================= */}
        {mainTab === 'approvals' && (
          <div>
            <div className="flex mb-8 overflow-x-auto hide-scrollbar gap-2">
              <button 
                onClick={() => setApprovalsSubTab('welfare')}
                className={`px-5 py-2.5 font-bold text-xs tracking-widest uppercase transition-all rounded-xl border relative ${approvalsSubTab === 'welfare' ? 'bg-black text-white border-black shadow-md' : 'bg-white border-gray-200 text-gray-400 hover:text-black'}`}
              >
                Welfare Requests ({welfarePendingCount})
                {welfarePendingCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#e05252] text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full leading-none">
                    {welfarePendingCount}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setApprovalsSubTab('exeat')}
                className={`px-5 py-2.5 font-bold text-xs tracking-widest uppercase transition-all rounded-xl border relative ${approvalsSubTab === 'exeat' ? 'bg-black text-white border-black shadow-md' : 'bg-white border-gray-200 text-gray-400 hover:text-black'}`}
              >
                Exeat Clearances ({exeatPendingCount})
                {exeatPendingCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#e05252] text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full leading-none">
                    {exeatPendingCount}
                  </span>
                )}
              </button>
            </div>

            <div className="min-h-[300px]">
              {approvalsSubTab === 'welfare' && (
                <div className="grid gap-4">
                  {welfareApplications.length === 0 ? (
                    <div className="py-20 text-center bg-white border border-gray-100 rounded-3xl shadow-sm">
                      <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-400 font-bold text-sm">No welfare applications logged yet.</p>
                    </div>
                  ) : (
                    welfareApplications.map((app, i) => {
                      const associatedUser = users.find(u => u.id === app.id);
                      return (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          key={app.id}
                          className="p-6 bg-white border border-gray-100 hover:border-gray-200 transition-all rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md"
                        >
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="bg-blue-50 text-blue-800 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg">
                                Welfare Route App
                              </div>
                              <span className={`text-[10px] font-black uppercase tracking-widest border px-2.5 py-0.5 rounded-full ${
                                app.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                app.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                'bg-red-50 text-red-700 border-red-100'
                              }`}>
                                {app.status}
                              </span>
                            </div>
                            
                            <div>
                              <h4 className="text-lg font-black text-black">{app.firstName} {app.lastName}</h4>
                              <div className="text-xs text-gray-500 font-bold mt-1 flex flex-wrap items-center gap-3">
                                <span>Matric: <b className="text-black font-semibold">{app.matricNo}</b></span>
                                <span>•</span>
                                <span>Email: <b className="text-black font-semibold">{associatedUser?.email || "N/A"}</b></span>
                              </div>
                            </div>

                            <button
                              onClick={() => setSelectedDoc({
                                studentName: `${app.firstName} ${app.lastName}`,
                                matricNo: app.matricNo,
                                fileName: app.fileName,
                                type: 'welfare',
                                fileDataURL: app.fileDataURL
                              })}
                              className="inline-flex items-center gap-2 text-xs text-black font-black uppercase tracking-wider bg-gray-50 hover:bg-gray-100 border border-gray-200/50 px-3.5 py-2 rounded-xl transition-all"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              View Submitted Doc
                            </button>
                          </div>

                          {app.status === 'pending' && (
                            <div className="flex gap-2 w-full md:w-auto">
                              <button 
                                onClick={() => handleWelfareAction(app.id, 'approved')}
                                className="flex-1 md:flex-none inline-flex items-center justify-center gap-1 bg-black text-white hover:bg-gray-800 text-xs font-bold uppercase tracking-widest px-4 py-3 rounded-xl transition-all active:scale-95 shadow-sm"
                              >
                                <Check className="w-4 h-4" /> Approve
                              </button>
                              <button 
                                onClick={() => handleWelfareAction(app.id, 'rejected')}
                                className="flex-1 md:flex-none inline-flex items-center justify-center gap-1 bg-white text-gray-500 border border-gray-200 hover:text-black hover:border-black text-xs font-bold uppercase tracking-widest px-4 py-3 rounded-xl transition-all active:scale-95"
                              >
                                <X className="w-4 h-4" /> Reject
                              </button>
                            </div>
                          )}

                          {app.status === 'approved' && (
                            <div className="text-emerald-700 bg-emerald-50 font-black text-[10px] tracking-widest uppercase px-4 py-2 rounded-full border border-emerald-100 self-start md:self-auto select-none">
                              Cleared for Welfare Shuttle
                            </div>
                          )}

                          {app.status === 'rejected' && (
                            <div className="text-red-700 bg-red-50 font-black text-[10px] tracking-widest uppercase px-4 py-2 rounded-full border border-red-100 self-start md:self-auto select-none">
                              Application Rejected
                            </div>
                          )}
                        </motion.div>
                      );
                    })
                  )}
                </div>
              )}

              {approvalsSubTab === 'exeat' && (
                <div className="grid gap-4">
                  {exeatApplications.length === 0 ? (
                    <div className="py-20 text-center bg-white border border-gray-100 rounded-3xl shadow-sm">
                      <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-400 font-bold text-sm">No exeat applications logged yet.</p>
                    </div>
                  ) : (
                    exeatApplications.map((app, i) => {
                      const associatedUser = users.find(u => u.id === app.id);
                      return (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          key={app.id}
                          className="p-6 bg-white border border-gray-100 hover:border-gray-200 transition-all rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md"
                        >
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="bg-amber-50 text-amber-800 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg">
                                Campus Exeat Clearance
                              </div>
                              <span className={`text-[10px] font-black uppercase tracking-widest border px-2.5 py-0.5 rounded-full ${
                                app.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                app.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                'bg-red-50 text-red-700 border-red-100'
                              }`}>
                                {app.status}
                              </span>
                            </div>
                            
                            <div>
                              <h4 className="text-lg font-black text-black">{app.firstName} {app.lastName}</h4>
                              <div className="text-xs text-gray-500 font-bold mt-1 flex flex-wrap items-center gap-3">
                                <span>Matric: <b className="text-black font-semibold">{app.matricNo}</b></span>
                                <span>•</span>
                                <span>Email: <b className="text-black font-semibold">{associatedUser?.email || "N/A"}</b></span>
                              </div>
                            </div>

                            <button
                              onClick={() => setSelectedDoc({
                                studentName: `${app.firstName} ${app.lastName}`,
                                matricNo: app.matricNo,
                                fileName: app.fileName,
                                type: 'exeat',
                                fileDataURL: app.fileDataURL
                              })}
                              className="inline-flex items-center gap-2 text-xs text-black font-black uppercase tracking-wider bg-gray-50 hover:bg-gray-100 border border-gray-200/50 px-3.5 py-2 rounded-xl transition-all"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              View Submitted Doc
                            </button>
                          </div>

                          {app.status === 'pending' && (
                            <div className="flex gap-2 w-full md:w-auto">
                              <button 
                                onClick={() => handleExeatAction(app.id, 'approved')}
                                className="flex-1 md:flex-none inline-flex items-center justify-center gap-1 bg-black text-white hover:bg-gray-800 text-xs font-bold uppercase tracking-widest px-4 py-3 rounded-xl transition-all active:scale-95 shadow-sm"
                              >
                                <Check className="w-4 h-4" /> Approve
                              </button>
                              <button 
                                onClick={() => handleExeatAction(app.id, 'rejected')}
                                className="flex-1 md:flex-none inline-flex items-center justify-center gap-1 bg-white text-gray-500 border border-gray-200 hover:text-black hover:border-black text-xs font-bold uppercase tracking-widest px-4 py-3 rounded-xl transition-all active:scale-95"
                              >
                                <X className="w-4 h-4" /> Reject
                              </button>
                            </div>
                          )}

                          {app.status === 'approved' && (
                            <div className="text-emerald-700 bg-emerald-50 font-black text-[10px] tracking-widest uppercase px-4 py-2 rounded-full border border-emerald-100 self-start md:self-auto select-none">
                              Cleared for Boarding Out of Campus
                            </div>
                          )}

                          {app.status === 'rejected' && (
                            <div className="text-red-700 bg-red-50 font-black text-[10px] tracking-widest uppercase px-4 py-2 rounded-full border border-red-100 self-start md:self-auto select-none">
                              Clearance Rejected
                            </div>
                          )}
                        </motion.div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        )}


        {/* ======================= SECTION 3: REVIEW RIDES SECTION ======================= */}
        {mainTab === 'rides' && (
          <div>
            {rides.filter(r => r.status === 'completed').length === 0 ? (
              <div className="py-20 text-center bg-white border border-gray-100 rounded-3xl shadow-sm">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-450">
                  <Star className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-black mb-1">No Completed Rides</h3>
                <p className="text-gray-400 text-sm max-w-xs mx-auto font-medium">The review rides section is empty until driver rides have actually been completed.</p>
              </div>
            ) : (
              <>
                <div className="flex mb-8 overflow-x-auto hide-scrollbar gap-2">
                  <button 
                    onClick={() => setRidesSubTab('posted')}
                    className={`px-5 py-2.5 font-bold text-xs tracking-widest uppercase transition-all rounded-xl border ${ridesSubTab === 'posted' ? 'bg-black text-white border-black shadow-md' : 'bg-white border-gray-200 text-gray-400 hover:text-black'}`}
                  >
                    Drivers' Posted Rides ({rides.length})
                  </button>
                  <button 
                    onClick={() => setRidesSubTab('booked')}
                    className={`px-5 py-2.5 font-bold text-xs tracking-widest uppercase transition-all rounded-xl border ${ridesSubTab === 'booked' ? 'bg-black text-white border-black shadow-md' : 'bg-white border-gray-200 text-gray-400 hover:text-black'}`}
                  >
                    Students' Booked Tickets ({studentBookings.length})
                  </button>
                  <button 
                    onClick={() => setRidesSubTab('completed')}
                    className={`px-5 py-2.5 font-bold text-xs tracking-widest uppercase transition-all rounded-xl border ${ridesSubTab === 'completed' ? 'bg-black text-white border-black shadow-md' : 'bg-white border-gray-200 text-gray-400 hover:text-black'}`}
                  >
                    Completed Rides ({rides.filter(r => r.status === 'completed').length})
                  </button>
                </div>

                <div className="min-h-[300px]">
                  {ridesSubTab === 'posted' && (
                    <div className="grid gap-4">
                      {rides.length === 0 ? (
                        <div className="py-20 text-center bg-white border border-gray-100 rounded-3xl shadow-sm">
                          <p className="text-gray-400 font-bold text-sm">No drivers have posted any shuttle routes yet.</p>
                        </div>
                      ) : (
                        rides.map((r, idx) => (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={r.id || idx}
                            className="p-6 bg-white border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all rounded-3xl"
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="space-y-2">
                                <div className="flex flex-wrap gap-2 items-center">
                                  <span className="text-[10px] font-black uppercase tracking-widest bg-gray-50 border border-gray-200/50 px-2.5 py-1 text-gray-600 rounded-lg">
                                    ID: #{r.id}
                                  </span>
                                  <span className={`text-[10px] font-black uppercase tracking-widest border px-2.5 py-0.5 rounded-full ${
                                    r.type === 'welfare' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                    r.type === 'out_of_campus' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                    'bg-gray-100 text-gray-700 border-gray-200'
                                  }`}>
                                    {r.type.replace('_', ' ')}
                                  </span>
                                  <span className={`text-[10px] font-black uppercase tracking-widest border px-2.5 py-0.5 rounded-full ${
                                    r.status === 'completed' ? 'bg-gray-50 border-gray-200 text-gray-400' :
                                    r.status === 'active' ? 'bg-black text-white border-black' :
                                    'bg-white text-black border-black'
                                  }`}>
                                    {r.status}
                                  </span>
                                </div>

                                <h3 className="text-base font-black text-black flex items-center gap-2 mt-2">
                                  {r.from} <ArrowRight className="w-4 h-4 text-gray-400" /> {r.to}
                                </h3>

                                <div className="text-xs text-gray-500 font-medium grid grid-cols-2 lg:grid-cols-4 gap-y-1 gap-x-6 pt-1">
                                  <div>Driver: <b className="text-black font-bold">{r.driver}</b></div>
                                  <div>Departs: <b className="text-black font-bold">{r.depart}</b></div>
                                  <div>Price: <b className="text-black font-bold">₦{r.price}</b></div>
                                  <div>Remaining Seats: <b className="text-black font-bold">{r.seats} seats available</b></div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  )}

                  {ridesSubTab === 'booked' && (
                    <div className="grid gap-4">
                      {studentBookings.length === 0 ? (
                        <div className="py-20 text-center bg-white border border-gray-100 rounded-3xl shadow-sm">
                          <p className="text-gray-400 font-bold text-sm">No active student bookings captured yet.</p>
                        </div>
                      ) : (
                        studentBookings.map((bk, idx) => (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={bk.id || idx}
                            className="p-6 bg-white border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                          >
                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-black uppercase tracking-widest bg-gray-50 border border-gray-200 border-dashed px-2.5 py-1 text-gray-600 rounded-lg">
                                  Ticket Code: #{bk.id}
                                </span>
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                                  bk.type === 'welfare' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                  bk.type === 'out_of_campus' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                  'bg-gray-100 text-gray-700 border-gray-200'
                                }`}>
                                  {bk.type.replace('_', ' ')}
                                </span>
                              </div>

                              <h3 className="text-lg font-black text-black mt-2">
                                Rider: {bk.studentName} {bk.seats > 1 ? `(${bk.seats} seats booked)` : ''}
                              </h3>

                              <div className="text-xs text-gray-500 font-semibold grid grid-cols-1 md:grid-cols-3 gap-2 pt-1.5">
                                <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-black" /> From: <span className="text-black font-bold">{bk.pickup}</span></div>
                                <div className="flex items-center gap-1.5"><Compass className="w-3.5 h-3.5 text-black" /> To: <span className="text-black font-bold">{bk.dropoff}</span></div>
                                <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-black" /> Requested Time: <span className="text-black font-bold">{bk.time}</span></div>
                              </div>
                            </div>

                            <div className="text-right border-t md:border-t-0 border-gray-100 pt-3 md:pt-0">
                              <span className="block text-[9px] text-gray-400 uppercase tracking-widest font-black">Driver Service</span>
                              <span className="font-bold text-sm text-black block mt-0.5">{bk.driver}</span>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  )}

                  {ridesSubTab === 'completed' && (
                    <div className="grid gap-4">
                      {rides.filter(r => r.status === 'completed').length === 0 ? (
                        <div className="py-20 text-center bg-white border border-gray-100 rounded-3xl shadow-sm">
                          <p className="text-gray-400 font-bold text-sm">No rides have reached "Completed" status yet.</p>
                        </div>
                      ) : (
                        rides.filter(r => r.status === 'completed').map((r, idx) => (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={r.id || idx}
                            className="p-6 bg-gray-50/50 border border-gray-200/60 rounded-3xl relative overflow-hidden"
                          >
                            <div className="absolute right-6 top-6 opacity-10 font-black text-6xl italic select-none">
                              DONE
                            </div>
                            <div className="space-y-2">
                              <div className="flex gap-2 items-center">
                                <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-100 border border-emerald-200/50 px-2.5 py-1 text-emerald-800 rounded-lg">
                                  ID: #{r.id} Completed
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 bg-gray-100 border border-gray-200 text-gray-500 rounded-full">
                                  ⭐ Rating: {r.rating}
                                </span>
                              </div>

                              <h3 className="text-base font-black text-black flex items-center gap-2 mt-2">
                                {r.from} <ArrowRight className="w-4 h-4 text-gray-400" /> {(() => {
                                  const dests = r.passengers
                                    .map(p => p.destination)
                                    .filter((d, i, self) => d && d.trim() !== '' && d !== 'Any Destination' && self.indexOf(d) === i);
                                  return dests.length > 0 ? dests.join(', ') : (r.to || 'Any Destination');
                                })()}
                              </h3>

                              <div className="text-xs text-gray-500 font-medium grid grid-cols-2 lg:grid-cols-4 gap-y-1 gap-x-6 pt-1">
                                <div>Driver: <b className="text-black font-bold">{r.driver}</b></div>
                                <div>Final Price: <b className="text-black font-bold">₦{r.price}</b></div>
                                <div>Departed At: <b className="text-black font-bold">{r.depart}</b></div>
                                <div>Ticket Count: <b className="text-black font-bold">{r.passengers.length} Booked</b></div>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

      </div>


      {/* ======================= REUSABLE INTEGRATED DOCUMENT VIEWER MODAL ======================= */}
      {selectedDoc && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-white rounded-3xl border border-gray-100 max-w-2xl w-full overflow-hidden shadow-2xl relative`}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <span className="text-[9px] uppercase tracking-widest font-black text-indigo-600 block mb-0.5">
                  SECURE DOCUMENT AUDITOR
                </span>
                <h3 className="text-lg font-black text-black">
                  {selectedDoc.type === 'welfare' ? 'Welfare Request File' : 'Exeat Signed File'}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedDoc(null)}
                className="p-1.5 rounded-full bg-gray-200/60 hover:bg-gray-200 transition-all text-gray-500 hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Document Auditor Body */}
            <div className="p-8 bg-gray-100/40 border-b border-gray-100 min-h-[280px]">
              {/* Submission Metadata Block */}
              <div className="bg-white border border-gray-200/80 shadow-sm p-5 rounded-2xl mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest font-black text-gray-400 block mb-1">Student Name</span>
                    <span className="text-xs font-black text-black">{selectedDoc.studentName}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-widest font-black text-gray-400 block mb-1">Matric Number</span>
                    <span className="text-xs font-mono font-bold text-gray-800">{selectedDoc.matricNo}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-widest font-black text-gray-400 block mb-1">Document File</span>
                    <span className="text-xs font-bold text-gray-800 truncate block" title={selectedDoc.fileName}>{selectedDoc.fileName}</span>
                  </div>
                </div>
              </div>

              {/* Live Document Preview of the actual file (No Dummy Card) */}
              <div className="flex flex-col bg-white border border-gray-200/80 shadow-md p-6 rounded-2xl justify-between min-h-[300px]">
                <div className="border-b border-gray-100 pb-3">
                  <span className="text-[9px] uppercase tracking-widest font-black text-emerald-600 block mb-0.5">
                    LIVE ATTACHMENT VIEW
                  </span>
                  <h4 className="text-xs font-black text-black">Actual Submitted Document</h4>
                </div>

                <div className="flex-1 flex items-center justify-center bg-gray-50 border border-gray-200/60 rounded-xl overflow-hidden p-3 my-4 min-h-[220px]">
                  {selectedDoc.fileDataURL ? (
                    selectedDoc.fileDataURL.startsWith('data:image/') ? (
                      <img 
                        src={selectedDoc.fileDataURL} 
                        alt={selectedDoc.fileName}
                        referrerPolicy="no-referrer"
                        className="max-h-[220px] max-w-full object-contain rounded-lg border shadow-sm"
                      />
                    ) : selectedDoc.fileDataURL.startsWith('data:application/pdf') || selectedDoc.fileDataURL.includes('pdf') || selectedDoc.fileDataURL.startsWith('data:application/octet-stream') ? (
                      <div className="text-center p-4">
                        <div className="w-12 h-12 bg-rose-50 text-rose-500 border border-rose-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <FileText className="w-6 h-6" />
                        </div>
                        <p className="text-xs text-black font-bold mb-1">Signed Document Loaded</p>
                        <p className="text-[10px] text-gray-400 font-bold max-w-[200px] mx-auto truncate mb-4">{selectedDoc.fileName}</p>
                        <a 
                          href={selectedDoc.fileDataURL}
                          download={selectedDoc.fileName}
                          className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-black bg-black text-white px-4 py-2.5 rounded-xl hover:bg-gray-800 transition-all text-center"
                        >
                          Download Attached File
                        </a>
                      </div>
                    ) : (
                      <div className="text-center p-4">
                        <div className="w-12 h-12 bg-gray-100 text-gray-500 border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                          <FileText className="w-6 h-6" />
                        </div>
                        <p className="text-xs text-black font-bold mb-1">Attachment File Loaded</p>
                        <p className="text-[10px] text-gray-400 font-bold max-w-[200px] mx-auto truncate mb-4">{selectedDoc.fileName}</p>
                        <a 
                          href={selectedDoc.fileDataURL}
                          download={selectedDoc.fileName}
                          className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-black bg-black text-white px-4 py-2.5 rounded-xl hover:bg-gray-800 transition-all text-center"
                        >
                          Download File
                        </a>
                      </div>
                    )
                  ) : (
                    <div className="text-center p-4 text-gray-400">
                      <FileText className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                      <p className="text-xs font-bold text-black">No live preview uploaded</p>
                      <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">{selectedDoc.fileName}</p>
                    </div>
                  )}
                </div>

                {selectedDoc.fileDataURL && (
                  <div className="flex gap-2">
                    <a 
                      href={selectedDoc.fileDataURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-center py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-black text-[10px] font-black uppercase tracking-wider text-black rounded-xl transition-all"
                    >
                      Open File in New Tab ↗
                    </a>
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-white flex justify-end">
              <button 
                onClick={() => setSelectedDoc(null)}
                className="w-full bg-black text-white hover:bg-gray-800 h-12 font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                Close Document Audit
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
