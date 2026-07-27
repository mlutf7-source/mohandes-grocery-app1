import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Dialog from '@/components/ui/Dialog';
import {
  ShoppingCart, ArrowDownToLine, BarChart3, Package, ClipboardList,
    ArrowUpCircle, ArrowDownCircle, Users, Factory, Wallet, Receipt,
      HelpCircle, Settings, Trash2, BookOpen, Store
      } from 'lucide-react';

      const items = [
        // الأساسية - الأكثر استخداماً
          { title: 'بيع منتج', icon: ShoppingCart, path: '/sales', color: 'text-success', bg: 'bg-success/10', desc: 'إنشاء فاتورة بيع نقدي أو آجل. ابحث عن المنتج وأضفه للفاتورة. يمكنك تعديل أو حذف الفواتير السابقة.' },
            { title: 'شراء منتج', icon: ArrowDownToLine, path: '/purchases', color: 'text-warning', bg: 'bg-warning/10', desc: 'إنشاء فاتورة شراء من مورد. اختر وحدة الشراء (كرتون/حبة) والنظام يحولها تلقائياً للمخزون.' },
              { title: 'المخزون', icon: ClipboardList, path: '/inventory', color: 'text-info', bg: 'bg-info/10', desc: 'مراقبة المخزون الحالي. يظهر عدد الحبات والكراتين، قيمة المخزون، وتنبيهات للمنتجات منخفضة المخزون أو القديمة.' },
                { title: 'المنتجات', icon: Package, path: '/products', color: 'text-primary', bg: 'bg-primary-light', desc: 'إضافة وتعديل وحذف المنتجات. يمكنك إدخال المنتج بالكرتون أو الحبة، وتحديد سعر الشراء والبيع، ومسح الباركود.' },
                  
                    // السندات
                      { title: 'سند قبض', icon: ArrowUpCircle, path: '/receipt', color: 'text-success', bg: 'bg-success/10', desc: 'تسجيل مبلغ تم استلامه من عميل أو مورد. يزيد الصندوق ويقلل رصيد الحساب.' },
                        { title: 'سند صرف', icon: ArrowDownCircle, path: '/payment', color: 'text-danger', bg: 'bg-danger/10', desc: 'تسجيل مبلغ تم دفعه إلى مورد أو عميل. ينقص الصندوق ويقلل رصيد المورد أو يزيد رصيد العميل.' },
                          
                            // الحسابات
                              { title: 'العملاء', icon: Users, path: '/customers', color: 'text-info', bg: 'bg-info/10', desc: 'إدارة حسابات العملاء: إضافة وتعديل وحذف. عرض الرصيد (عليه/له) وكشف حساب كامل.' },
                                { title: 'الموردين', icon: Factory, path: '/suppliers', color: 'text-warning', bg: 'bg-warning/10', desc: 'إدارة حسابات الموردين: إضافة وتعديل وحذف. عرض الرصيد (له/عليه) وكشف حساب كامل.' },
                                  { title: 'الصناديق', icon: Wallet, path: '/cashboxes', color: 'text-success', bg: 'bg-success/10', desc: 'إدارة الصناديق النقدية. الصندوق الرئيسي جاهز افتراضياً. يمكنك إضافة صناديق أخرى وعرض آخر الحركات.' },
                                    { title: 'المصروفات', icon: Receipt, path: '/expenses', color: 'text-danger', bg: 'bg-danger/10', desc: 'تسجيل المصروفات اليومية: إيجارات، رواتب، كهرباء، وغيرها. اختر الصندوق والمبلغ والتاريخ.' },
                                      
                                        // التقارير والتحكم
                                          { title: 'لوحة التحكم', icon: BarChart3, path: '/dashboard', color: 'text-primary', bg: 'bg-primary-light', desc: 'نظرة عامة على أداء المتجر: رصيد الصناديق، المخزون، المبيعات، المشتريات، الأرباح والمصروفات.' },
                                            { title: 'التقارير', icon: BarChart3, path: '/reports', color: 'text-info', bg: 'bg-info/10', desc: 'تقارير شاملة: كشوف حسابات العملاء والموردين والصناديق، المبيعات، المشتريات، المخزون، الأرباح والمصروفات.' },
                                              
                                                // أدوات وإعدادات
                                                  { title: 'الإعدادات', icon: Settings, path: '/settings', color: 'text-text-secondary', bg: 'bg-gray-100', desc: 'تخصيص التطبيق: العملة، النسخ الاحتياطي، قفل التطبيق، معلومات المطور.' },
                                                    { title: 'تعليمات', icon: BookOpen, path: '/guide', color: 'text-info', bg: 'bg-info/10', desc: 'شرح كامل لطريقة استخدام جميع أقسام التطبيق ونصائح للمستخدم.' },
                                                      { title: 'سلة المحذوفات', icon: Trash2, path: '/trash', color: 'text-danger', bg: 'bg-danger/10', desc: 'استعادة أو حذف نهائي للعناصر المحذوفة: منتجات، عملاء، موردين، فواتير، سندات.' },
                                                        { title: 'بيانات المستخدم', icon: Store, path: '/store-info', color: 'text-primary', bg: 'bg-primary-light', desc: 'تحديث بيانات المتجر: الاسم، المالك، الهاتف، العنوان، والشعار.' },
                                                        ];

                                                        export default function Home() {
                                                          const nav = useNavigate();
                                                            const [infoOpen, setInfoOpen] = useState(false);
                                                              const [infoTitle, setInfoTitle] = useState('');
                                                                const [infoDesc, setInfoDesc] = useState('');

                                                                  const openInfo = (title: string, desc: string) => {
                                                                      setInfoTitle(title);
                                                                          setInfoDesc(desc);
                                                                              setInfoOpen(true);
                                                                                };

                                                                                  return (
                                                                                      <div className="page-container">
                                                                                            <div className="grid grid-cols-2 gap-4">
                                                                                                    {items.map((item, i) => {
                                                                                                              const Icon = item.icon;
                                                                                                                        return (
                                                                                                                                    <Card key={i} accent className="!p-4 text-center cursor-pointer hover:shadow-card-hover transition-shadow relative" onClick={() => nav(item.path)}>
                                                                                                                                                  <button
                                                                                                                                                                  className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 text-amber-600 text-small font-semibold hover:bg-amber-100 transition-colors border border-amber-200"
                                                                                                                                                                                  onClick={(e) => { e.stopPropagation(); openInfo(item.title, item.desc); }}
                                                                                                                                                                                                >
                                                                                                                                                                                                                <HelpCircle size={12} />
                                                                                                                                                                                                                                <span>شرح</span>
                                                                                                                                                                                                                                              </button>
                                                                                                                                                                                                                                                            <div className={`${item.bg} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                                                                                                                                                                                                                                                                            <Icon size={32} className={item.color} />
                                                                                                                                                                                                                                                                                          </div>
                                                                                                                                                                                                                                                                                                        <p className="text-body font-bold text-text-primary">{item.title}</p>
                                                                                                                                                                                                                                                                                                                    </Card>
                                                                                                                                                                                                                                                                                                                              );
                                                                                                                                                                                                                                                                                                                                      })}
                                                                                                                                                                                                                                                                                                                                            </div>

                                                                                                                                                                                                                                                                                                                                                  <Dialog open={infoOpen} onClose={() => setInfoOpen(false)} title={infoTitle}>
                                                                                                                                                                                                                                                                                                                                                          <div className="space-y-3 pb-4">
                                                                                                                                                                                                                                                                                                                                                                    <p className="text-body text-text-secondary leading-relaxed">{infoDesc}</p>
                                                                                                                                                                                                                                                                                                                                                                              <button onClick={() => setInfoOpen(false)} className="w-full py-2 bg-primary text-white rounded-btn text-small font-semibold">فهمت</button>
                                                                                                                                                                                                                                                                                                                                                                                      </div>
                                                                                                                                                                                                                                                                                                                                                                                            </Dialog>
                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                  );
                                                                                                                                                                                                                                                                                                                                                                                                  }