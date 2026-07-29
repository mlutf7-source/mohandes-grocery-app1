import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  Home, BarChart3, Trash2, Settings, Receipt, HelpCircle, Store,
  Package, ShoppingCart, ArrowDownToLine, ClipboardList,
  ArrowUpCircle, ArrowDownCircle, Users, Factory, Wallet,
  Plus, X
} from 'lucide-react';
import Dialog from '@/components/ui/Dialog';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card'; // ⭐ استيراد مكون Card الجديد

const allPages = [
  { path: '/dashboard', label: 'لوحة التحكم', icon: BarChart3 },
  { path: '/products', label: 'المنتجات', icon: Package },
  { path: '/inventory', label: 'المخزون', icon: ClipboardList },
  { path: '/receipt', label: 'سند قبض', icon: ArrowUpCircle },
  { path: '/payment', label: 'سند صرف', icon: ArrowDownCircle },
  { path: '/customers', label: 'العملاء', icon: Users },
  { path: '/suppliers', label: 'الموردين', icon: Factory },
  { path: '/cashboxes', label: 'الصناديق', icon: Wallet },
  { path: '/expenses', label: 'المصروفات', icon: Receipt },
  { path: '/reports', label: 'التقارير', icon: BarChart3 },
  { path: '/trash', label: 'المحذوفات', icon: Trash2 },
  { path: '/guide', label: 'تعليمات', icon: HelpCircle },
  { path: '/store-info', label: 'المستخدم', icon: Store },
  { path: '/settings', label: 'الضبط', icon: Settings },
];

const fixedShortcuts = ['/', '/sales', '/purchases', '/reports'];

export default function BottomNav() {
  const location = useLocation();
  const [shortcuts, setShortcuts] = useState<string[]>(() => {
    const saved = localStorage.getItem('bakala-shortcuts');
    return saved ? JSON.parse(saved) : [];
  });
  const [editOpen, setEditOpen] = useState(false);

  const saveShortcuts = (list: string[]) => {
    setShortcuts(list);
    localStorage.setItem('bakala-shortcuts', JSON.stringify(list));
  };

  const toggleShortcut = (path: string) => {
    if (shortcuts.includes(path)) {
      saveShortcuts(shortcuts.filter(s => s !== path));
    } else {
      saveShortcuts([...shortcuts, path]);
    }
  };

  const getPageInfo = (path: string) => {
    if (path === '/') return { label: 'الرئيسية', icon: Home };
    if (path === '/sales') return { label: 'بيع منتج', icon: ShoppingCart };
    if (path === '/purchases') return { label: 'شراء منتج', icon: ArrowDownToLine };
    if (path === '/reports') return { label: 'التقارير', icon: BarChart3 };
    return allPages.find(p => p.path === path) || { label: '', icon: Home };
  };

  return (
    <>
      <nav className="bg-white/90 backdrop-blur-sm overflow-x-auto shadow-sm border-b border-border">
        <div className="flex h-[60px] px-3 gap-2 min-w-max items-center">
          
          {/* أيقونة الرئيسية (مربعة 4D) */}
          <NavLink
            to="/"
            end
            className="flex flex-col items-center justify-center"
          >
            {({ isActive }) => (
              <Card variant="icon" className={`w-[48px] h-[48px] ${isActive ? '!border-2 !border-primary' : ''}`}>
                <Home size={20} className={isActive ? 'text-primary' : 'text-text-secondary'} />
                <span className={`text-[10px] font-semibold ${isActive ? 'text-primary' : 'text-text-secondary'}`}>
                  الرئيسية
                </span>
              </Card>
            )}
          </NavLink>

          {/* فاصل */}
          <div className="w-px h-8 bg-border mx-1" />

          {/* أيقونات أساسية: بيع، شراء، تقارير */}
          {fixedShortcuts.filter(p => p !== '/').map((path) => {
            const page = getPageInfo(path);
            const isActive = location.pathname === path;
            const Icon = page.icon;

            return (
              <NavLink key={path} to={path} end className="flex flex-col items-center justify-center">
                <Card variant="icon" className={`w-[48px] h-[48px] ${isActive ? '!border-2 !border-primary' : ''}`}>
                  <Icon size={20} className={isActive ? 'text-primary' : 'text-text-secondary'} />
                  <span className={`text-[10px] font-semibold ${isActive ? 'text-primary' : 'text-text-secondary'}`}>
                    {page.label}
                  </span>
                </Card>
              </NavLink>
            );
          })}

          {/* أيقونات مخصصة (مربعة 4D) */}
          {shortcuts.map((path) => {
            const page = getPageInfo(path);
            const isActive = location.pathname === path;
            const Icon = page.icon;

            return (
              <NavLink key={path} to={path} end className="flex flex-col items-center justify-center">
                <Card variant="icon" className={`w-[48px] h-[48px] ${isActive ? '!border-2 !border-primary' : ''}`}>
                  <Icon size={20} className={isActive ? 'text-primary' : 'text-text-secondary'} />
                  <span className={`text-[10px] font-semibold ${isActive ? 'text-primary' : 'text-text-secondary'}`}>
                    {page.label}
                  </span>
                </Card>
              </NavLink>
            );
          })}

          {/* زر تخصيص (مربع 4D بألوان متغيرة) */}
          <button
            onClick={() => setEditOpen(true)}
            className="flex flex-col items-center justify-center"
          >
            <Card variant="icon" className="w-[48px] h-[48px] border-2 border-dashed border-primary/30 bg-primary/5">
              <Plus size={20} className="text-primary" />
              <span className="text-[10px] font-semibold text-primary">تخصيص</span>
            </Card>
          </button>
        </div>
      </nav>

      {/* نافذة تخصيص الاختصارات (دون تغيير) */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} title="تخصيص الشريط">
        <div className="space-y-3 pb-4">
          <p className="text-small text-text-secondary">
            اختر الاختصارات التي تريد إضافتها أو حذفها من الشريط.
          </p>

          <div>
            <h4 className="text-small font-bold mb-2">المختارة:</h4>
            <div className="flex flex-wrap gap-2">
              {shortcuts.length === 0 && <p className="text-small text-text-secondary">لا توجد اختصارات مضافة</p>}
              {shortcuts.map(path => {
                const page = getPageInfo(path);
                const Icon = page.icon;
                return (
                  <div key={path} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary-light text-primary text-small">
                    <Icon size={14} />
                    <span>{page.label}</span>
                    <button onClick={() => toggleShortcut(path)} className="text-danger hover:bg-danger/10 rounded-full p-0.5"><X size={12} /></button>
                  </div>
                );
              })}
            </div>
          </div>

          <hr />

          <div>
            <h4 className="text-small font-bold mb-2">جميع الصفحات:</h4>
            <div className="flex flex-wrap gap-2">
              {allPages.map(page => {
                const Icon = page.icon;
                const selected = shortcuts.includes(page.path);
                return (
                  <button
                    key={page.path}
                    onClick={() => toggleShortcut(page.path)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-small transition-colors ${
                      selected ? 'bg-primary text-white' : 'bg-gray-100 text-text-secondary hover:bg-primary-light'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{page.label}</span>
                    {selected ? <X size={12} /> : <Plus size={12} />}
                  </button>
                );
              })}
            </div>
          </div>

          <Button fullWidth onClick={() => setEditOpen(false)}>تم</Button>
        </div>
      </Dialog>
    </>
  );
                                                                   }
