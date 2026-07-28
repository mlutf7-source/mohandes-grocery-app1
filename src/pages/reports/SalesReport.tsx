import { useStore } from '@/store';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Printer, Share2 } from 'lucide-react';
import { sharePdfFromElement, printElement } from '@/utils/pdfShare';

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
const dt = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

export default function SalesReport() {
  const s = useStore();
  const currency = s.settings?.currency || 'ريال يمني';
  const storeName = localStorage.getItem('store-name') || 'البقالات';

  const sales = [...s.sales].reverse();
  const totalSales = sales.reduce((sum: number, sale: any) => sum + sale.total, 0);
  const totalPaid = sales.reduce((sum: number, sale: any) => sum + sale.paid, 0);
  const totalRemaining = sales.reduce((sum: number, sale: any) => sum + sale.remaining, 0);
  const reportId = 'sales-report-print';

  return (
    <div className="page-container">
      <h1 className="page-title">تقرير المبيعات</h1>

      <div id={reportId} className="bg-white text-black p-4 space-y-4" style={{ fontFamily: 'Cairo, sans-serif', direction: 'rtl' }}>
        <div className="text-center mb-4">
          <h2 className="text-lg font-bold">{storeName}</h2>
          <h3 className="text-md font-bold">تقرير المبيعات</h3>
          <p className="text-sm">التاريخ: {dt(new Date().toISOString())}</p>
          <p className="text-sm">العملة: {currency}</p>
          <hr className="my-2 border-dashed" />
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <Card className="!bg-danger/5 text-center"><p className="text-small">الإجمالي</p><p className="text-financial text-danger">{fmt(totalSales)}</p></Card>
          <Card className="!bg-success/5 text-center"><p className="text-small">المدفوع</p><p className="text-financial text-success">{fmt(totalPaid)}</p></Card>
          <Card className="!bg-warning/5 text-center"><p className="text-small">المتبقي</p><p className="text-financial text-warning">{fmt(totalRemaining)}</p></Card>
        </div>

        <div className="space-y-2">
          {sales.map((sale: any) => (
            <Card key={sale.id} className="!bg-white !border !border-gray-200 !shadow-none sale-card" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
              <div className="flex justify-between items-center text-sm pb-1.5">
                <span className="font-bold">فاتورة بيع #{sale.invoiceNo || sale.id.slice(-6)}</span>
                <span className={`text-small font-semibold px-2 py-0.5 rounded ${sale.type === 'cash' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>{sale.type === 'cash' ? 'نقدي' : 'آجل'}</span>
              </div>
              <hr className="border-gray-200 mb-2" />
              <p className="text-small text-text-secondary mb-2">{dt(sale.createdAt)}</p>
              <table className="w-full text-sm mb-2" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-right py-1 text-text-secondary">المنتج</th>
                    <th className="text-center py-1 text-text-secondary">العدد</th>
                    <th className="text-center py-1 text-text-secondary">السعر</th>
                    <th className="text-center py-1 text-text-secondary">الإجمالي</th>
                  </tr>
                </thead>
                <tbody>
                  {sale.items.map((item: any, idx: number) => (
                    <tr key={idx} className="border-b border-gray-50">
                      <td className="text-right py-1">{item.productName}</td>
                      <td className="text-center py-1">{item.quantity}</td>
                      <td className="text-center py-1">{fmt(item.unitPrice)}</td>
                      <td className="text-center py-1 font-semibold">{fmt(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bg-gray-50 rounded-lg p-2 space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-text-secondary">الإجمالي</span><span className="font-bold">{fmt(sale.total)} {currency}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">المدفوع</span><span className="font-bold">{fmt(sale.paid)} {currency}</span></div>
                {sale.remaining > 0 && <div className="flex justify-between font-bold text-warning"><span>المتبقي</span><span>{fmt(sale.remaining)} {currency}</span></div>}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-4 no-print">
        <Button fullWidth variant="secondary" onClick={() => printElement(reportId)}><Printer size={16} />طباعة</Button>
        <Button fullWidth variant="secondary" onClick={() => sharePdfFromElement(reportId, 'تقرير المبيعات')}><Share2 size={16} />مشاركة PDF</Button>
      </div>
    </div>
  );
                                                                               }
