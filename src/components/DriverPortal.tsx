import React, { useState } from 'react';
import { User, Ride, RideType } from '../types';
import { Car, Clock, MapPin, Users, Plus, X, Play, CheckCircle } from 'lucide-react';
import * as motion from 'motion/react-client';

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

interface DriverPortalProps {
  user: User | null;
  rides: Ride[];
  addRide: (ride: Ride) => void;
  updateRideStatus: (rideId: string, status: 'scheduled' | 'active' | 'completed') => void;
}

export default function DriverPortal({ user, rides, addRide, updateRideStatus }: DriverPortalProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [from, setFrom] = useState('Shuttle Stand');
  const [seats, setSeats] = useState(3);
  
  if (!user || user.role !== 'driver') return null;

  const myRides = rides.filter(r => r.driverId === user.id || r.driver === user.name);

  // Default type based on driverType
  const getRideType = (): RideType => {
    if (user.driverType === 'welfare') return 'welfare';
    if (user.driverType === 'out') return 'out_of_campus';
    return 'within_campus';
  };
  
  const getPrice = () => {
    return 200;
  };

  const handlePostRide = (e: React.FormEvent) => {
    e.preventDefault();
    const newRide: Ride = {
      id: Math.random().toString(36).substring(2, 9),
      driverId: user.id,
      driver: user.name,
      type: getRideType(),
      from,
      to: 'Any Destination',
      depart: 'Now',
      seats,
      price: getPrice(),
      rating: "5.0",
      passengers: [],
      status: 'scheduled'
    };
    addRide(newRide);
    setShowAddModal(false);
  };

  const getDriverTitle = () => {
    if (user.driverType === 'welfare') return "Welfare Driver";
    if (user.driverType === 'out') return "Bus Driver";
    return "Campus Driver";
  };

  return (
    <div className="flex-1 bg-[#fcfcfc] py-20 relative w-full h-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-16 gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-black mb-4">Driver Portal.</h1>
            <p className="text-gray-500 font-bold">Welcome, {user.name} <span className="text-white ml-2 text-[10px] bg-black px-2 py-0.5 uppercase tracking-widest">{getDriverTitle()}</span></p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-8 py-4 font-bold text-xs uppercase tracking-widest transition-all active:scale-95"
          >
            Post Available Seats
          </button>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-widest text-gray-400 mb-8">Your Posted Rides</h2>
          {myRides.length === 0 ? (
            <div className="text-center py-24 mb-12">
              <h3 className="text-3xl font-black text-black mb-4">No rides posted yet.</h3>
              <p className="text-gray-500 text-lg font-medium leading-relaxed">Post your available seats to let students book rides.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {myRides.map(ride => (
                <div key={ride.id} className="bg-white p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 hover:-translate-y-1 transition-all duration-300 rounded-3xl flex flex-col h-full group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-50 border border-gray-100 w-12 h-12 flex items-center justify-center rounded-2xl group-hover:bg-black group-hover:text-white transition-colors duration-300">
                        <MapPin className="w-5 h-5 group-hover:text-white text-black transition-colors" />
                      </div>
                      <div>
                        <div className="text-black font-bold text-lg leading-tight">{ride.from}</div>
                        <div className="text-sm font-bold text-gray-500 flex items-center gap-1 mt-0.5"><Clock className="w-3.5 h-3.5" /> {ride.depart}</div>
                      </div>
                    </div>
                    <div className={`px-3 py-1.5 text-[10px] tracking-widest uppercase font-bold border rounded-full flex items-center gap-1 ${
                      ride.status === 'completed' ? 'bg-gray-50 border-gray-200 text-gray-500' :
                      ride.status === 'active' ? 'bg-black border-black text-white shadow-md' :
                      'bg-white border-gray-300 text-black'
                    }`}>
                      {ride.status === 'completed' ? 'Completed' : ride.status === 'active' ? 'In Progress' : `${ride.seats} seats available`}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-6 border-t border-gray-100 flex-1">
                    <div className="text-[10px] uppercase tracking-widest font-bold text-gray-400 flex items-center gap-2 mb-4">
                      <Users className="w-4 h-4" /> Passengers Booked ({ride.passengers.length})
                    </div>
                    {(() => {
                      const grouped: { [key: string]: { id: string; name: string; destination: string; time: string; pickup: string; count: number } } = {};
                      ride.passengers.forEach(p => {
                        const key = `${p.id || p.name}-${p.destination || ''}-${p.time || ''}-${p.pickup || ''}`;
                        if (!grouped[key]) {
                          grouped[key] = {
                            id: p.id,
                            name: p.name,
                            destination: p.destination,
                            time: p.time,
                            pickup: p.pickup,
                            count: 0
                          };
                        }
                        grouped[key].count += 1;
                      });
                      const list = Object.values(grouped);

                      return list.length > 0 ? (
                        <ul className="space-y-2">
                          {list.map((p, i) => (
                            <li key={i} className="text-sm font-bold text-black bg-gray-50 px-4 py-3 border border-gray-100 flex justify-between items-center rounded-xl">
                              <span className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-black">{p.name}</span>
                                {p.count > 1 && (
                                  <span className="text-[10px] tracking-widest font-black uppercase bg-indigo-50 border border-indigo-150/40 text-indigo-700 px-2 py-0.5 rounded-md">
                                    {p.count} seats booked
                                  </span>
                                )}
                                {p.time && <span className="font-medium text-gray-400 text-xs">({p.time})</span>}
                              </span>
                              {p.destination && p.destination !== 'Any Destination' && (
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest bg-gray-200/50 px-2 py-1 rounded">
                                  {p.pickup && p.pickup !== ride.from ? `${p.pickup} → ` : 'To: '}
                                  {p.destination}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-sm font-medium text-gray-400 italic px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl">No bookings yet.</div>
                      );
                    })()}
                  </div>

                  {ride.status === 'scheduled' && (
                    <button 
                      onClick={() => updateRideStatus(ride.id, 'active')}
                      className="mt-6 w-full flex items-center justify-center gap-2 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 text-black font-bold py-3.5 text-xs uppercase tracking-widest transition-all rounded-xl hover:shadow-sm"
                    >
                      <Play className="w-4 h-4 fill-current" /> Start Ride
                    </button>
                  )}
                  {ride.status === 'active' && (
                    <button 
                      onClick={() => updateRideStatus(ride.id, 'completed')}
                      className="mt-6 w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white font-bold py-3.5 text-xs uppercase tracking-widest transition-all rounded-xl shadow-md hover:shadow-xl"
                    >
                      <CheckCircle className="w-4 h-4" /> Mark Completed
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen relative p-6 sm:p-10 w-full max-w-lg mx-auto flex flex-col justify-center py-16"
          >
             <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-black bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-3xl font-black text-black mb-8 tracking-tight">Post Seats</h3>
            
            <form onSubmit={handlePostRide} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 block uppercase tracking-widest pl-1">Current Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select value={from} onChange={e => setFrom(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 focus:border-black outline-none text-black appearance-none font-bold text-sm rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                    <option value="">Select current location</option>
                    {validLocations.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 block uppercase tracking-widest pl-1">Seats</label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="number" min="1" max="8" value={seats} onChange={e => setSeats(Number(e.target.value))} className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 focus:border-black outline-none text-black font-bold text-sm rounded-xl shadow-sm focus:shadow-md transition-shadow cursor-pointer" />
                </div>
              </div>
              
              <button type="submit" className="w-full h-14 mt-6 bg-black hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all active:scale-[0.98] shadow-md hover:shadow-xl">
                Create Ride
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
