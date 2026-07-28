import { useStore } from '@/store';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Printer, Share2 } from 'lucide-react';
import { sharePdfFromElement, printElement } from '@/utils/pdfShare';

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

export default function InventoryReport() {
  const s = useStore();
  const currency = s.settings?.currency || 'ريال يمني';
  const storeName = localStorage.getItem('store-name') || 'البقالات';

  const products = [...s.products].reverse();
  const totalStock = products.reduce((sum: number, p: any) => sum + (p.stockQuantity || 0), 0);
  const totalValue = products.reduce((sum: number, p: any) => sum + (p.stockQuantity || 0) * (p.lastPurchasePrice || p.purchasePrice || 0), 0);
  const reportId = 'inventory-report-print';

  return (
    <div className="page-container">
      <h1 className="page-title">تقرير المخزون</h1>

      <div id={reportId} className="bg-white text-black p-4 space-y-4" style={{ fontFamily: 'Cairo, sans-serif', direction: 'rtl' }}>
        <div className="text-center mb-4">
          <h2 className="text-lg font-bold">{storeName}</h2>
          <h3 className="text-md font-bold">تقرير المخزون</h3>
          <p className="text-sm">العملة: {currency}</p>
          <hr className="my-2 border-dashed" />
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <Card className="!bg-info/5 text-center"><p className="text-small">عدد المنتجات</p><p className="text-financial text-info">{products.length}</p></Card>
          <Card className="!bg-success/5 text-center"><p className="text-small">إجمالي الحبات</p><p className="text-financial text-success">{fmt(totalStock)}</p></Card>
          <Card className="!bg-primary/5 text-center col-span-2"><p className="text-small">قيمة المخزون</p><p className="text-financial text-primary">{fmt(totalValue)} {currency}</p></Card>
        </div>

        <table className="w-full text-sm" style={{ borderCollapse: 'collapse', border: '1px solid #ccc' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #000' }}>
              <th className="text-right py-1 px-1" style={{ border: '1px solid #ccc' }}>المنتج</th>
              <th className="text-center py-1 px-1" style={{ border: '1px solid #ccc' }}>الكمية</th>
              <th className="text-center py-1 px-1" style={{ border: '1px solid #ccc' }}>سعر الشراء</th>
              <th className="text-center py-1 px-1" style={{ border: '1px solid #ccc' }}>سعر البيع</th>
              <th className="text-center py-1 px-1" style={{ border: '1px solid #ccc' }}>القيمة</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p: any) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #ccc' }}>
                <td className="text-right py-1 px-1" style={{ border: '1px solid #ccc' }}>{p.name}</td>
                <td className="text-center py-1 px-1" style={{ border: '1px solid #ccc' }}>{fmt(p.stockQuantity || 0)}</td>
                <td className="text-center py-1 px-1" style={{ border: '1px solid #ccc' }}>{fmt(p.lastPurchasePrice || p.purchasePrice || 0)}</td>
                <td className="text-center py-1 px-1" style={{ border: '1px solid #ccc' }}>{fmt(p.sellingPrice || 0)}</td>
                <td className="text-center py-1 px-1" style={{ border: '1px solid #ccc' }}>{fmt((p.stockQuantity || 0) * (p.lastPurchasePrice || p.purchasePrice || 0))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-2 mt-4 no-print">
        <Button fullWidth variant="secondary" onClick={() => printElement(reportId)}><Printer size={16} />طباعة</Button>
        <Button fullWidth variant="secondary" onClick={() => sharePdfFromElement(reportId, 'تقرير المخزون')}><Share2 size={16} />مشاركة PDF</Button>
      </div>
    </div>
  );
              }
