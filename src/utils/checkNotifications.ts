import { addNotification } from './notifications';
import { useStore } from '@/store';

const getLastCheck = (key: string): number => {
  return parseInt(localStorage.getItem(`notif_${key}`) || '0', 10);
};

const setLastCheck = (key: string) => {
  localStorage.setItem(`notif_${key}`, Date.now().toString());
};

export function checkAllNotifications() {
  const s = useStore.getState();
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const hour = now.getHours();
  const minute = now.getMinutes();

  // 1. تنبيه منتصف الليل: منتجات راكدة، عملاء متأخرين، حركة شراء ضعيفة
  if (hour === 0 && minute < 30) {
    const lastDailyCheck = getLastCheck('daily_midnight');
    if (Date.now() - lastDailyCheck > 12 * 60 * 60 * 1000) {
      
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

      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      s.customers.forEach((c: any) => {
        if (c.balance > 0) {
          const lastPayment = s.cashMovements
            .filter((m: any) => m.referenceId === c.id && m.type === 'deposit')
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
          
          const lastActivityDate = lastPayment ? new Date(lastPayment.createdAt) : (c.createdAt ? new Date(c.createdAt) : null);
          
          if (lastActivityDate && lastActivityDate < monthAgo) {
            addNotification({
              title: '🔴 دين متأخر',
              body: `العميل "${c.name}" لم يسدد منذ أكثر من شهر. الرصيد: ${c.balance}`,
              type: 'danger',
            });
          }
        }
      });

      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const soldProducts = new Set(
        s.sales
          .filter((sale: any) => new Date(sale.createdAt) > weekAgo)
          .flatMap((sale: any) => sale.items.map((i: any) => i.productId))
      );
      s.products.forEach((p: any) => {
        const productAge = p.createdAt ? new Date(p.createdAt) : null;
        if (productAge && productAge < weekAgo && !soldProducts.has(p.id) && p.stockQuantity > 0) {
          addNotification({
            title: '📉 حركة شراء ضعيفة',
            body: `المنتج "${p.name}" لم يتم بيع أي حبة منه خلال الأسبوع الماضي`,
            type: 'info',
          });
        }
      });

      setLastCheck('daily_midnight');
    }
  }

  // 2. تنبيه قبل نهاية اليوم بنصف ساعة (11:30 مساءً)
  if (hour === 23 && minute >= 30) {
    const lastEODCheck = getLastCheck('eod_2330');
    if (Date.now() - lastEODCheck > 12 * 60 * 60 * 1000) {
      const todaySales = s.sales.filter((s: any) => s.createdAt.startsWith(today));
      const cashSales = todaySales.filter((s: any) => s.type === 'cash').reduce((a: number, s: any) => a + s.total, 0);
      const creditSales = todaySales.filter((s: any) => s.type === 'credit').reduce((a: number, s: any) => a + s.total, 0);

      if (creditSales > cashSales) {
        addNotification({
          title: '📊 تنبيه مبيعات',
          body: `المبيعات الآجلة (${creditSales}) أكثر من النقدية (${cashSales}) اليوم`,
          type: 'warning',
        });
      }

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

      setLastCheck('eod_2330');
    }
  }

  // 3. تنبيه فوري: منتجات وصلت للحد الأدنى (كل ساعة)
  const lastMinStockCheck = getLastCheck('min_stock');
  if (Date.now() - lastMinStockCheck > 60 * 60 * 1000) {
    s.products.forEach((p: any) => {
      if (p.stockQuantity <= (p.minStock || 20)) {
        addNotification({
          title: '⚠️ مخزون منخفض',
          body: `المنتج "${p.name}" وصل للحد الأدنى (${p.stockQuantity} حبة)`,
          type: 'warning',
        });
      }
    });
    setLastCheck('min_stock');
  }
  }
