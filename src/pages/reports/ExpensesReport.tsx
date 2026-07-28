import { useStore } from '@/store';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Printer, Share2 } from 'lucide-react';
import { sharePdfFromElement, printElement } from '@/utils/pdfShare';

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
const dt = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

export default function ExpensesReport() {
  const s = useStore();
  const currency = s.settings?.currency || 'ريال يمني';
  const storeName = localStorage.getItem('store-name') || 'البقالات';

  const expenses = [...s.expenses].reverse();
  const totalExpenses = expenses.reduce((sum: number, e: any) => sum + e.amount, 0);
  const reportId = 'expenses-report-print';

  return (
    <div className="page-container">
      <h1 className="page-title">تقرير المصروفات</h1>

      <div id={reportId} className="bg-white text-black p-4 space-y-4" style={{ fontFamily: 'Cairo, sans-serif', direction: 'rtl' }}>
        <div className="text-center mb-4">
          <h2 className="text-lg font-bold">{storeName}</h2>
          <h3 className="text-md font-bold">تقرير المصروفات</h3>
          <p className="text-sm">التاريخ: {dt(new Date().toISOString())}</p>
          <p className="text-sm">العملة: {currency}</p>
          <hr className="my-2 border-dashed" />
        </div>

        <Card className="!bg-danger/5 text-center mb-4">
          <p className="text-small">إجمالي المصروفات</p>
          <p className="text-financial text-danger">{fmt(totalExpenses)} {currency}</p>
        </Card>

        <table className="w-full text-sm" style={{ borderCollapse: 'collapse', border: '1px solid #ccc' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #000' }}>
              <th className="text-right py-1 px-1" style={{ border: '1px solid #ccc' }}>التاريخ</th>
              <th className="text-right py-1 px-1" style={{ border: '1px solid #ccc' }}>العنوان</th>
              <th className="text-center py-1 px-1" style={{ border: '1px solid #ccc' }}>المبلغ</th>
              <th className="text-right py-1 px-1" style={{ border: '1px solid #ccc' }}>الملاحظات</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e: any) => (
              <tr key={e.id} style={{ borderBottom: '1px solid #ccc' }}>
                <td className="text-right py-1 px-1" style={{ border: '1px solid #ccc' }}>{dt(e.date)}</td>
                <td className="text-right py-1 px-1" style={{ border: '1px solid #ccc' }}>{e.title}</td>
                <td className="text-center py-1 px-1 font-bold text-danger" style={{ border: '1px solid #ccc' }}>{fmt(e.amount)} {currency}</td>
                <td className="text-right py-1 px-1" style={{ border: '1px solid #ccc' }}>{e.notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-2 mt-4 no-print">
        <Button fullWidth variant="secondary" onClick={() => printElement(reportId)}><Printer size={16} />طباعة</Button>
        <Button fullWidth variant="secondary" onClick={() => sharePdfFromElement(reportId, 'تقرير المصروفات')}><Share2 size={16} />مشاركة PDF</Button>
      </div>
    </div>
  );
}
