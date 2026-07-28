import { useStore } from '@/store';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Printer, Share2 } from 'lucide-react';
import { sharePdfFromElement, printElement } from '@/utils/pdfShare';

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

export default function ProfitReport() {
  const s = useStore();
  const currency = s.settings?.currency || 'ريال يمني';
  const storeName = localStorage.getItem('store-name') || 'البقالات';

  const totalSales = s.sales.reduce((sum: number, sale: any) => sum + sale.total, 0);
  const totalPurchases = s.purchases.reduce((sum: number, p: any) => sum + p.total, 0);
  const totalExpenses = s.expenses.reduce((sum: number, e: any) => sum + e.amount, 0);
  const profit = totalSales - totalPurchases - totalExpenses;
  const reportId = 'profit-report-print';

  return (
    <div className="page-container">
      <h1 className="page-title">تقرير الأرباح</h1>

      <div id={reportId} className="bg-white text-black p-4 space-y-4" style={{ fontFamily: 'Cairo, sans-serif', direction: 'rtl' }}>
        <div className="text-center mb-4">
          <h2 className="text-lg font-bold">{storeName}</h2>
          <h3 className="text-md font-bold">تقرير الأرباح والخسائر</h3>
          <p className="text-sm">العملة: {currency}</p>
          <hr className="my-2 border-dashed" />
        </div>

        <div className="space-y-2">
          <Card className="!bg-success/5"><div className="flex justify-between"><span className="text-small">إجمالي المبيعات</span><span className="text-financial text-success">{fmt(totalSales)} {currency}</span></div></Card>
          <Card className="!bg-danger/5"><div className="flex justify-between"><span className="text-small">إجمالي المشتريات</span><span className="text-financial text-danger">{fmt(totalPurchases)} {currency}</span></div></Card>
          <Card className="!bg-danger/5"><div className="flex justify-between"><span className="text-small">إجمالي المصروفات</span><span className="text-financial text-danger">{fmt(totalExpenses)} {currency}</span></div></Card>
          <hr className="border-dashed" />
          <Card className="!bg-primary-light">
            <div className="flex justify-between items-center">
              <span className="font-bold text-body">صافي {profit >= 0 ? 'الربح' : 'الخسارة'}</span>
              <span className={`text-financial ${profit >= 0 ? 'text-success' : 'text-danger'}`}>
                {fmt(Math.abs(profit))} {currency}
              </span>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex gap-2 mt-4 no-print">
        <Button fullWidth variant="secondary" onClick={() => printElement(reportId)}><Printer size={16} />طباعة</Button>
        <Button fullWidth variant="secondary" onClick={() => sharePdfFromElement(reportId, 'تقرير الأرباح')}><Share2 size={16} />مشاركة PDF</Button>
      </div>
    </div>
  );
      }
