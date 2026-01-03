
import React from 'react';
import { UserSettings, UserProfile, AppData } from '../types';

interface SettingsPageProps {
  settings: UserSettings;
  updateSettings: (s: Partial<UserSettings>) => void;
  user: UserProfile | null;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ settings, updateSettings, user }) => {
  
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) return;
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      updateSettings({ notificationsEnabled: true });
      new Notification("FinancePro", { body: "Notificações ativadas com sucesso!" });
    }
  };

  const handleExportData = () => {
    const data = localStorage.getItem('finance_pro_data');
    const users = localStorage.getItem('finance_pro_users_db');
    
    if (!data) return alert("Não há dados para exportar.");
    
    const exportObj = {
      appData: JSON.parse(data),
      usersDB: users ? JSON.parse(users) : []
    };
    
    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `finance_pro_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (imported.appData && imported.usersDB) {
          localStorage.setItem('finance_pro_data', JSON.stringify(imported.appData));
          localStorage.setItem('finance_pro_users_db', JSON.stringify(imported.usersDB));
          alert("Dados importados com sucesso! A página será reiniciada.");
          window.location.reload();
        } else {
          alert("Arquivo de backup inválido.");
        }
      } catch (err) {
        alert("Erro ao ler o arquivo de backup.");
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (confirm("ATENÇÃO: Isso apagará TODOS os seus dados financeiros e de login NESTE NAVEGADOR. Tem certeza?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500">
      <div>
        <h2 className="text-3xl font-bold">⚙️ Configurações</h2>
        <p className="text-zinc-400">Gerencie sua conta e preferências do sistema.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-3xl space-y-6">
          <h3 className="text-xl font-bold">Preferências do Sistema</h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
              <div>
                <p className="font-bold text-zinc-200">Notificações Push</p>
                <p className="text-xs text-zinc-500">Receba alertas de vencimento e orçamento.</p>
              </div>
              <button 
                onClick={settings.notificationsEnabled ? () => updateSettings({ notificationsEnabled: false }) : requestNotificationPermission}
                className={`w-14 h-7 rounded-full transition-all relative ${settings.notificationsEnabled ? 'bg-emerald-500' : 'bg-zinc-700'}`}
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${settings.notificationsEnabled ? 'left-8' : 'left-1'}`} />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-zinc-500 uppercase font-bold ml-1">Dia do Lembrete de Transação</label>
              <input 
                type="number" 
                min="1" max="28"
                value={settings.reminderDay}
                onChange={(e) => updateSettings({ reminderDay: Number(e.target.value) })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 outline-none focus:border-zinc-500"
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-zinc-900">
               <h4 className="text-xs font-bold uppercase text-zinc-500">Portabilidade de Dados</h4>
               <p className="text-[10px] text-zinc-600 uppercase">Use estas opções para migrar seus dados do localhost para a versão web.</p>
               <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={handleExportData}
                    className="flex flex-col items-center justify-center p-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-2xl transition-all gap-2"
                  >
                    <span className="text-xl">📤</span>
                    <span className="text-[10px] font-bold uppercase">Exportar Backup</span>
                  </button>
                  <label className="flex flex-col items-center justify-center p-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-2xl transition-all gap-2 cursor-pointer">
                    <span className="text-xl">📥</span>
                    <span className="text-[10px] font-bold uppercase">Importar Backup</span>
                    <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
                  </label>
               </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-3xl flex flex-col items-center justify-center text-center space-y-4">
          {user && (
            <>
              <img src={user.picture} alt={user.name} className="w-24 h-24 rounded-full border-4 border-zinc-900 shadow-2xl" />
              <div>
                <h3 className="text-xl font-bold">{user.name}</h3>
                <p className="text-zinc-500">{user.email}</p>
              </div>
              <div className="pt-6 w-full space-y-3">
                <button 
                  onClick={handleClearData}
                  className="w-full py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 font-bold hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/20 transition-all"
                >
                  Excluir todos os dados locais
                </button>
                <p className="text-[10px] text-zinc-700 uppercase tracking-widest">Atenção: A exclusão é irreversível.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;