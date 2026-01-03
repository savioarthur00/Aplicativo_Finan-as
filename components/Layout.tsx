
import React from 'react';
import { ViewType, UserProfile } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewType;
  setView: (view: ViewType) => void;
  user: UserProfile | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setView, user, onLogout }) => {
  const navItems = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: '📊' },
    { id: 'INCOME', label: 'Entradas', icon: '📈' },
    { id: 'EXPENSE', label: 'Saídas', icon: '📉' },
    { id: 'FINANCING', label: 'Financiamentos', icon: '🏠' },
    { id: 'INVESTMENTS', label: 'Investimentos', icon: '💰' },
    { id: 'GOALS', label: 'Metas', icon: '🎯' },
    { id: 'WISHES', label: 'Desejos', icon: '✨' },
    { id: 'SETTINGS', label: 'Configurações', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-72 bg-zinc-950 border-r border-zinc-900 flex-col sticky top-0 h-screen">
        <div className="p-8">
          <h1 className="text-xl font-bold tracking-tighter text-white flex items-center gap-2">
            <span className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center text-black font-black">F</span>
            FinancePro
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewType)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                activeView === item.id || (activeView === 'FINANCING_DETAILS' && item.id === 'FINANCING')
                  ? 'bg-zinc-800 text-white font-medium border border-zinc-700'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-zinc-900 bg-zinc-950/50">
          {user && (
            <div className="flex items-center gap-3 mb-4">
              <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full border border-zinc-800" />
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate text-white">{user.name}</p>
                <button onClick={onLogout} className="text-xs text-zinc-500 hover:text-rose-400 transition-colors">Sair da conta</button>
              </div>
            </div>
          )}
          <p className="text-[10px] text-zinc-700 uppercase tracking-widest text-center">v1.3.0 &copy; 2025</p>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-zinc-950 border-b border-zinc-900 p-4 sticky top-0 z-50 flex justify-between items-center overflow-x-auto">
         <h1 className="text-lg font-bold tracking-tighter text-white mr-4">FinancePro</h1>
         <div className="flex gap-1 shrink-0">
           {navItems.map((item) => (
             <button
                key={item.id}
                onClick={() => setView(item.id as ViewType)}
                className={`p-2 rounded-lg ${
                  activeView === item.id || (activeView === 'FINANCING_DETAILS' && item.id === 'FINANCING')
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-500'
                }`}
             >
               {item.icon}
             </button>
           ))}
         </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 overflow-auto bg-black">
        <div className="max-w-6xl mx-auto p-4 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
