/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Sparkles, 
  TrendingUp,
  Users,
  CreditCard,
  Calendar,
  Send,
  Loader2,
  Menu,
  X
} from 'lucide-react';
import { MOCK_TOURISM_DATA } from './lib/data';
import { askTourismAI } from './lib/ai';
import { cn } from './lib/utils';
import ReactMarkdown from 'react-markdown';

// --- Components ---

function Card({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("backdrop-blur-md bg-white/60 border border-white/80 shadow-sm rounded-3xl", className)}>
      {children}
    </div>
  );
}

function MetricCard({ title, value, trend, icon: Icon }: { title: string, value: string, trend?: string, icon: any }) {
  return (
    <Card className="p-6 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-2">
        <p className="text-xs font-semibold text-slate-500 mb-1">{title}</p>
        <div className="p-2 bg-white/60 rounded-xl border border-white/80">
          <Icon className="w-5 h-5 text-blue-900" />
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
        {trend && (
          <p className="text-xs font-bold text-emerald-600 mt-2 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            {trend}
          </p>
        )}
      </div>
    </Card>
  );
}

// --- Views ---

function DashboardView() {
  const COLORS = ['#1e3a8a', '#ca8a04', '#3b82f6', '#f59e0b', '#10b981'];
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Dasbor Eksekutif</h2>
        <p className="text-gray-500">Ringkasan kinerja pariwisata Indonesia tahun 2025.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Kedatangan" 
          value="12.5M" 
          trend="+14.3% YoY" 
          icon={Users} 
        />
        <MetricCard 
          title="Rata-rata Pengeluaran" 
          value="$1,250" 
          trend="+5.2% YoY" 
          icon={CreditCard} 
        />
        <MetricCard 
          title="Rata-rata Menginap" 
          value="7.2 Hari" 
          trend="+0.4 Hari" 
          icon={Calendar} 
        />
        <MetricCard 
          title="Sentimen Keseluruhan" 
          value="78% Positif" 
          trend="+2.1% YoY" 
          icon={LayoutDashboard} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-medium mb-4">Tren Kedatangan (Thn Berjalan)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_TOURISM_DATA.monthlyArrivals} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [value.toLocaleString(), 'Kedatangan']}
                />
                <Area type="monotone" dataKey="count" stroke="#1e3a8a" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Pertumbuhan Destinasi Teratas</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_TOURISM_DATA.topDestinations} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#374151' }} width={80} />
                <Tooltip 
                  cursor={{fill: '#f3f4f6'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`+${value}%`, 'Pertumbuhan YoY']}
                />
                <Bar dataKey="growth" fill="#ca8a04" radius={[0, 4, 4, 0]} barSize={24}>
                  {MOCK_TOURISM_DATA.topDestinations.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

function AIAssistantView() {
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: 'Halo. Saya adalah AI Nusantara Analytics. Anda dapat bertanya kepada saya tentang kinerja pariwisata Indonesia, tren, atau meminta saya membuat ringkasan untuk laporan Anda berdasarkan data tahun 2025.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    const response = await askTourismAI(userMessage);
    
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col rounded-[40px] backdrop-blur-md bg-white/40 border border-white/60 shadow-xl overflow-hidden">
      <div className="p-4 border-b border-white/40 bg-white/30 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
            Nusantara AI
          </h2>
          <p className="text-xs text-gray-500">Asisten Analitik Perusahaan</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
            <div className={cn(
              "max-w-[80%] rounded-2xl px-5 py-3.5 text-sm",
              msg.role === 'user' 
                ? "bg-blue-900 text-white shadow-md shadow-blue-200/50" 
                : "bg-white/60 border border-white/80 shadow-sm text-slate-800"
            )}>
              {msg.role === 'assistant' ? (
                <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-gray-800 prose-pre:text-gray-100">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl px-5 py-3.5 flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
              <span className="text-sm text-gray-500">Menganalisis data...</span>
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      <div className="p-4 bg-white/30 border-t border-white/40">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanyakan tentang pertumbuhan Bali, total kedatangan, atau saran strategi..."
            className="w-full pl-5 pr-14 py-3.5 bg-white/60 border border-white/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all text-sm shadow-sm"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-colors shadow-lg shadow-blue-200"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

// --- Main Layout ---

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ai'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Ringkasan', icon: LayoutDashboard },
    { id: 'ai', label: 'Tanya AI', icon: Sparkles },
    // Mock unavailable routes for UI completeness
    { id: 'destinations', label: 'Destinasi', icon: MapIcon },
  ] as const;

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800">
      
      {/* Top Nav (Desktop & Mobile) */}
      <nav className="h-16 px-4 md:px-8 flex items-center justify-between backdrop-blur-xl bg-white/40 border-b border-white/40 z-20 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 hidden md:block">Nusantara<span className="font-light">Analytics</span></span>
          <span className="font-bold text-xl tracking-tight text-slate-900 md:hidden">N.A.</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6 text-sm font-medium text-slate-600">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'dashboard' || item.id === 'ai') {
                    setActiveTab(item.id);
                  }
                }}
                className={cn(
                  "transition-colors",
                  activeTab === item.id ? "text-blue-900 font-bold" : "hover:text-blue-900"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="h-8 w-8 rounded-full bg-yellow-100 border border-yellow-200 flex items-center justify-center text-xs font-bold text-yellow-700">AD</div>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 md:hidden text-gray-600">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex p-4 md:p-6 gap-6 w-full max-w-7xl mx-auto h-[calc(100vh-4rem)]">
        <aside className={cn(
          "w-64 flex flex-col gap-4 transform transition-transform duration-200 ease-in-out absolute md:relative md:translate-x-0 inset-y-0 left-0 bg-white/80 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none z-10 p-4 md:p-0 h-full md:h-auto border-r border-white/60 md:border-none",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          {/* Active Filter Box replacing old sidebar nav */}
          <div className="p-5 rounded-3xl backdrop-blur-md bg-white/50 border border-white/60 shadow-sm flex flex-col">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center justify-between">
              Navigasi
            </h3>
            
            <div className="space-y-4 md:hidden mb-6">
               {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'dashboard' || item.id === 'ai') {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }
                  }}
                  className={cn(
                    "w-full flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-colors group",
                    activeTab === item.id 
                      ? "bg-white/60 text-blue-900 border border-white/80" 
                      : "text-slate-600 hover:bg-white/40"
                  )}
                >
                  <item.icon className={cn(
                    "w-4 h-4 mr-3 flex-shrink-0",
                    activeTab === item.id ? 'text-blue-900' : "text-slate-400"
                  )} />
                  {item.label}
                </button>
              ))}
            </div>

            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center justify-between hidden md:flex">
              Filter Aktif
            </h3>
            <div className="space-y-4 hidden md:block">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">WILAYAH</label>
                <div className="p-2 bg-white/60 rounded-xl border border-white/80 text-sm font-medium">Seluruh Indonesia</div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">RENTANG WAKTU</label>
                <div className="p-2 bg-white/60 rounded-xl border border-white/80 text-sm font-medium">30 Hari Terakhir</div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">SEGMEN PENGUNJUNG</label>
                <div className="p-2 bg-white/60 rounded-xl border border-white/80 text-sm font-medium">Mewah & Rekreasi</div>
              </div>
            </div>
          </div>
          
          <div className="p-5 rounded-3xl backdrop-blur-md bg-yellow-400/10 border border-yellow-200/50 flex-1 flex flex-col hidden md:flex">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-yellow-600">Peringatan AI</h3>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                "Perjalanan domestik ke <span className="font-bold">Labuan Bajo</span> diproyeksikan akan meningkat sebesar <span className="font-bold">14%</span> bulan depan."
              </p>
            </div>
            <button 
              onClick={() => setActiveTab('ai')}
              className="mt-4 w-full py-2 bg-yellow-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-yellow-200 hover:bg-yellow-600 transition-colors"
            >
              Buka Asisten
            </button>
          </div>
        </aside>

        <div className="flex-1 overflow-y-auto w-full min-h-0">
          {activeTab === 'dashboard' ? <DashboardView /> : <AIAssistantView />}
        </div>
      </main>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-10 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}

