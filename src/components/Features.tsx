import { Car, Smartphone, ShieldCheck, Zap, Users, Shield, Compass, FileText, CheckCircle2 } from 'lucide-react';
import * as motion from 'motion/react-client';

export default function Features() {
  return (
    <div className="flex-1 bg-[#fcfcfc] text-black">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pb-32 overflow-hidden bg-gradient-to-b from-blue-50/50 to-[#fcfcfc]">
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 border border-blue-200/50 text-blue-800 text-xs font-bold uppercase tracking-widest mb-8"
          >
            <Zap className="w-4 h-4" /> The Ecosystem
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-black mb-6 leading-tight"
          >
            Designed for Campus.<br />Built for Everyone.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl text-base sm:text-lg text-gray-500 font-medium leading-relaxed"
          >
            CampusRide isn't just an app—it's a comprehensive transit network. Whether you are catching a quick shuttle to class, driving your regular route, or managing campus logistics, every workflow is tailored to perfection.
          </motion.p>
        </div>
      </section>

      {/* Student Portal Feature */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="w-full lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative bg-white rounded-[2rem] border border-gray-100 shadow-2xl p-8 lg:p-12 aspect-square flex flex-col items-center justify-center overflow-hidden group"
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <Smartphone className="w-24 h-24 stroke-1 text-black mb-8 relative z-10" />
                <div className="flex gap-2 mb-4 relative z-10">
                  <span className="w-16 h-1 bg-blue-500 rounded-full"></span>
                  <span className="w-8 h-1 bg-gray-200 rounded-full"></span>
                  <span className="w-8 h-1 bg-gray-200 rounded-full"></span>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl w-full p-4 relative z-10">
                  <div className="flex justify-between items-center mb-3">
                    <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-10 h-4 bg-green-200 rounded animate-pulse"></div>
                  </div>
                  <div className="w-full h-8 bg-white border border-gray-100 rounded mb-2"></div>
                  <div className="w-full h-8 bg-white border border-gray-100 rounded"></div>
                </div>
              </motion.div>
            </div>
            
            <div className="w-full lg:w-1/2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Users className="w-6 h-6" />
                </div>
                <h2 className="text-3xl lg:text-4xl font-extrabold text-black tracking-tight">Student Portal</h2>
              </div>
              <p className="text-lg text-gray-500 font-medium mb-10 leading-relaxed">
                Empowering students to seamlessly discover, book, and manage campus rides. With an intuitive and real-time dashboard, you're always in sync with shuttles across your university.
              </p>
              
              <ul className="space-y-6">
                {[
                  { title: "Real-Time Ride Browsing", desc: "Instantly see active rides happening around you. Filter by Campus routes, Outside trips, or Welfare Shuttles." },
                  { title: "One-Click Booking", desc: "Book a seat matching your pickup location and destination effortlessly." },
                  { title: "Welfare & Exeat Submissions", desc: "Submit clearance documents digitally to access free/welfare rides or to get approval for leaving campus. Admins review directly." },
                  { title: "Profile Management", desc: "Keep track of your previous rides, account status, and credentials all in one secure space." }
                ].map((feature, i) => (
                  <motion.li 
                    key={i} 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <CheckCircle2 className="w-6 h-6 text-black shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-black mb-1">{feature.title}</h3>
                      <p className="text-sm font-medium text-gray-500">{feature.desc}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Driver Portal Feature */}
      <section className="py-20 lg:py-32 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-16 lg:gap-24">
            <div className="w-full lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative bg-white rounded-[2rem] border border-gray-100 shadow-2xl p-8 lg:p-12 aspect-square flex flex-col items-center justify-center overflow-hidden group"
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-orange-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <Car className="w-24 h-24 stroke-1 text-black mb-8 relative z-10" />
                <div className="flex gap-2 mb-4 relative z-10">
                  <span className="w-8 h-1 bg-gray-200 rounded-full"></span>
                  <span className="w-16 h-1 bg-orange-500 rounded-full"></span>
                  <span className="w-8 h-1 bg-gray-200 rounded-full"></span>
                </div>
                <div className="bg-orange-50/50 border border-orange-100/50 rounded-2xl w-full p-4 flex items-center justify-between relative z-10">
                   <div>
                     <div className="w-16 h-3 bg-orange-200 rounded mb-2"></div>
                     <div className="w-24 h-4 bg-orange-300 rounded"></div>
                   </div>
                   <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-orange-500 shadow-sm">+</div>
                </div>
              </motion.div>
            </div>
            
            <div className="w-full lg:w-1/2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
                  <Compass className="w-6 h-6" />
                </div>
                <h2 className="text-3xl lg:text-4xl font-extrabold text-black tracking-tight">Driver Portal</h2>
              </div>
              <p className="text-lg text-gray-500 font-medium mb-10 leading-relaxed">
                Operating a shuttle requires organization. The Driver Portal gives drivers the tools to post rides, manage seating capacity, and handle passengers transparently.
              </p>
              
              <ul className="space-y-6">
                {[
                  { title: "Smart Route Creation", desc: "Easily publish new trips. Define your pick-up point, route scope (Campus, Out of Campus, or Welfare), fare, and total available seats." },
                  { title: "Dynamic Seat Tracking", desc: "As students book, your available seats diminish automatically in real-time. No overbooking, zero confusion." },
                  { title: "Rider Manifest", desc: "Instantly see exactly who is on your ride. Cross-check student names and destinations easily before embarking." },
                  { title: "Status Controls", desc: "Mark a ride as 'In Progress' when moving, and 'Completed' upon arrival. Passengers are notified." }
                ].map((feature, i) => (
                  <motion.li 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <CheckCircle2 className="w-6 h-6 text-black shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-black mb-1">{feature.title}</h3>
                      <p className="text-sm font-medium text-gray-500">{feature.desc}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Operations Section */}
      <section className="py-20 lg:py-32 bg-black text-white relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
            <ShieldCheck className="w-16 h-16 mx-auto mb-8 text-emerald-400" />
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6">Backend Verification Engine</h2>
            <p className="text-lg text-gray-400 font-medium mb-12 max-w-2xl mx-auto">
              Behind the curtain, the Admin Portal serves as the backbone of CampusRide. Maintaining security, enforcing student integrity, and approving vital exceptions.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-8 text-left">
               <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6">
                     <Shield className="text-white w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Identity Authorization</h3>
                  <p className="text-sm text-gray-400 leading-relaxed font-medium">Verify or reject newly registered Students and Drivers before they access the ecosystem. Keep bad actors out entirely.</p>
               </div>
               <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6">
                     <FileText className="text-white w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Document Audit View</h3>
                  <p className="text-sm text-gray-400 leading-relaxed font-medium">Admins can cross-reference submitted Exeat and Welfare documents via our dedicated side-by-side verification viewer.</p>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
