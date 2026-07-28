import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard';
import Products from '@/pages/Products';
import Sales from '@/pages/Sales';
import Purchases from '@/pages/Purchases';
import Inventory from '@/pages/Inventory';
import Customers from '@/pages/Customers';
import Suppliers from '@/pages/Suppliers';
import CashBoxes from '@/pages/CashBoxes';
import Expenses from '@/pages/Expenses';
import ReportsPage from '@/pages/ReportsPage';
import Settings from '@/pages/Settings';
import Trash from '@/pages/Trash';
import Guide from '@/pages/Guide';
import Receipt from '@/pages/Receipt';
import Payment from '@/pages/Payment';
import StoreInfo from '@/pages/StoreInfo';
import LockScreen from '@/pages/LockScreen';
import Notifications from '@/pages/Notifications';
import ActivationPage from '@/pages/ActivationPage';
import AdminPage from '@/pages/admin/AdminPage';
import { checkAllNotifications } from '@/utils/checkNotifications';
import { autoBackup } from '@/utils/backup';
import { isTrialExpired, isActivated } from '@/utils/activation';

const APP_MODE = import.meta.env.VITE_APP_MODE || 'user';

function App() {
  const [unlocked, setUnlocked] = useState(!localStorage.getItem('app-passcode'));
  const [activated, setActivated] = useState(APP_MODE === 'admin');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const passcode = localStorage.getItem('app-passcode');
    if (!passcode) setUnlocked(true);
  }, []);

  useEffect(() => {
    async function check() {
      if (APP_MODE === 'admin') {
        setActivated(true);
        setLoading(false);
        return;
      }
      const expired = await isTrialExpired();
      const act = await isActivated();
      setActivated(!expired || act);
      setLoading(false);
    }
    check();
  }, []);

  useEffect(() => {
    if (!unlocked || !activated) return;

    checkAllNotifications();
    autoBackup();

    const interval = setInterval(() => {
      checkAllNotifications();
      autoBackup();
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [unlocked, activated]);

  if (loading) return null;

  if (!unlocked) {
    return <LockScreen onUnlock={() => setUnlocked(true)} />;
  }

  if (!activated) {
    return <ActivationPage onActivated={() => setActivated(true)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="sales" element={<Sales />} />
          <Route path="purchases" element={<Purchases />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="customers" element={<Customers />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="cashboxes" element={<CashBoxes />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="receipt" element={<Receipt />} />
          <Route path="payment" element={<Payment />} />
          <Route path="trash" element={<Trash />} />
          <Route path="guide" element={<Guide />} />
          <Route path="store-info" element={<StoreInfo />} />
          <Route path="settings" element={<Settings />} />
          <Route path="notifications" element={<Notifications />} />
          {/* صفحة المسؤول تظهر فقط عند بناء نسخة المسؤول */}
          {APP_MODE === 'admin' && (
            <Route path="admin" element={<AdminPage />} />
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
