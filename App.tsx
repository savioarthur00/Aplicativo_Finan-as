
import React, { useState, useEffect, useRef } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import IncomePage from './components/IncomePage';
import ExpensePage from './components/ExpensePage';
import FinancingPage from './components/FinancingPage';
import FinancingDetails from './components/FinancingDetails';
import GoalsPage from './components/GoalsPage';
import WishesPage from './components/WishesPage';
import InvestmentsPage from './components/InvestmentsPage';
import SettingsPage from './components/SettingsPage';
import { AppData, ViewType, Income, Expense, Financing, FinancingPayment, Goal, Wish, Investment, InvestmentContribution, UserSettings, UserProfile } from './types';

const INITIAL_SETTINGS: UserSettings = {
  notificationsEnabled: false,
  reminderDay: 5,
  budgetAlertThreshold: 0.8
};

const INITIAL_DATA: AppData = {
  incomes: [],
  expenses: [],
  financings: [],
  goals: [],
  wishes: [],
  investments: [],
  settings: INITIAL_SETTINGS
};

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('DASHBOARD');
  const [selectedFinancing, setSelectedFinancing] = useState<Financing | null>(null);
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth());
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  
  // Auth States
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('finance_pro_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [showAccountDiagnosis, setShowAccountDiagnosis] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  
  // Local DB simulation
  const [usersDB, setUsersDB] = useState<any[]>(() => {
    const saved = localStorage.getItem('finance_pro_users_db');
    return saved ? JSON.parse(saved) : [];
  });

  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem('finance_pro_data');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  const lastNotificationRef = useRef<number>(0);

  useEffect(() => {
    localStorage.setItem('finance_pro_data', JSON.stringify(data));
    checkNotifications();
  }, [data]);

  useEffect(() => {
    localStorage.setItem('finance_pro_users_db', JSON.stringify(usersDB));
  }, [usersDB]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('finance_pro_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('finance_pro_user');
    }
  }, [user]);

  // Auth Initialization
  useEffect(() => {
    /* @ts-ignore */
    if (typeof google !== 'undefined') {
       /* @ts-ignore */
       google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
        callback: handleGoogleResponse,
        auto_select: false,
      });

      if (!user && !isRegistering && !isRecovering && !showAccountDiagnosis) {
        /* @ts-ignore */
        google.accounts.id.renderButton(
          document.getElementById("googleBtn"),
          { theme: "filled_black", size: "large", width: "320" }
        );
      }
    }
  }, [user, isRegistering, isRecovering, showAccountDiagnosis]);

  const handleGoogleResponse = (response: any) => {
    try {
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      setUser({
        name: payload.name,
        email: payload.email,
        picture: payload.picture
      });
    } catch (e) {
      setAuthError('Erro ao autenticar com o Google.');
    }
  };

  const handleLocalLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError('');
    const formData = new FormData(e.currentTarget);
    const email = (formData.get('email') as string).toLowerCase().trim();
    const password = formData.get('password') as string;

    const foundUser = usersDB.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser({
        name: foundUser.name,
        email: foundUser.email,
        picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(foundUser.name)}&background=10b981&color=fff`
      });
    } else {
      const emailExists = usersDB.some(u => u.email === email);
      if (!emailExists) {
        setAuthError('E-mail não encontrado neste navegador. Clique em "Diagnóstico" para conferir.');
      } else {
        setAuthError('Senha incorreta para este e-mail. Use o "Diagnóstico" para recuperá-la.');
      }
    }
  };

  const handleLocalRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError('');
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = (formData.get('email') as string).toLowerCase().trim();
    const password = formData.get('password') as string;

    if (usersDB.some(u => u.email === email)) {
      setAuthError('Este e-mail já está cadastrado.');
      return;
    }

    const newUser = { name, email, password };
    setUsersDB(prev => [...prev, newUser]);
    setIsRegistering(false);
    setAuthError('');
    alert('Conta criada com sucesso! Agora você pode entrar.');
  };

  const handleResetPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError('');
    const formData = new FormData(e.currentTarget);
    const email = (formData.get('email') as string).toLowerCase().trim();
    const newPassword = formData.get('newPassword') as string;

    const userIndex = usersDB.findIndex(u => u.email === email);
    if (userIndex === -1) {
      setAuthError('E-mail não encontrado no sistema deste navegador.');
      return;
    }

    const updatedDB = [...usersDB];
    updatedDB[userIndex].password = newPassword;
    setUsersDB(updatedDB);
    setIsRecovering(false);
    setAuthError('');
    alert('Sua senha foi redefinida com sucesso!');
  };

  const checkNotifications = () => {
    if (!data.settings.notificationsEnabled || !('Notification' in window) || Notification.permission !== 'granted') return;
    const now = Date.now();
    if (now - lastNotificationRef.current < 3600000) return;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const today = new Date().getDate();

    const goal = data.goals.find(g => g.month === currentMonth && g.year === currentYear);
    if (goal) {
      const totalInc = data.incomes.filter(i => i.month === currentMonth && i.year === currentYear).reduce((a,c) => a+c.value, 0);
      const totalExp = data.expenses.filter(e => e.month === currentMonth && e.year === currentYear).reduce((a,c) => a+c.value, 0);
      const currentPct = totalInc > 0 ? (totalExp / totalInc) * 100 : 0;
      
      if (currentPct >= 100) {
        new Notification("Alerta Crítico", { body: "Suas despesas ultrapassaram 100% da sua renda!" });
        lastNotificationRef.current = now;
      } else if (currentPct >= data.settings.budgetAlertThreshold * 100) {
        new Notification("Aviso de Gastos", { body: `Suas despesas atingiram ${currentPct.toFixed(0)}% da sua renda.` });
        lastNotificationRef.current = now;
      }
    }

    data.financings.forEach(f => {
      if (f.dueDay === today) {
        const paid = f.payments.some(p => p.month === currentMonth && p.year === currentYear);
        if (!paid) {
          new Notification("Vencimento Hoje", { body: `O financiamento "${f.description}" vence hoje.` });
        }
      }
    });
  };

  const addIncome = (income: Omit<Income, 'id' | 'createdAt'>) => {
    setData(prev => ({ ...prev, incomes: [...prev.incomes, { ...income, id: crypto.randomUUID(), createdAt: Date.now() }] }));
  };

  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    setData(prev => ({ ...prev, expenses: [...prev.expenses, { ...expense, id: crypto.randomUUID(), createdAt: Date.now() }] }));
  };

  const addFinancing = (f: Omit<Financing, 'id' | 'payments' | 'createdAt'>) => {
    setData(prev => ({ ...prev, financings: [...prev.financings, { ...f, id: crypto.randomUUID(), payments: [], createdAt: Date.now() }] }));
  };

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    setData(prev => ({ ...prev, goals: [...prev.goals.filter(g => !(g.month === goal.month && g.year === goal.year)), { ...goal, id: crypto.randomUUID() }] }));
  };

  const deleteGoal = (id: string) => {
    setData(prev => ({ ...prev, goals: prev.goals.filter(g => g.id !== id) }));
  };

  const addWish = (wish: Omit<Wish, 'id' | 'createdAt'>) => {
    setData(prev => ({ ...prev, wishes: [...prev.wishes, { ...wish, id: crypto.randomUUID(), createdAt: Date.now() }] }));
  };

  const deleteWish = (id: string) => {
    setData(prev => ({ ...prev, wishes: prev.wishes.filter(w => w.id !== id) }));
  };

  const addInvestment = (inv: Omit<Investment, 'id' | 'contributions' | 'createdAt'>) => {
    setData(prev => ({ ...prev, investments: [...prev.investments, { ...inv, id: crypto.randomUUID(), contributions: [], createdAt: Date.now() }] }));
  };

  const deleteInvestment = (id: string) => {
    setData(prev => ({ ...prev, investments: prev.investments.filter(i => i.id !== id) }));
  };

  const addContribution = (invId: string, contribution: Omit<InvestmentContribution, 'id' | 'createdAt'>) => {
    setData(prev => ({
      ...prev,
      investments: prev.investments.map(inv => 
        inv.id === invId 
        ? { ...inv, contributions: [...inv.contributions, { ...contribution, id: crypto.randomUUID(), createdAt: Date.now() }] }
        : inv
      )
    }));
  };

  const deleteContribution = (invId: string, contribId: string) => {
    setData(prev => ({
      ...prev,
      investments: prev.investments.map(inv => 
        inv.id === invId 
        ? { ...inv, contributions: inv.contributions.filter(c => c.id !== contribId) }
        : inv
      )
    }));
  };

  const updateSettings = (s: Partial<UserSettings>) => {
    setData(prev => ({ ...prev, settings: { ...prev.settings, ...s } }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white overflow-y-auto">
        <div className="max-w-md w-full py-10 space-y-8 animate-in zoom-in duration-500">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-emerald-500 rounded-3xl flex items-center justify-center text-black font-black text-4xl mx-auto shadow-2xl shadow-emerald-500/20">F</div>
            <h1 className="text-4xl font-black tracking-tight pt-4">FinancePro</h1>
            <p className="text-zinc-500">Controle Financeiro Local e Privado</p>
          </div>

          <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
            {!isRecovering && !showAccountDiagnosis && (
              <>
                <div className="flex flex-col items-center space-y-4">
                  <div id="googleBtn" className="w-full flex justify-center"></div>
                </div>

                <div className="flex items-center gap-4 text-zinc-700">
                  <div className="h-px bg-zinc-900 flex-1"></div>
                  <span className="text-[10px] uppercase font-bold tracking-widest">ou use e-mail</span>
                  <div className="h-px bg-zinc-900 flex-1"></div>
                </div>
              </>
            )}

            {showAccountDiagnosis ? (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="text-center">
                  <h3 className="font-bold text-emerald-400 text-lg">Diagnóstico de Acesso</h3>
                  <p className="text-xs text-zinc-500 mt-1">Como este app é local, mostramos suas senhas aqui para que você nunca perca seus dados:</p>
                </div>
                
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 max-h-64 overflow-y-auto space-y-3">
                  {usersDB.length === 0 ? (
                    <div className="py-6 text-center">
                      <p className="text-xs text-zinc-600 italic">Nenhuma conta cadastrada NESTE NAVEGADOR.</p>
                      <p className="text-[10px] text-zinc-700 mt-2">Dica: Se você usava em outro celular ou PC, seus dados estão lá.</p>
                    </div>
                  ) : (
                    usersDB.map(u => (
                      <div key={u.email} className="bg-zinc-800 p-4 rounded-xl border border-zinc-700 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-zinc-500 uppercase font-bold">Usuário</span>
                          <span className="text-xs font-black text-emerald-400">{u.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-zinc-500 uppercase font-bold">E-mail</span>
                          <span className="text-xs text-zinc-300">{u.email}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-zinc-700">
                          <span className="text-[10px] text-zinc-500 uppercase font-bold">Senha Salva</span>
                          <span className="text-xs font-mono bg-black px-2 py-0.5 rounded text-white select-all">{u.password}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <button 
                  onClick={() => setShowAccountDiagnosis(false)}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl transition-all"
                >
                  VOLTAR AO LOGIN
                </button>
              </div>
            ) : isRecovering ? (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="font-bold text-emerald-400 text-lg">Definir Nova Senha</h3>
                  <p className="text-xs text-zinc-500 mt-1">Isso atualizará sua senha local para este e-mail.</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-500 font-bold ml-1 uppercase">Confirme seu E-mail</label>
                  <input name="email" type="email" required className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 outline-none focus:border-emerald-500" placeholder="savio1281@gmail.com" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-500 font-bold ml-1 uppercase">Nova Senha Escolhida</label>
                  <input name="newPassword" type="text" required className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 outline-none focus:border-emerald-500" placeholder="Digite sua nova senha" />
                </div>
                {authError && <p className="text-xs text-rose-500 text-center font-bold bg-rose-500/10 p-2 rounded-lg">{authError}</p>}
                <button type="submit" className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-zinc-200 transition-all active:scale-95 shadow-lg">
                  ATUALIZAR SENHA
                </button>
                <button type="button" onClick={() => { setIsRecovering(false); setAuthError(''); }} className="w-full text-zinc-500 text-xs font-bold hover:text-white transition-colors">
                  CANCELAR E VOLTAR
                </button>
              </form>
            ) : (
              <form onSubmit={isRegistering ? handleLocalRegister : handleLocalLogin} className="space-y-4">
                {isRegistering && (
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-500 font-bold ml-1 uppercase">Como quer ser chamado?</label>
                    <input name="name" type="text" required className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 outline-none focus:border-emerald-500" placeholder="Sávio" />
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-xs text-zinc-500 font-bold ml-1 uppercase">E-mail</label>
                  <input name="email" type="email" required className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 outline-none focus:border-emerald-500" placeholder="savio1281@gmail.com" />
                </div>
                <div className="space-y-1 relative">
                  <div className="flex justify-between items-center">
                    <label className="text-xs text-zinc-500 font-bold ml-1 uppercase">Senha</label>
                    {!isRegistering && (
                      <button type="button" onClick={() => { setIsRecovering(true); setAuthError(''); }} className="text-[10px] text-emerald-500 font-bold hover:underline">Esqueci a senha</button>
                    )}
                  </div>
                  <div className="relative">
                    <input 
                      name="password" 
                      type={showPassword ? "text" : "password"} 
                      required 
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-4 pr-12 outline-none focus:border-emerald-500" 
                      placeholder="••••••••" 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                {authError && <p className="text-xs text-rose-500 text-center font-bold bg-rose-500/10 p-2 rounded-lg">{authError}</p>}

                <button type="submit" className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-zinc-200 transition-all active:scale-95 shadow-lg">
                  {isRegistering ? 'CRIAR MINHA CONTA LOCAL' : 'ENTRAR NO SISTEMA'}
                </button>
              </form>
            )}

            {!isRecovering && !showAccountDiagnosis && (
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center px-2">
                   <button 
                    onClick={() => { setIsRegistering(!isRegistering); setAuthError(''); }} 
                    className="text-emerald-400 text-xs font-bold hover:underline"
                   >
                    {isRegistering ? 'Já tenho conta' : 'Ainda não tenho conta'}
                   </button>
                   <button 
                    onClick={() => setShowAccountDiagnosis(true)}
                    className="text-zinc-500 text-[10px] font-bold hover:text-white transition-colors flex items-center gap-1"
                   >
                     🔍 Conferir meu login/senha
                   </button>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-900">
                  <p className="text-[10px] text-zinc-400 leading-relaxed text-center uppercase tracking-tight">
                    🔒 <strong>Segurança Total:</strong> Seus dados financeiros não saem deste dispositivo. Eles estão salvos no banco de dados local do seu navegador.
                  </p>
                </div>
              </div>
            )}
          </div>
          <p className="text-[10px] text-zinc-800 uppercase tracking-widest text-center">Desenvolvido com foco em Privacidade de Dados</p>
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (view) {
      case 'DASHBOARD': return <Dashboard data={data} filterMonth={filterMonth} filterYear={filterYear} setFilterMonth={setFilterMonth} setFilterYear={setFilterYear} />;
      case 'INCOME': return <IncomePage incomes={data.incomes} addIncome={addIncome} deleteIncome={(id) => setData(p => ({...p, incomes: p.incomes.filter(i => i.id !== id)}))} filterMonth={filterMonth} filterYear={filterYear} />;
      case 'EXPENSE': return <ExpensePage expenses={data.expenses} addExpense={addExpense} deleteExpense={(id) => setData(p => ({...p, expenses: p.expenses.filter(e => e.id !== id)}))} filterMonth={filterMonth} filterYear={filterYear} />;
      case 'FINANCING': return <FinancingPage financings={data.financings} addFinancing={addFinancing} selectFinancing={(f) => { setSelectedFinancing(f); setView('FINANCING_DETAILS'); }} />;
      case 'FINANCING_DETAILS': return selectedFinancing ? (
        <FinancingDetails 
          financing={data.financings.find(f => f.id === selectedFinancing.id) || selectedFinancing} 
          onBack={() => setView('FINANCING')} 
          addPayment={(fid, p) => setData(prev => ({ ...prev, financings: prev.financings.map(f => f.id === fid ? {...f, payments: [...f.payments, {...p, id: crypto.randomUUID(), createdAt: Date.now()}]} : f) }))}
          deletePayment={(fid, pid) => setData(prev => ({ ...prev, financings: prev.financings.map(f => f.id === fid ? {...f, payments: f.payments.filter(p => p.id !== pid)} : f) }))}
        />
      ) : null;
      case 'INVESTMENTS': return <InvestmentsPage investments={data.investments} addInvestment={addInvestment} addContribution={addContribution} deleteInvestment={deleteInvestment} deleteContribution={deleteContribution} />;
      case 'GOALS': return <GoalsPage goals={data.goals} addGoal={addGoal} deleteGoal={deleteGoal} currentMonth={filterMonth} currentYear={filterYear} />;
      case 'WISHES': return <WishesPage wishes={data.wishes} addWish={addWish} deleteWish={deleteWish} />;
      case 'SETTINGS': return <SettingsPage settings={data.settings} updateSettings={updateSettings} user={user} />;
      default: return null;
    }
  };

  return (
    <Layout activeView={view} setView={setView} user={user} onLogout={() => setUser(null)}>
      {renderView()}
    </Layout>
  );
};

export default App;
