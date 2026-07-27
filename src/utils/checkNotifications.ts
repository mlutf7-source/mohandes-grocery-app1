import { addNotification } from './notifications';
import { useStore } from '@/store';

// فحص الإشعارات
export function checkAllNotifications() {
  const s = useStore.getState();
    const now = new Date();
      const today = now.toISOString().split('T')[0];

        // 1. منتجات وصلت للحد الأدنى
          s.products.forEach((p: any) => {
              if (p.stockQuantity <= (p.minStock || 20)) {
                    addNotification({
                            title: '⚠️ مخزون منخفض',
                                    body: `المنتج "${p.name}" وصل للحد الأدنى (${p.stockQuantity} حبة)`,
                                            type: 'warning',
                                                  });
                                                      }
                                                        });

                                                          // 2. منتجات راكدة أكثر من 6 أشهر
                                                            const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
                                                              s.products.forEach((p: any) => {
                                                                  if (p.createdAt && new Date(p.createdAt) < sixMonthsAgo) {
                                                                        addNotification({
                                                                                title: '⏰ منتج راكد',
                                                                                        body: `المنتج "${p.name}" موجود في المخزون منذ أكثر من 6 أشهر`,
                                                                                                type: 'warning',
                                                                                                      });
                                                                                                          }
                                                                                                            });

                                                                                                              // 3. منتجات لم تبع منذ أسبوع
                                                                                                                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                                                                                                                  const soldProducts = new Set(
                                                                                                                      s.sales
                                                                                                                            .filter((sale: any) => new Date(sale.createdAt) > weekAgo)
                                                                                                                                  .flatMap((sale: any) => sale.items.map((i: any) => i.productId))
                                                                                                                                    );
                                                                                                                                      s.products.forEach((p: any) => {
                                                                                                                                          if (!soldProducts.has(p.id) && p.stockQuantity > 0) {
                                                                                                                                                addNotification({
                                                                                                                                                        title: '📉 حركة شراء ضعيفة',
                                                                                                                                                                body: `المنتج "${p.name}" لم يتم بيع أي حبة منه خلال الأسبوع الماضي`,
                                                                                                                                                                        type: 'info',
                                                                                                                                                                              });
                                                                                                                                                                                  }
                                                                                                                                                                                    });

                                                                                                                                                                                      // 4. مبيعات آجلة أكثر من النقدية
                                                                                                                                                                                        const todaySales = s.sales.filter((s: any) => s.createdAt.startsWith(today));
                                                                                                                                                                                          const cashSales = todaySales.filter((s: any) => s.type === 'cash').reduce((a: number, s: any) => a + s.total, 0);
                                                                                                                                                                                            const creditSales = todaySales.filter((s: any) => s.type === 'credit').reduce((a: number, s: any) => a + s.total, 0);
                                                                                                                                                                                              if (creditSales > cashSales && now.getHours() === 23 && now.getMinutes() >= 30) {
                                                                                                                                                                                                  addNotification({
                                                                                                                                                                                                        title: '📊 تنبيه مبيعات',
                                                                                                                                                                                                              body: `المبيعات الآجلة (${creditSales}) أكثر من النقدية (${cashSales}) اليوم`,
                                                                                                                                                                                                                    type: 'warning',
                                                                                                                                                                                                                        });
                                                                                                                                                                                                                          }

                                                                                                                                                                                                                            // 5. مصروفات أكثر من 30% من الدخل
                                                                                                                                                                                                                              const todayExpenses = s.expenses
                                                                                                                                                                                                                                  .filter((e: any) => e.date === today)
                                                                                                                                                                                                                                      .reduce((a: number, e: any) => a + e.amount, 0);
                                                                                                                                                                                                                                        const todayIncome = cashSales + creditSales;
                                                                                                                                                                                                                                          if (todayIncome > 0 && todayExpenses / todayIncome > 0.3) {
                                                                                                                                                                                                                                              addNotification({
                                                                                                                                                                                                                                                    title: '💸 مصروفات مرتفعة',
                                                                                                                                                                                                                                                          body: `المصروفات (${todayExpenses}) تجاوزت 30% من الدخل اليومي (${todayIncome})`,
                                                                                                                                                                                                                                                                type: 'danger',
                                                                                                                                                                                                                                                                    });
                                                                                                                                                                                                                                                                      }

                                                                                                                                                                                                                                                                        // 6. عملاء لم يسددوا منذ شهر
                                                                                                                                                                                                                                                                          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                                                                                                                                                                                                                                                                            s.customers.forEach((c: any) => {
                                                                                                                                                                                                                                                                                if (c.balance > 0) {
                                                                                                                                                                                                                                                                                      const lastPayment = s.cashMovements
                                                                                                                                                                                                                                                                                              .filter((m: any) => m.referenceId === c.id && m.type === 'deposit')
                                                                                                                                                                                                                                                                                                      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
                                                                                                                                                                                                                                                                                                            if (!lastPayment || new Date(lastPayment.createdAt) < monthAgo) {
                                                                                                                                                                                                                                                                                                                    addNotification({
                                                                                                                                                                                                                                                                                                                              title: '🔴 دين متأخر',
                                                                                                                                                                                                                                                                                                                                        body: `العميل "${c.name}" لم يسدد منذ أكثر من شهر. الرصيد: ${c.balance}`,
                                                                                                                                                                                                                                                                                                                                                  type: 'danger',
                                                                                                                                                                                                                                                                                                                                                          });
                                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                                                                                                                      });
                                                                                                                                                                                                                                                                                                                                                                      }