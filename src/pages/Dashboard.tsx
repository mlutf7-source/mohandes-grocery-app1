import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import Card from '@/components/ui/Card';
import { Wallet, Package, ShoppingCart, ArrowDownToLine, Users, Factory, Receipt, TrendingUp } from 'lucide-react';

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

export default function Dashboard() {
  const s = useStore();
    const currency = s.settings?.currency || 'ريال يمني';
      const nav = useNavigate();

        const totalCash = s.cashBoxes.reduce((sum: number, b: any) => sum + b.balance, 0);
          const totalStock = s.products.reduce((sum: number, p: any) => sum + (p.stockQuantity || 0), 0);
            const stockValue = s.products.reduce((sum: number, p: any) => sum + (p.stockQuantity || 0) * (p.lastPurchasePrice || p.purchasePrice || 0), 0);
              const todaySales = s.getTodaySales();
                const todayPurchases = s.getTodayPurchases();
                  const totalProfit = s.getTotalProfit();
                    const totalExpenses = s.getTotalExpenses();
                      const customerDebts = s.customers.reduce((sum: number, c: any) => sum + (c.balance || 0), 0);
                        const supplierDebts = s.suppliers.reduce((sum: number, sup: any) => sum + (sup.balance || 0), 0);

                          const cashStatus = totalCash > 0 ? 'عليه' : totalCash < 0 ? 'له' : '';
                            const cashColor = totalCash > 0 ? 'text-danger' : totalCash < 0 ? 'text-success' : 'text-info';
                              const cashBg = totalCash > 0 ? 'bg-danger/10' : totalCash < 0 ? 'bg-success/10' : 'bg-info/10';

                                const custStatus = customerDebts > 0 ? 'عليه' : customerDebts < 0 ? 'له' : '';
                                  const custColor = customerDebts > 0 ? 'text-danger' : customerDebts < 0 ? 'text-success' : 'text-info';
                                    const custBg = customerDebts > 0 ? 'bg-danger/10' : customerDebts < 0 ? 'bg-success/10' : 'bg-info/10';

                                      const supStatus = supplierDebts > 0 ? 'له' : supplierDebts < 0 ? 'عليه' : '';
                                        const supColor = supplierDebts > 0 ? 'text-success' : supplierDebts < 0 ? 'text-danger' : 'text-info';
                                          const supBg = supplierDebts > 0 ? 'bg-success/10' : supplierDebts < 0 ? 'bg-danger/10' : 'bg-info/10';

                                            const cards = [
                                                { title: 'رصيد الصناديق', value: cashStatus ? `${fmt(Math.abs(totalCash))} (${cashStatus})` : fmt(Math.abs(totalCash)), suffix: currency, icon: Wallet, color: cashColor, bg: cashBg, path: '/cashboxes' },
                                                    { title: 'عدد المنتجات', value: fmt(s.products.length), suffix: 'منتج', icon: Package, color: 'text-info', bg: 'bg-info/10', path: '/products' },
                                                        { title: 'إجمالي المخزون', value: fmt(totalStock), suffix: 'حبة', icon: Package, color: 'text-info', bg: 'bg-info/10', path: '/inventory' },
                                                            { title: 'قيمة المخزون', value: fmt(stockValue), suffix: currency, icon: Package, color: 'text-success', bg: 'bg-success/10', path: '/inventory' },
                                                                { title: 'مبيعات اليوم (نقدي)', value: fmt(todaySales.cash), suffix: currency, icon: ShoppingCart, color: 'text-success', bg: 'bg-success/10', path: '/reports' },
                                                                    { title: 'مبيعات اليوم (آجل)', value: fmt(todaySales.credit), suffix: currency, icon: ShoppingCart, color: 'text-warning', bg: 'bg-warning/10', path: '/reports' },
                                                                        { title: 'مشتريات اليوم (نقدي)', value: fmt(todayPurchases.cash), suffix: currency, icon: ArrowDownToLine, color: 'text-info', bg: 'bg-info/10', path: '/reports' },
                                                                            { title: 'مشتريات اليوم (آجل)', value: fmt(todayPurchases.credit), suffix: currency, icon: ArrowDownToLine, color: 'text-warning', bg: 'bg-warning/10', path: '/reports' },
                                                                                { title: 'ديون العملاء', value: custStatus ? `${fmt(Math.abs(customerDebts))} (${custStatus})` : fmt(Math.abs(customerDebts)), suffix: currency, icon: Users, color: custColor, bg: custBg, path: '/customers' },
                                                                                    { title: 'حساب الموردين', value: supStatus ? `${fmt(Math.abs(supplierDebts))} (${supStatus})` : fmt(Math.abs(supplierDebts)), suffix: currency, icon: Factory, color: supColor, bg: supBg, path: '/suppliers' },
                                                                                        { title: 'صافي الأرباح', value: fmt(totalProfit), suffix: currency, icon: TrendingUp, color: 'text-success', bg: 'bg-success/10', path: '/reports' },
                                                                                            { title: 'المصروفات', value: fmt(totalExpenses), suffix: currency, icon: Receipt, color: 'text-danger', bg: 'bg-danger/10', path: '/expenses' },
                                                                                              ];

                                                                                                return (
                                                                                                    <div className="page-container">
                                                                                                          <h1 className="page-title">لوحة التحكم</h1>
                                                                                                                <div className="grid grid-cols-2 gap-3">
                                                                                                                        {cards.map((card, i) => {
                                                                                                                                  const Icon = card.icon;
                                                                                                                                            return (
                                                                                                                                                        <Card key={i} accent onClick={() => nav(card.path)}>
                                                                                                                                                                      <div className={`${card.bg} w-10 h-10 rounded-xl flex items-center justify-center mb-2`}>
                                                                                                                                                                                      <Icon size={20} className={card.color} />
                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                  <p className="text-body font-bold text-text-primary">{card.title}</p>
                                                                                                                                                                                                                                <p className={`text-financial mt-1 ${card.color}`}>{card.value} <span className="text-small">{card.suffix}</span></p>
                                                                                                                                                                                                                                            </Card>
                                                                                                                                                                                                                                                      );
                                                                                                                                                                                                                                                              })}
                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                          );
                                                                                                                                                                                                                                                                          }