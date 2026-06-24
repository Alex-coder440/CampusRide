import { ViewState } from '../App';
import { ArrowRight, Car, MapPin, Shield, Zap, Star, Users } from 'lucide-react';
import * as motion from 'motion/react-client';
import { useScroll, useTransform } from 'motion/react';

interface HomeProps {
  setCurrentView: (view: ViewState) => void;
}

export default function Home({ setCurrentView }: HomeProps) {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -100]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -60]);
  const y3 = useTransform(scrollY, [0, 1000], [0, -150]);
  const y4 = useTransform(scrollY, [0, 1000], [0, -80]);

  const features = [
    {
      icon: <Zap className="h-6 w-6 text-black" />,
      title: "Instant Booking",
      desc: "Find rides happening right now. Book and confirm your seat in seconds without delays."
    },
    {
      icon: <Shield className="h-6 w-6 text-black" />,
      title: "Verified Drivers",
      desc: "Every driver is a verified student or staff member. Safety is our top priority."
    },
    {
      icon: <MapPin className="h-6 w-6 text-black" />,
      title: "Anywhere Coverage",
      desc: "Need to go to class, the library, or the city center? Find routes that match your destination."
    },
    {
      icon: <Car className="h-6 w-6 text-black" />,
      title: "Affordable Trips",
      desc: "Split the cost. Pay significantly less than traditional cabs or ride-hailing apps."
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#fcfcfc] text-black">
      <section className="relative pt-24 pb-32 overflow-hidden bg-gradient-to-b from-orange-50/50 to-[#fcfcfc]">
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center mt-12 max-w-7xl">
          
          {/* Floating Card 1 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ opacity: { duration: 0.5, delay: 0.2 } }}
            style={{ y: y1 }}
            className="absolute hidden lg:flex top-16 left-12 xl:left-32 bg-white shadow-xl shadow-black/[0.04] rounded-2xl p-3 items-center gap-3 border border-gray-100/60 backdrop-blur-xl ml-0 mb-0 -mt-[150px]"
          >
            <div className="w-10 h-10 rounded-[14px] bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500">
              <MapPin className="w-4 h-4 fill-auto" />
            </div>
            <div className="text-left pr-3">
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Pickup Point</div>
              <div className="text-xs font-black text-black">Shuttle Stand</div>
            </div>
          </motion.div>

          {/* Floating Card 2 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ opacity: { duration: 0.5, delay: 0.3 } }}
            style={{ y: y2 }}
            className="absolute hidden lg:flex bottom-20 right-12 xl:right-32 bg-white shadow-xl shadow-black/[0.04] rounded-2xl p-3 items-center gap-3 border border-gray-100/60 backdrop-blur-xl"
          >
            <div className="text-left pl-2">
              <div className="text-xs font-black text-black flex items-center gap-1"><Shield className="w-3 h-3 text-green-500" /> Verified Driver</div>
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">5.0 Star Rating</div>
            </div>
            <div className="w-10 h-10 rounded-[14px] bg-green-50 border border-green-100 flex items-center justify-center text-green-600 font-bold text-base">
              5★
            </div>
          </motion.div>

          {/* Floating Card 3 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -12 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ opacity: { duration: 0.5, delay: 0.4 } }}
            style={{ y: y3 }}
            className="absolute hidden lg:flex top-40 right-20 xl:right-48 bg-white shadow-xl shadow-black/[0.04] rounded-full p-2 items-center gap-2 border border-gray-100/60 backdrop-blur-xl -mt-[200px]"
          >
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center text-[9px] font-bold text-blue-700">SJ</div>
              <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white shadow-sm flex items-center justify-center text-[9px] font-bold text-emerald-700">MT</div>
              <div className="w-8 h-8 rounded-full bg-violet-100 border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-black text-violet-700">+2</div>
            </div>
            <div className="text-[9px] font-black text-black px-2 uppercase tracking-widest">Joined</div>
          </motion.div>

          {/* Floating Card 4 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ opacity: { duration: 0.5, delay: 0.5 } }}
            style={{ y: y4 }}
            className="absolute hidden lg:flex bottom-32 left-16 xl:left-40 bg-white shadow-xl shadow-black/[0.04] rounded-2xl p-3 items-center gap-3 border border-gray-100/60 backdrop-blur-xl"
          >
            <div className="w-10 h-10 rounded-[14px] bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500">
              <Users className="w-4 h-4 fill-auto" />
            </div>
            <div className="text-left pr-3">
              <div className="text-xs font-black text-black">New Matches</div>
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">3 riders nearby</div>
            </div>
          </motion.div>

          <motion.div 
            className="flex flex-col items-center w-full max-w-4xl"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-6xl md:text-[5.5rem] font-extrabold tracking-tight text-black mb-6 leading-tight"
            >
              Your Campus Rides.<br/> All In One App.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl text-base sm:text-lg text-gray-500 mb-10 font-medium leading-relaxed"
            >
              Movement around Covenant University made Easier: Explore Our Integrated Ride Application.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4 mb-12"
            >
              <button 
                onClick={() => setCurrentView('auth_student')}
                className="inline-flex items-center justify-center bg-[#1a1a1a] px-8 py-3.5 text-sm font-medium text-white transition-all hover:bg-black hover:scale-105 active:scale-95 hover:shadow-xl rounded-full"
              >
                Get Started
              </button>
              <button 
                onClick={() => setCurrentView('features')}
                className="inline-flex items-center justify-center bg-white border border-gray-200 px-8 py-3.5 text-sm font-medium text-black transition-all hover:bg-gray-50 hover:scale-105 active:scale-95 hover:shadow-sm rounded-full"
              >
                See Features
              </button>
            </motion.div>

            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 0.5, delay: 0.3 }}
               className="flex items-center gap-4 text-sm font-medium text-gray-400"
            >
              <div className="flex -space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-gray-600 border-2 border-white"></div>
              </div>
              <div className="flex flex-col items-start text-[11px] leading-tight text-gray-500">
                <div className="flex text-yellow-400 mb-0.5">
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                </div>
                Trusted by 5,000+ students and staff
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 pb-24 bg-[#fcfcfc]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1000px]">
          <div className="grid gap-6 md:grid-cols-3 h-full">
             <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="md:col-span-1 flex flex-col bg-[#fae8d4] rounded-3xl p-6 border border-gray-100 shadow-sm min-h-[380px] hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-500 group"
              >
                <div className="flex items-center gap-3 mb-8 bg-white/50 w-max pr-4 p-1 rounded-full border border-white/60">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs">🚗</div>
                  <div>
                    <div className="text-xs font-bold text-black tracking-tight leading-none mb-0.5">You are ready, Mia!</div>
                    <div className="text-[9px] text-gray-500 font-medium">7:20 AM</div>
                  </div>
                </div>

                <div className="space-y-4 mb-auto">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-black/70 font-medium text-[11px]">Campus</span>
                        <div className="flex items-center gap-2">
                           <div className="w-24 h-1 bg-white/40 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} whileInView={{ width: '80%' }} viewport={{ once: true, amount: 0.8 }} transition={{ duration: 1.2, ease: "easeOut" }} className="h-full bg-black/70 rounded-full"></motion.div></div>
                           <span className="text-[10px] font-bold text-black/70">92</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-black/70 font-medium text-[11px]">Outside</span>
                        <div className="flex items-center gap-2">
                           <div className="w-24 h-1 bg-white/40 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} whileInView={{ width: '45%' }} viewport={{ once: true, amount: 0.8 }} transition={{ duration: 1.2, ease: "easeOut" }} className="h-full bg-black/70 rounded-full"></motion.div></div>
                           <span className="text-[10px] font-bold text-black/70">86</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-black/70 font-medium text-[11px]">Welfare</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1 bg-white/40 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} whileInView={{ width: '60%' }} viewport={{ once: true, amount: 0.8 }} transition={{ duration: 1.2, ease: "easeOut" }} className="h-full bg-black/70 rounded-full"></motion.div></div>
                          <span className="text-[10px] font-bold text-black/70">89</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-white/60 rounded-2xl p-4 border border-white/50">
                  <h3 className="text-sm font-bold text-black mb-1.5 tracking-tight">Get the App!</h3>
                  <p className="text-[10px] text-black/60 leading-relaxed font-medium">Create a free account and gain access to peer-driven connectivity on campus.</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="md:col-span-1 flex flex-col bg-[#1a1c23] rounded-3xl p-6 shadow-sm min-h-[380px] hover:shadow-2xl hover:shadow-black/20 transition-all duration-500 group"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="bg-white/10 text-white text-[11px] font-bold px-3 py-1.5 rounded-full border border-white/10">Activity</div>
                  <div className="text-white/50 text-[10px] border border-white/10 px-2 py-0.5 rounded-full">Share</div>
                </div>

                <div className="space-y-4 mb-auto mt-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-white/70 font-medium text-[11px]">Rides Taken</span>
                        <div className="flex items-center gap-2">
                           <div className="w-24 h-1 bg-white/20 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} whileInView={{ width: '70%' }} viewport={{ once: true, amount: 0.8 }} transition={{ duration: 1.2, ease: "easeOut" }} className="h-full bg-blue-400 rounded-full"></motion.div></div>
                           <span className="text-[10px] font-bold text-white/90">24</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-white/70 font-medium text-[11px]">Miles Saved</span>
                        <div className="flex items-center gap-2">
                           <div className="w-24 h-1 bg-white/20 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} whileInView={{ width: '85%' }} viewport={{ once: true, amount: 0.8 }} transition={{ duration: 1.2, ease: "easeOut" }} className="h-full bg-green-400 rounded-full"></motion.div></div>
                           <span className="text-[10px] font-bold text-white/90">142</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-white/70 font-medium text-[11px]">CO2 Reduced</span>
                        <div className="flex items-center gap-2">
                           <div className="w-24 h-1 bg-white/20 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} whileInView={{ width: '60%' }} viewport={{ once: true, amount: 0.8 }} transition={{ duration: 1.2, ease: "easeOut" }} className="h-full bg-emerald-400 rounded-full"></motion.div></div>
                           <span className="text-[10px] font-bold text-white/90">56kg</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-white/5 rounded-2xl p-4 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-light tracking-tighter text-white">86</div>
                    <div className="flex flex-col gap-0.5">
                       <span className="text-white text-xs font-semibold tracking-tight">Activity Score</span>
                       <div className="flex text-white/50 text-[9px] gap-2">
                          <span>Top 10% on Campus</span>
                       </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="md:col-span-1 flex flex-col bg-[#4a3f35] rounded-3xl p-6 shadow-sm min-h-[380px] hover:shadow-2xl hover:shadow-black/20 transition-all duration-500 group"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="bg-white/10 text-white text-[11px] font-bold px-3 py-1.5 rounded-full border border-white/10">Trust & Safety</div>
                  <div className="text-white/50 text-[10px] border border-white/10 px-2 py-0.5 rounded-full">Share</div>
                </div>

                <div className="space-y-4 mb-auto mt-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-white/70 font-medium text-[11px]">Punctuality</span>
                        <div className="flex items-center gap-2">
                           <div className="w-24 h-1 bg-white/20 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} whileInView={{ width: '95%' }} viewport={{ once: true, amount: 0.8 }} transition={{ duration: 1.2, ease: "easeOut" }} className="h-full bg-amber-400 rounded-full"></motion.div></div>
                           <span className="text-[10px] font-bold text-white/90">98%</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-white/70 font-medium text-[11px]">Friendliness</span>
                        <div className="flex items-center gap-2">
                           <div className="w-24 h-1 bg-white/20 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} whileInView={{ width: '92%' }} viewport={{ once: true, amount: 0.8 }} transition={{ duration: 1.2, ease: "easeOut" }} className="h-full bg-orange-400 rounded-full"></motion.div></div>
                           <span className="text-[10px] font-bold text-white/90">5.0</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-white/70 font-medium text-[11px]">Reliability</span>
                        <div className="flex items-center gap-2">
                           <div className="w-24 h-1 bg-white/20 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} whileInView={{ width: '88%' }} viewport={{ once: true, amount: 0.8 }} transition={{ duration: 1.2, ease: "easeOut" }} className="h-full bg-yellow-400 rounded-full"></motion.div></div>
                           <span className="text-[10px] font-bold text-white/90">High</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-white/5 rounded-2xl p-4 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-light tracking-tighter text-white">92</div>
                    <div className="flex flex-col gap-0.5">
                       <span className="text-white text-xs font-semibold tracking-tight">Trust Score</span>
                       <div className="flex text-white/50 text-[9px] gap-2">
                          <span>Verified Member</span>
                       </div>
                    </div>
                  </div>
                </div>
              </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50 border-t border-gray-100 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1200px]">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black tracking-tight mb-4">Trusted by the community</h2>
            <p className="text-gray-500 font-medium max-w-xl mx-auto">Hear what students and staff have to say about their daily commute.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { text: "CampusRide literally changed how I get to my 8 AMs. It's so much cheaper and I've met some cool people from my major.", author: "Samuel Olatunji.", role: "200lvl, Comp Sci" },
              { text: "Thanks to CampusRide using shuttles has been very flexible especially when it comes to using Welfare Shuttles", author: "Michael Toluwani.", role: "400lvl, ICE" },
              { text: "If not for CampusRide I probably won't have been using shuttles. But now there isn't any need for long lines, all I need is on my Tab.", author: "Emma Williams.", role: "100lvl, Architecture" }
            ].map((review, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-black/[0.03] transition-all duration-300 flex flex-col justify-between"
              >
                <div className="mb-6">
                  <div className="flex text-yellow-400 mb-4">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <p className="text-gray-700 font-medium leading-relaxed italic">"{review.text}"</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm flex items-center justify-center font-bold text-gray-500 text-xs">
                    {review.author.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-black">{review.author}</div>
                    <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">{review.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1000px]">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black tracking-tight mb-4">How CampusRide Works</h2>
            <p className="text-gray-500 font-medium max-w-xl mx-auto">Getting around Campus has never been more straightforward. Four simple steps to your destination.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-0.5 bg-gray-100 -z-10"></div>
            
            {[
               { step: "01", title: "Create Account", desc: "Sign up securely using your verified student or staff portal credentials." },
               { step: "02", title: "Find a Ride", desc: "Browse available rides matching your exact campus route or request one." },
               { step: "03", title: "Book a Seat", desc: "Reserve your spot instantly with our guaranteed seat-matching process." },
               { step: "04", title: "Enjoy the Trip", desc: "Meet your driver at the pickup zone and safely arrive at your destination." }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-white border-4 border-[#fcfcfc] shadow-sm rounded-full flex items-center justify-center font-bold text-black mb-6">
                  {item.step}
                </div>
                <h3 className="font-bold text-black mb-2">{item.title}</h3>
                <p className="text-sm font-medium text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-[#fcfcfc] border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[800px]">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black tracking-tight mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-500 font-medium">Everything you need to know about CampusRide.</p>
          </div>
          
          <div className="space-y-6">
            {[
              { q: "Who can use CampusRide?", a: "CampusRide is exclusively for verified students and faculty. You need a valid university email to sign up." },
              { q: "How much does a ride cost?", a: "Prices are set by drivers but are capped to ensure affordability. You share the cost of the trip, which makes it much cheaper than standard cabs." },
              { q: "Are the drivers verified?", a: "Yes. All drivers go through a verification process including ID checks and vehicle registration on campus." },
              { q: "Can I cancel a booked ride?", a: "Yes, you can cancel up to 10 minutes before the scheduled departure time without any penalty." }
            ].map((faq, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
              >
                <h3 className="font-bold text-black mb-2 flex justify-between items-center">
                  {faq.q}
                  <span className="text-gray-300 group-hover:text-black transition-colors">+</span>
                </h3>
                <p className="text-sm font-medium text-gray-500 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Driver CTA Section */}
      <section className="py-32 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-20">
             <div className="w-full lg:w-3/5">
                <h2 className="text-5xl sm:text-6xl font-black text-black tracking-tighter mb-8">Get started today.</h2>
                <p className="text-xl text-gray-600 font-medium mb-16">Introducing the CampusRide Framework™ for students.</p>
                
                <div className="grid sm:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-lg font-bold text-black mb-3">Campus Living</h3>
                    <p className="text-gray-600 font-medium leading-relaxed">We believe that living an honest and intentional life will carry over to the way you support your peers on trips.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-black mb-3">Seamless Transit</h3>
                    <p className="text-gray-600 font-medium leading-relaxed">We believe that excellent route timing and spatial awareness will help you build a beautiful ride experience.</p>
                  </div>
                </div>
             </div>
             
             <div className="w-full lg:w-2/5 flex items-center justify-start lg:justify-end">
                <div className="bg-white p-12 w-full text-center shadow-lg flex flex-col justify-center border border-gray-100">
                  <Car className="w-12 h-12 mx-auto mb-8 stroke-[1]" />
                  <h3 className="font-bold text-2xl mb-4">Start your journey.</h3>
                  <p className="text-gray-500 font-medium text-base mb-10 leading-relaxed">We help creative students build an honest transit platform.</p>
                  
                  <button 
                    onClick={() => setCurrentView('auth_driver')}
                    className="w-full py-5 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
                  >
                    Get Started Today
                  </button>
                </div>
             </div>
          </div>
        </div>
      </section>

      <footer className="bg-white py-16 border-t border-gray-100 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex flex-col md:flex-row justify-between items-center text-sm font-medium text-gray-500">
          <div className="flex items-center gap-8 mb-6 md:mb-0">
             <span className="font-bold text-black text-lg tracking-tighter">CampusRide.</span>
             <span>&copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-8">
            <button className="hover:text-black transition-colors">Twitter</button>
            <button className="hover:text-black transition-colors">Instagram</button>
            <button className="hover:text-black transition-colors">Support</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
