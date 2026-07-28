import { useState, useEffect } from 'react';
import { Store, ArrowRight, Moon, Sun, LogOut, Bell } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';
import { getUnreadCount } from '@/utils/notifications';

export default function Header() {
  const nav = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [dark, setDark] = useState(localStorage.getItem('theme') === 'dark');

  const storeName = localStorage.getItem('store-name') || 'البقالات';
  const storeLogo = localStorage.getItem('store-logo') || '';
  const storeOwner = localStorage.getItem('store-owner') || '';

  const unread = getUnreadCount();

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  const handleBack = () => {
    if (isHome) {
      if (confirm('هل تريد الخروج من النظام؟')) window.close();
    } else {
      const hasChanges = (window as any).__hasUnsavedChanges;
      if (hasChanges) {
        if (confirm('لديك تغييرات غير محفوظة. هل تريد المغادرة؟')) {
          (window as any).__hasUnsavedChanges = false;
          nav(-1);
        }
      } else {
        nav(-1);
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-primary shadow-md">
      <div className="h-[60px] flex items-center justify-between px-4">
        <div className="w-[40px]">
          <button onClick={handleBack} className="text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors">
            {isHome ? <LogOut size={22} /> : <ArrowRight size={22} />}
          </button>
        </div>

        <div className="flex items-center gap-2 mr-8">
          {storeLogo ? (
            <img src={storeLogo} alt={storeName} className="w-8 h-8 rounded-lg object-cover" />
          ) : (
            <Store size={28} className="text-white" />
          )}
          <div>
            <h1 className="text-app-title text-white">{storeName}</h1>
            {storeOwner && <p className="text-small text-white/70">{storeOwner}</p>}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button onClick={() => nav('/notifications')} className="relative text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors">
            <Bell size={22} />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white text-xs rounded-full flex items-center justify-center font-bold">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>
          <button onClick={() => setDark(!dark)} className="text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors">
            {dark ? <Sun size={22} /> : <Moon size={22} />}
          </button>
        </div>
      </div>
      <BottomNav />
    </header>
  );
    }
