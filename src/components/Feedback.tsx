import React, { useState, useEffect } from 'react';
import * as motion from 'motion/react-client';
import { Send, FileSpreadsheet, AlertCircle } from 'lucide-react';

export default function Feedback() {
  const [sheetData, setSheetData] = useState<string[][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/sheets');
      if (!res.ok) {
        throw new Error('Failed to fetch sheet data');
      }
      const data = await res.json();
      setSheetData(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [new Date().toISOString(), name, message],
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit feedback to Google Sheets');
      }

      setName('');
      setMessage('');
      
      // Refresh data
      await fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-[#fcfcfc] text-black">
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-black tracking-tight mb-2">Community Feedback</h2>
              <p className="text-lg text-gray-500 font-medium">Live data synced directly with Google Sheets.</p>
            </div>
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
               <FileSpreadsheet className="w-8 h-8" />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Form Section */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-white rounded-[2rem] border border-gray-100 shadow-xl p-8 lg:p-10"
            >
              <h3 className="text-xl font-bold mb-6 text-black tracking-tight">Leave Feedback</h3>
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 text-sm font-medium flex items-start gap-3 border border-red-100">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-gray-400 block uppercase tracking-widest mb-2">Your Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Jane Doe"
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-black outline-none transition text-sm text-black placeholder:text-gray-400 font-medium rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 block uppercase tracking-widest mb-2">Message</label>
                  <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={4}
                    placeholder="What do you think about the app?"
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-black outline-none transition text-sm text-black placeholder:text-gray-400 font-medium rounded-xl resize-none"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-14 bg-black text-white font-bold text-xs uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-[0.98] rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-xl disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <>
                      Submit to Sheet <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Data Feed Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-black tracking-tight">Recent Entries</h3>
                <button 
                  onClick={fetchData}
                  disabled={isLoading}
                  className="text-xs font-bold uppercase tracking-widest text-blue-600 hover:text-blue-800 disabled:opacity-50"
                >
                  {isLoading ? 'Syncing...' : 'Sync Now'}
                </button>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {isLoading && sheetData.length === 0 ? (
                  Array(4).fill(0).map((_, i) => (
                    <div key={i} className="bg-white border border-gray-100 p-5 rounded-2xl animate-pulse flex flex-col gap-3">
                      <div className="w-24 h-4 bg-gray-100 rounded"></div>
                      <div className="w-full h-16 bg-gray-50 rounded"></div>
                    </div>
                  ))
                ) : sheetData.length === 0 ? (
                   <div className="bg-gray-50 border border-gray-100 p-8 rounded-3xl text-center flex flex-col items-center justify-center text-gray-500">
                     <FileSpreadsheet className="w-12 h-12 mb-4 text-gray-300" />
                     <p className="font-medium">No feedback entries yet.</p>
                     <p className="text-sm mt-1">Be the first to submit!</p>
                   </div>
                ) : (
                  // Assuming data structure: [Timestamp, Name, Message]
                  sheetData.map((row, i) => {
                    const isHeader = i === 0 && row.includes('Name') && row.includes('Message');
                    if (isHeader) return null; // Skip if it looks like a header row

                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={i} 
                        className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                      >
                         <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                         
                         {row[0] && (
                           <div className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">
                             {new Date(row[0]).toLocaleString(undefined, {
                                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                             }) !== 'Invalid Date' ? new Date(row[0]).toLocaleString(undefined, {
                              year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                           }) : row[0]}
                           </div>
                         )}
                         <div className="font-bold text-black text-lg mb-1">{row[1] || 'Anonymous'}</div>
                         <p className="text-gray-600 font-medium text-sm leading-relaxed">{row[2] || 'No message provided'}</p>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Add custom scrollbar styling */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1; 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db; 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af; 
        }
      `}} />
    </div>
  );
}
