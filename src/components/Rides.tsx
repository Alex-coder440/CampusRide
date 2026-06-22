import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, MapPin, Calendar, Clock, Users, ArrowRight, Star, Car, User, X, Upload } from 'lucide-react';
import * as motion from 'motion/react-client';
import { Ride, RideType, WelfareApplication, ExeatApplication } from '../types';

const validLocations = [
  "Shuttle Stand",
  "CMSS Building",
  "CST Building",
  "Lecture Theater",
  "Engineering Building",
  "Stadium",
  "CAF 2",
  "Main Gate",
  "Canaan Land gate"
];

interface RidesProps {
  setCurrentView?: (view: any) => void;
  user?: import('../types').User | null;
  rides?: Ride[];
  bookRide?: (id: string, seats?: number, dest?: string, time?: string, pickup?: string) => void;
  welfareApplications?: WelfareApplication[];
  submitWelfare?: (firstName: string, lastName: string, matricNo: string, fileName: string, fileDataURL?: string) => void;
  exeatApplications?: ExeatApplication[];
  submitExeat?: (firstName: string, lastName: string, matricNo: string, fileName: string, fileDataURL?: string) => void;
}

const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

export default function Rides({ 
  setCurrentView, 
  user, 
  rides = [], 
  bookRide,
  welfareApplications = [],
  submitWelfare,
  exeatApplications = [],
  submitExeat
}: RidesProps) {
  const [pickup, setPickup] = useState('');
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'available' | 'bookings' | 'welfare' | 'exeat'>('available');
  const [bookingDropoff, setBookingDropoff] = useState('');
  const [bookingPickup, setBookingPickup] = useState('');
  const [bookingSeats, setBookingSeats] = useState(1);
  const [bookingTime, setBookingTime] = useState('');
  
  const [welfareFirstName, setWelfareFirstName] = useState('');
  const [welfareLastName, setWelfareLastName] = useState('');
  const [welfareMatric, setWelfareMatric] = useState('');

  const [exeatFirstName, setExeatFirstName] = useState('');
  const [exeatLastName, setExeatLastName] = useState('');
  const [exeatMatric, setExeatMatric] = useState('');
  const [exeatUploadedFile, setExeatUploadedFile] = useState<File | null>(null);
  const exeatFileInputRef = useRef<HTMLInputElement>(null);

  const [paymentRidePayload, setPaymentRidePayload] = useState<{ id: string, seats: number, dropoff: string, time: string, pickup: string, total: number } | null>(null);
  const [paymentStep, setPaymentStep] = useState<'details' | 'processing' | 'success'>('details');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Automatically fill student details from existing applications (if entered before) or user profile
  useEffect(() => {
    if (!user) return;

    const existingWelfare = welfareApplications.find(a => a.id === user.id);
    const existingExeat = exeatApplications.find(a => a.id === user.id);

    const savedFirstName = existingWelfare?.firstName || existingExeat?.firstName || '';
    const savedLastName = existingWelfare?.lastName || existingExeat?.lastName || '';
    const savedMatric = existingWelfare?.matricNo || existingExeat?.matricNo || '';

    let fallbackFirst = '';
    let fallbackLast = '';
    if (user.name) {
      const parts = user.name.trim().split(/\s+/);
      fallbackFirst = parts[0] || '';
      fallbackLast = parts.slice(1).join(' ') || '';
    }

    setWelfareFirstName(prev => prev || savedFirstName || fallbackFirst);
    setWelfareLastName(prev => prev || savedLastName || fallbackLast);
    setWelfareMatric(prev => prev || savedMatric);

    setExeatFirstName(prev => prev || savedFirstName || fallbackFirst);
    setExeatLastName(prev => prev || savedLastName || fallbackLast);
    setExeatMatric(prev => prev || savedMatric);
  }, [user, welfareApplications, exeatApplications]);

  const activeWelfare = useMemo(() => welfareApplications.find(a => a.id === user?.id), [welfareApplications, user]);
  const welfareSubmitted = !!activeWelfare;
  const welfareApproved = activeWelfare?.status === 'approved';

  const activeExeat = useMemo(() => exeatApplications.find(a => a.id === user?.id), [exeatApplications, user]);
  const exeatSubmitted = !!activeExeat;
  const exeatApproved = activeExeat?.status === 'approved';

  const filteredRides = useMemo(() => {
    return rides.filter((ride) => {
      // Students should only see rides that are scheduled
      if (ride.status !== 'scheduled') {
        return false;
      }

      // If the user is already booked on this ride, they shouldn't see it in Available Rides
      if (user && ride.passengers.some(p => p.id === user.id)) {
        return false;
      }

      const pickupMatch = pickup === '' || ride.from.toLowerCase() === pickup.toLowerCase().trim() || ride.type === 'welfare';
      return pickupMatch;
    });
  }, [pickup, rides, user]);

  return (
    <div className="flex-1 bg-white py-12 relative w-full h-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-black mb-4">
            {user && user.role === 'student' ? 'Student Portal' : 'Available Rides'}
          </h1>
          <p className="text-gray-600 font-medium text-lg max-w-2xl">
            {user && user.role === 'student' ? 'Welcome back! Find and book a ride that works for your schedule.' : 'Find and book a ride that works for your schedule'}
          </p>
        </div>

        {user && user.role === 'student' && (
          <div className="flex space-x-8 mb-12 border-b border-gray-200 pb-px overflow-x-auto hide-scrollbar">
            <button 
              onClick={() => setActiveTab('available')}
              className={`pb-4 font-bold text-xs uppercase tracking-widest transition-all border-b-2 ${activeTab === 'available' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
            >
              Available Rides
            </button>
            <button 
              onClick={() => setActiveTab('bookings')}
              className={`pb-4 font-bold text-xs uppercase tracking-widest transition-all border-b-2 ${activeTab === 'bookings' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
            >
              My Bookings
            </button>
            <button 
              onClick={() => setActiveTab('welfare')}
              className={`pb-4 font-bold text-xs uppercase tracking-widest transition-all border-b-2 ${activeTab === 'welfare' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
            >
              Welfare
            </button>
            <button 
              onClick={() => setActiveTab('exeat')}
              className={`pb-4 font-bold text-xs uppercase tracking-widest transition-all border-b-2 ${activeTab === 'exeat' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
            >
              Exeat
            </button>
          </div>
        )}

        {activeTab === 'available' && (
          <>
            {/* Filters */}
            <div className="mb-16 flex flex-col lg:flex-row gap-6 lg:items-end w-full">
          <div className="flex-1 w-full space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Pickup</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-black transition-colors" />
              <select
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 focus:border-black outline-none transition-all text-black appearance-none rounded-xl text-sm font-bold shadow-sm hover:shadow-md cursor-pointer"
              >
                <option value="">Any pickup spot</option>
                {validLocations.map((loc, idx) => (
                  <option key={idx} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {filteredRides.length === 0 ? (
          <div className="text-center py-24 mb-12">
            <h3 className="text-3xl font-black text-black mb-4">No rides found.</h3>
            <p className="text-gray-500 max-w-sm mx-auto font-medium text-lg leading-relaxed">We couldn't find any rides matching your search criteria. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {filteredRides.map((ride, idx) => (
              <motion.div 
                key={ride.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="p-8 flex flex-col md:flex-row md:items-center justify-between bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 hover:-translate-y-1 rounded-3xl transition-all duration-300 group"
              >
                <div className="flex-1 pr-8">
                  <div className="flex items-center gap-4 mb-4">
                    {ride.type === 'within_campus' ? 
                      <span className="text-[10px] uppercase font-bold tracking-widest text-black">
                        Campus
                      </span> : ride.type === 'welfare' ?
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#0000ff]">
                        Welfare
                      </span> :
                      <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
                        Outside
                      </span>
                    }
                    <div className="h-1 w-1 bg-gray-300 rounded-full"></div>
                    <div className="flex items-center text-xs font-bold text-gray-500 uppercase tracking-widest">
                      {ride.depart}
                    </div>
                  </div>

                  <div className="flex flex-col mb-6">
                    <div className="text-[10px] bg-gray-100 text-gray-500 uppercase tracking-widest font-bold py-1 px-2 rounded-md self-start mb-2">Available At</div>
                    <div className="text-2xl font-black text-black">{ride.from}</div>
                  </div>

                  <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-black uppercase tracking-widest text-[10px]">Driver</span>
                      <span className="font-bold text-gray-700">{ride.driver}</span>
                      <span className="font-bold flex items-center text-[10px] ml-1 bg-gray-100 px-1.5 py-0.5">
                        <Star className="w-3 h-3 text-black fill-black mr-1" />
                        {ride.rating}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-bold mb:ml-auto">
                      <span className="uppercase tracking-widest text-[10px]">Seats</span>
                      <span className="text-gray-700">{ride.seats} remaining</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 md:mt-0 flex md:flex-col items-center md:items-end justify-between md:min-w-[150px]">
                  <div className="text-2xl sm:text-3xl font-black tracking-tighter text-black md:mb-4">
                    {ride.price === 0 ? 'Free' : `₦${ride.price.toLocaleString()}`}
                  </div>
                  <button 
                    onClick={() => {
                      if (!user) {
                        setCurrentView?.('login');
                      } else {
                        setBookingPickup('');
                        setBookingTime('');
                        setBookingSeats(1);
                        setBookingDropoff(ride.type === 'out_of_campus' ? 'Canaan Land gate' : '');
                        setSelectedRide(ride);
                      }
                    }}
                    className="px-8 py-4 bg-black text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-800 transition active:scale-95 shadow-md hover:shadow-xl"
                  >
                    {user ? 'Book Seat' : 'Log in to Book'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
          </>
        )}
        
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {rides.filter(r => r.passengers.some(p => p.id === user?.id)).length === 0 ? (
              <div className="text-center py-24 bg-gray-50/50 border border-gray-100 rounded-3xl mx-auto max-w-2xl">
                 <div className="inline-flex h-20 w-20 items-center justify-center bg-white shadow-sm border border-gray-100 rounded-full mb-6 text-black">
                   <Calendar className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-black text-black mb-2 tracking-tight">No bookings yet</h3>
                <p className="text-gray-500 max-w-sm mx-auto font-medium text-lg">You haven't booked any rides yet. Switch to Available Rides to find one.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {rides.filter(r => r.passengers.some(p => p.id === user?.id)).map((ride, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    key={ride.id} 
                    className="bg-white p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-gray-200 flex flex-col transition-all duration-300 group rounded-3xl"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-black shrink-0 group-hover:bg-black group-hover:text-white transition-colors duration-300">
                          <MapPin className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="font-bold text-black text-xl tracking-tight leading-tight">{ride.from}</div>
                          <div className="font-bold text-gray-500 text-sm leading-tight mt-1 items-center gap-1.5 flex flex-wrap">
                            <ArrowRight className="w-3 h-3 text-gray-400 group-hover:translate-x-1 transition-transform" /> {ride.passengers.find(p => p.id === user?.id)?.destination || 'Any Destination'}
                            {ride.passengers.find(p => p.id === user?.id)?.time && <span className="ml-2 bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest">{ride.passengers.find(p => p.id === user?.id)?.time}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mb-8">
                      <div className="flex items-center text-xs uppercase tracking-widest font-bold text-gray-500 gap-2 bg-gray-50 self-start px-3 py-1.5 rounded-lg border border-gray-100">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {ride.depart}
                      </div>
                      <div className="flex items-center text-xs uppercase tracking-widest font-bold text-gray-500 gap-2 bg-gray-50 self-start px-3 py-1.5 rounded-lg border border-gray-100">
                        <Users className="w-4 h-4 text-gray-400" />
                        {ride.passengers.filter(p => p.id === user?.id).length} Seat(s)
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-6 border-t border-gray-100 flex justify-between items-center text-sm font-bold">
                      <div className="text-gray-400 uppercase tracking-widest text-[#1a1a1a] flex items-center gap-1 bg-[#fcfcfc] px-3 py-1.5 rounded-lg border border-gray-100 text-xs shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                        <span className="text-gray-400 text-[10px]">TOTAL PRICE</span>
                        <span className="text-black ml-1 text-sm">₦{ride.price * ride.passengers.filter(p => p.id === user?.id).length}</span>
                      </div>
                      <div className={`px-4 py-1.5 text-[10px] tracking-widest uppercase rounded-full border flex items-center gap-1 ${
                        ride.status === 'completed' ? 'bg-gray-50 border-gray-200 text-gray-500' :
                        ride.status === 'active' ? 'bg-black text-white border-black shadow-md' :
                        'bg-white border-gray-300 text-black'
                      }`}>
                        {ride.status === 'completed' ? 'Completed' : ride.status === 'active' ? 'En Route' : 'Scheduled'}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'welfare' && (
          <div className="w-full max-w-2xl">
            <h2 className="text-2xl font-black text-black tracking-tight mb-8">Welfare Application</h2>
            {!welfareSubmitted ? (
              <form 
                className="bg-white border border-gray-100 rounded-3xl p-8 sm:p-10 shadow-sm"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!welfareFirstName || !welfareLastName || !welfareMatric || !uploadedFile) {
                    alert("Please fill all fields and upload your medical documentation.");
                    return;
                  }
                  try {
                    const dataUrl = await readFileAsDataURL(uploadedFile);
                    submitWelfare?.(welfareFirstName, welfareLastName, welfareMatric, uploadedFile.name, dataUrl);
                  } catch (err) {
                    console.error(err);
                    submitWelfare?.(welfareFirstName, welfareLastName, welfareMatric, uploadedFile.name);
                  }
                }}
              >
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">First Name</label>
                      <input 
                        key="welfare-first-name"
                        type="text" 
                        value={welfareFirstName}
                        onChange={(e) => setWelfareFirstName(e.target.value)}
                        className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 focus:border-black outline-none transition-all text-black rounded-xl text-sm font-bold placeholder-gray-400"
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Last Name</label>
                      <input 
                        key="welfare-last-name"
                        type="text" 
                        value={welfareLastName}
                        onChange={(e) => setWelfareLastName(e.target.value)}
                        className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 focus:border-black outline-none transition-all text-black rounded-xl text-sm font-bold placeholder-gray-400"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Matriculation Number</label>
                    <input 
                      key="welfare-matric"
                      type="text" 
                      value={welfareMatric}
                      onChange={(e) => setWelfareMatric(e.target.value)}
                      className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 focus:border-black outline-none transition-all text-black rounded-xl text-sm font-bold placeholder-gray-400"
                      placeholder="e.g. 19/1234"
                    />
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <label className="text-[10px] font-bold text-gray-500 block uppercase tracking-widest pl-1">Medical Documentation</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`border border-dashed p-8 rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all ${uploadedFile ? 'border-black bg-gray-50/50' : 'border-gray-200 bg-gray-50/30 hover:border-black hover:bg-gray-50'}`}
                    >
                      <input 
                        type="file" 
                        accept="image/*,.pdf" 
                        className="hidden" 
                        ref={fileInputRef}
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setUploadedFile(e.target.files[0]);
                          }
                        }}
                      />
                      {uploadedFile ? (
                        <div className="text-center">
                          <p className="text-black font-bold mb-1 max-w-[200px] truncate bg-white px-4 py-2 border border-gray-100 shadow-sm rounded-xl">{uploadedFile.name}</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-3">File attached</p>
                        </div>
                      ) : (
                        <div className="text-center text-gray-400 group">
                          <Upload className="w-8 h-8 mx-auto mb-4 text-gray-300 group-hover:text-black transition-colors" />
                          <p className="text-sm font-bold flex flex-col gap-1.5">
                            <span className="text-black">Click to upload report</span>
                            <span className="text-[10px] uppercase font-bold text-gray-400">PDF, JPG, PNG up to 5MB</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button type="submit" className="w-full h-14 bg-black text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all active:scale-95 shadow-md hover:shadow-xl mt-6">
                    Submit Application
                  </button>
                </div>
              </form>
            ) : welfareApproved ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 border border-emerald-100 p-8 rounded-3xl text-center"
              >
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="w-8 h-8 fill-current" />
                </div>
                <h3 className="text-2xl font-black text-emerald-900 mb-2">Welfare Approved!</h3>
                <p className="text-emerald-800 font-medium max-w-sm mx-auto mb-6">
                  Your welfare status has been approved and verified by campus security. You are now officially locked in to book within-campus welfare shuttles completely free of charge.
                </p>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-yellow-50 border border-yellow-105 p-8 rounded-3xl text-center"
              >
                <div className="w-16 h-16 bg-yellow-101 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-2xl font-black text-yellow-905 mb-2">Application Under Review</h3>
                <p className="text-yellow-800 font-medium max-w-sm mx-auto mb-6">
                   Your welfare application documentation is successfully submitted and under review. It must be approved by the admin before you can use welfare shuttles for free.
                </p>
              </motion.div>
            )}
          </div>
        )}

        {activeTab === 'exeat' && (
          <div className="w-full max-w-2xl">
            <h2 className="text-2xl font-black text-black tracking-tight mb-8">Exeat Application</h2>
            {!exeatSubmitted ? (
              <form 
                className="bg-white border border-gray-100 rounded-3xl p-8 sm:p-10 shadow-sm"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!exeatFirstName || !exeatLastName || !exeatMatric || !exeatUploadedFile) {
                    alert("Please fill all fields and upload your approved exeat documentation.");
                    return;
                  }
                  try {
                    const dataUrl = await readFileAsDataURL(exeatUploadedFile);
                    submitExeat?.(exeatFirstName, exeatLastName, exeatMatric, exeatUploadedFile.name, dataUrl);
                  } catch (err) {
                    console.error(err);
                    submitExeat?.(exeatFirstName, exeatLastName, exeatMatric, exeatUploadedFile.name);
                  }
                }}
              >
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">First Name</label>
                      <input 
                        key="exeat-first-name"
                        type="text" 
                        value={exeatFirstName}
                        onChange={(e) => setExeatFirstName(e.target.value)}
                        className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 focus:border-black outline-none transition-all text-black rounded-xl text-sm font-bold placeholder-gray-400"
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Last Name</label>
                      <input 
                        key="exeat-last-name"
                        type="text" 
                        value={exeatLastName}
                        onChange={(e) => setExeatLastName(e.target.value)}
                        className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 focus:border-black outline-none transition-all text-black rounded-xl text-sm font-bold placeholder-gray-400"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Matriculation Number</label>
                    <input 
                      key="exeat-matric"
                      type="text" 
                      value={exeatMatric}
                      onChange={(e) => setExeatMatric(e.target.value)}
                      className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 focus:border-black outline-none transition-all text-black rounded-xl text-sm font-bold placeholder-gray-400"
                      placeholder="e.g. 19/1234"
                    />
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <label className="text-[10px] font-bold text-gray-500 block uppercase tracking-widest pl-1">Approved Exeat Document</label>
                    <div 
                      onClick={() => exeatFileInputRef.current?.click()}
                      className={`border border-dashed p-8 rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all ${exeatUploadedFile ? 'border-black bg-gray-50/50' : 'border-gray-200 bg-gray-50/30 hover:border-black hover:bg-gray-50'}`}
                    >
                      <input 
                        type="file" 
                        accept="image/*,.pdf" 
                        className="hidden" 
                        ref={exeatFileInputRef}
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setExeatUploadedFile(e.target.files[0]);
                          }
                        }}
                      />
                      {exeatUploadedFile ? (
                        <div className="text-center">
                          <p className="text-black font-bold mb-1 max-w-[200px] truncate bg-white px-4 py-2 border border-gray-100 shadow-sm rounded-xl">{exeatUploadedFile.name}</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-3">File attached</p>
                        </div>
                      ) : (
                        <div className="text-center text-gray-400 group">
                          <Upload className="w-8 h-8 mx-auto mb-4 text-gray-300 group-hover:text-black transition-colors" />
                          <p className="text-sm font-bold flex flex-col gap-1.5">
                            <span className="text-black">Click to upload document</span>
                            <span className="text-[10px] uppercase font-bold text-gray-400">PDF, JPG, PNG up to 5MB</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button type="submit" className="w-full h-14 bg-black text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all active:scale-95 shadow-md hover:shadow-xl mt-6">
                    Submit Exeat Document
                  </button>
                </div>
              </form>
            ) : exeatApproved ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 border border-emerald-100 p-8 rounded-3xl text-center"
              >
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="w-8 h-8 fill-current" />
                </div>
                <h3 className="text-2xl font-black text-emerald-900 mb-2">Exeat Approved!</h3>
                <p className="text-emerald-800 font-medium max-w-sm mx-auto mb-6">
                  Your exeat certificate has been approved and verified. You are now officially cleared to book out-of-campus shuttle rides safely.
                </p>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-yellow-50 border border-yellow-105 p-8 rounded-3xl text-center"
              >
                <div className="w-16 h-16 bg-yellow-101 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-2xl font-black text-yellow-905 mb-2">Document Under Review</h3>
                <p className="text-yellow-800 font-medium max-w-sm mx-auto mb-6">
                   Your exeat documentation is successfully submitted and under review. It must be approved before you can book rides leaving campus.
                </p>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {selectedRide && activeTab === 'available' && (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen relative p-6 sm:p-10 w-full max-w-lg mx-auto flex flex-col justify-center py-16"
          >
            <button 
              onClick={() => { 
                if (paymentRidePayload && paymentStep === 'details') {
                  setPaymentRidePayload(null);
                } else if (paymentStep === 'success') {
                  setSelectedRide(null); 
                  setUploadedFile(null);
                  setPaymentRidePayload(null);
                  setPaymentStep('details');
                } else {
                  setSelectedRide(null); 
                  setUploadedFile(null); 
                }
              }}
              className="absolute top-6 right-6 text-gray-400 hover:text-black bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            {paymentRidePayload ? (
              <>
                <h2 className="text-3xl font-black text-black mb-8 tracking-tight">Payment Setup</h2>
                
                {paymentStep === 'details' && (
                  <div className="flex flex-col gap-6">
                    <div className="bg-gray-50 p-6 border border-gray-100 rounded-3xl flex flex-col gap-4 shadow-inner">
                      <div className="flex justify-between items-center pb-4 border-b border-gray-200/60">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Amount Due</span>
                        <span className="text-black font-black text-3xl">₦{paymentRidePayload.total}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-medium pt-2">
                        <span className="text-gray-500">Ride</span>
                        <span className="text-black">{selectedRide.from} to {paymentRidePayload.dropoff}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-medium">
                        <span className="text-gray-500">Seats</span>
                        <span className="text-black">{paymentRidePayload.seats} Ticket(s)</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="0000 0000 0000 0000"
                          maxLength={19}
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-black outline-none focus:border-black"
                        />
                      </div>
                      <div className="flex gap-4">
                        <div className="w-1/2 space-y-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Expiry (MM/YY)</label>
                          <input
                            type="text"
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-black outline-none focus:border-black"
                          />
                        </div>
                        <div className="w-1/2 space-y-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">CVV</label>
                          <input
                            type="password"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            placeholder="•••"
                            maxLength={3}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-black outline-none focus:border-black"
                          />
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        if (!cardNumber || !expiry || !cvv) {
                           alert('Please fill out all payment fields.');
                           return;
                        }
                        setPaymentStep('processing');
                        setTimeout(() => {
                          if (bookRide) bookRide(paymentRidePayload.id, paymentRidePayload.seats, paymentRidePayload.dropoff, paymentRidePayload.time, paymentRidePayload.pickup);
                          setPaymentStep('success');
                        }, 2000);
                      }}
                      className="w-full h-14 bg-black text-white font-bold text-xs uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-[0.98] rounded-xl mt-4 shadow-md hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      Pay ₦{paymentRidePayload.total} Securely <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {paymentStep === 'processing' && (
                  <div className="flex flex-col items-center justify-center py-12 gap-6 text-center">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-gray-100 rounded-full"></div>
                      <div className="w-16 h-16 border-4 border-blue-600 rounded-full absolute inset-0 border-t-transparent animate-spin"></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-black mb-1">Processing Payment</h3>
                      <p className="font-medium text-sm text-gray-500">Contacting your bank securely...</p>
                    </div>
                  </div>
                )}

                {paymentStep === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 gap-6 text-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
                      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-black text-2xl text-black mb-2 tracking-tight">Payment Successful</h3>
                      <p className="font-medium text-gray-500 text-sm max-w-xs mx-auto">Your ride of ₦{paymentRidePayload.total} has been booked. Check your bookings tab for details.</p>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedRide(null); 
                        setUploadedFile(null);
                        setBookingDropoff('');
                        setBookingPickup('');
                        setBookingSeats(1);
                        setBookingTime('');
                        setPaymentRidePayload(null);
                        setPaymentStep('details');
                        setCardNumber('');
                        setExpiry('');
                        setCvv('');
                        setActiveTab('bookings');
                      }}
                      className="w-full h-14 bg-black text-white font-bold text-xs uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-[0.98] rounded-xl mt-4 shadow-md hover:shadow-xl"
                    >
                      Done
                    </button>
                  </motion.div>
                )}
              </>
            ) : (
              <>
                <h2 className="text-3xl font-black text-black mb-8 tracking-tight">Confirm Booking</h2>
                     {selectedRide.type === 'welfare' && welfareSubmitted && welfareApproved && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl text-sm font-medium shadow-sm">
                <strong className="text-green-900 block mb-1">Welfare Approved</strong> You can book this ride for free.
              </div>
            )}
            
            {selectedRide.type === 'out_of_campus' && !exeatApproved ? (
              !exeatSubmitted ? (
                <div className="mb-6 bg-red-50 border border-red-100 text-red-800 p-4 rounded-xl text-sm font-medium shadow-sm">
                  <strong className="text-red-900 block mb-1">Exeat Required</strong> You must upload your approved exeat document in the Exeat tab before booking out-of-campus rides.
                </div>
              ) : (
                <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-xl text-sm font-medium shadow-sm">
                  <strong className="text-yellow-900 block mb-1">Checking Exeat</strong> Your exeat is pending approval by the admin. You cannot book out-of-campus rides until it is approved.
                </div>
              )
            ) : (
              <>
                {selectedRide.type === 'out_of_campus' && exeatApproved && (
                  <div className="mb-6 bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl text-sm font-medium shadow-sm">
                    <strong className="text-green-900 block mb-1">Exeat Approved</strong> You are cleared to book out-of-campus rides.
                  </div>
                )}
                <div className="bg-gray-50 p-6 mb-8 border border-gray-100 rounded-3xl flex flex-col gap-4 shadow-inner">
                       <div className="flex justify-between items-center pb-4 border-b border-gray-200/60">
                         <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">From</span>
                         {(selectedRide.type === 'welfare' && welfareSubmitted && welfareApproved) || selectedRide.type === 'out_of_campus' ? (
                           <select
                             value={bookingPickup}
                             onChange={(e) => setBookingPickup(e.target.value)}
                             className="ml-auto bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-sm font-bold text-black outline-none focus:border-black"
                           >
                             <option value="">Select Location</option>
                             {validLocations.map(loc => (
                               <option key={loc} value={loc}>{loc}</option>
                             ))}
                           </select>
                         ) : (
                           <span className="text-black font-bold flex items-center gap-2 text-sm">{selectedRide.from}</span>
                         )}
                       </div>
                       <div className="flex items-center justify-between pb-4 border-b border-gray-200/60">
                         <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">To</span>
                         <select
                           value={bookingDropoff}
                           onChange={(e) => setBookingDropoff(e.target.value)}
                           className="ml-auto bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-sm font-bold text-black outline-none focus:border-black"
                         >
                           <option value="">Select Destination</option>
                           {validLocations.filter(loc => loc !== (((selectedRide.type === 'welfare' && welfareSubmitted && welfareApproved) || selectedRide.type === 'out_of_campus') ? bookingPickup : selectedRide.from)).map(loc => (
                             <option key={loc} value={loc}>{loc}</option>
                           ))}
                         </select>
                       </div>
                       <div className="flex justify-between items-center pb-4 border-b border-gray-200/60">
                         <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Time</span>
                         <input 
                           type="time" 
                           value={bookingTime}
                           onChange={(e) => setBookingTime(e.target.value)}
                           className="ml-auto bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-sm font-bold text-black outline-none focus:border-black"
                         />
                       </div>
                       {!(selectedRide.type === 'welfare' && welfareSubmitted && welfareApproved) && (
                         <div className="flex items-center justify-between pb-4 border-b border-gray-200/60">
                           <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Seats</span>
                           <select
                             value={bookingSeats}
                             onChange={(e) => setBookingSeats(Number(e.target.value))}
                             className="ml-auto bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-sm font-bold text-black outline-none focus:border-black"
                           >
                             {[1, 2, 3, 4, 5, 6].filter(n => n <= selectedRide.seats).map(n => (
                               <option key={n} value={n}>{n} {n === 1 ? 'Seat' : 'Seats'}</option>
                             ))}
                           </select>
                         </div>
                       )}
                       <div className="flex justify-between items-center mt-2">
                         <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Total Price</span>
                         <span className="font-black text-black text-2xl">{(selectedRide.type === 'welfare' && welfareSubmitted && welfareApproved) || selectedRide.price === 0 ? 'Free' : `₦${selectedRide.price * bookingSeats}`}</span>
                       </div>
                    </div>
                <button 
                  onClick={() => {
                    const isWelfareRoute = selectedRide.type === 'welfare' && welfareSubmitted && welfareApproved;
                    if ((isWelfareRoute || selectedRide.type === 'out_of_campus') && !bookingPickup) {
                      alert("Please select a pick-up location.");
                      return;
                    }
                    
                    if (!bookingDropoff) {
                      alert("Please select a drop-off destination.");
                      return;
                    }
                    
                    if (!bookingTime) {
                      alert("Please select a pick-up time.");
                      return;
                    }
                    
                    if (user) {
                      const finalSeats = isWelfareRoute ? 1 : bookingSeats;
                      const isFree = isWelfareRoute || selectedRide.price === 0;
                      const finalTotalNum = isFree ? 0 : selectedRide.price * finalSeats;
                      const finalPickup = isWelfareRoute || selectedRide.type === 'out_of_campus' ? bookingPickup : selectedRide.from;
                      
                      if (isFree) {
                        if (bookRide) bookRide(selectedRide.id, finalSeats, bookingDropoff, bookingTime, finalPickup);
                        alert(`Successfully booked ${finalSeats} seat(s) to ${bookingDropoff} at ${bookingTime}! Total: Free`);
                        setSelectedRide(null);
                        setUploadedFile(null);
                        setBookingDropoff('');
                        setBookingPickup('');
                        setBookingSeats(1);
                        setBookingTime('');
                        setActiveTab('bookings');
                      } else {
                        setPaymentRidePayload({
                          id: selectedRide.id,
                          seats: finalSeats,
                          dropoff: bookingDropoff,
                          time: bookingTime,
                          pickup: finalPickup,
                          total: finalTotalNum
                        });
                        setPaymentStep('details');
                      }
                    } else {
                      setCurrentView?.('login');
                    }
                  }}
                  className="w-full h-14 bg-black text-white font-bold text-xs uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-[0.98] rounded-xl mt-4 shadow-md hover:shadow-xl"
                >
                  {user ? 'Confirm Booking' : 'Log in to book'}
                </button>
              </>
            )}
            </>
          )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
