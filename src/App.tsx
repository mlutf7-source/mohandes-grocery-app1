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
import { checkAllNotifications } from '@/utils/checkNotifications';
import { autoBackup } from '@/utils/backup';

function App() {
  const [unlocked, setUnlocked] = useState(!localStorage.getItem('app-passcode'));

    useEffect(() => {
        const passcode = localStorage.getItem('app-passcode');
            if (!passcode) setUnlocked(true);
              }, []);

                // فحص الإشعارات والنسخ الاحتياطي
                  useEffect(() => {
                      if (!unlocked) return;
                          
                              checkAllNotifications();
                                  autoBackup();
                                      
                                          const interval = setInterval(() => {
                                                checkAllNotifications();
                                                      autoBackup();
                                                          }, 30 * 60 * 1000);

                                                              return () => clearInterval(interval);
                                                                }, [unlocked]);

                                                                  if (!unlocked) {
                                                                      return <LockScreen onUnlock={() => setUnlocked(true)} />;
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
                                                                                                                                                                                                                                                                                        </Route>
                                                                                                                                                                                                                                                                                              </Routes>
                                                                                                                                                                                                                                                                                                  </BrowserRouter>
                                                                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                                                                    }

                                                                                                                                                                                                                                                                                                    export default App;