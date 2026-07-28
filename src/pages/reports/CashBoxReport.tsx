import { useState } from 'react';
import { useStore } from '@/store';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Printer, Share2 } from 'lucide-react';
import { sharePdfFromElement, printElement } from '@/utils/pdfShare';

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
const dt = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

export default function CashBoxReport() {
  const s = useStore();
  const currency = s.settings?.currency || 'ريال يمني';
  const storeName = localStorage.getItem('store-name') || 'البقالات';
  const storeOwner = localStorage.getItem('store-owner') || '';
  const storePhone = localStorage.getItem('store-phone') || '';
  const storeAddress = localStorage.getItem('store-address') || '';
  const storeLogo = localStorage.getItem('store-logo') || '';

  const [selectedId, setSelectedId] = useState('');
  const box = s.cashBoxes.find((b: any) => b.id === selectedId);

  const getDescription = (m: any) => {
    if (m.referenceType === 'sale') {
      const sale = s.sales.find((x: any) => x.id === m.referenceId);
      const customer = sale?.customerId ? s.customers.find((c: any) => c.id === sale.customerId) : null;
      if (sale?.type === 'credit') {
        return `قبض جزء من فاتورة بيع #${sale.invoiceNo || sale.id.slice(-6)} للعميل ${customer?.name || ''}`;
      }
      return `فاتورة بيع #${sale?.invoiceNo || sale?.id?.slice(-6) || ''}`;
    }
    if (m.referenceType === 'purchase') {
      const purchase = s.purchases.find((x: any) => x.id === m.referenceId);
      const supplier = purchase?.supplierId ? s.suppliers.find((sup: any) => sup.id === purchase.supplierId) : null;
      if (purchase?.remaining > 0) {
        return `دفع جزء من فاتورة شراء #${purchase.invoiceNo || purchase.id.slice(-6)} للمورد ${supplier?.name || ''}`;
      }
      return `فاتورة شراء #${purchase?.invoiceNo || purchase?.id?.slice(-6) || ''}`;
    }
    if (m.referenceType === 'expense') {
      return `مصروف: ${m.description.replace('مصروف: ', '')}`;
    }
    if (m.referenceType === 'manual') {
      const account = s.customers.find((c: any) => c.id === m.referenceId) || s.suppliers.find((sup: any) => sup.id === m.referenceId);
      const accountName = account?.name || '';
      if (m.type === 'deposit') {
        return `سند قبض - ${accountName}${m.description !== 'سند قبض' ? ` - ${m.description.replace('سند قبض - ', '').replace('سند قبض', '')}` : ''}`;
      }
      return `سند صرف - ${accountName}${m.description !== 'سند صرف' ? ` - ${m.description.replace('سند صرف - ', '').replace('سند صرف', '')}` : ''}`;
    }
    return m.description;
  };

  const getTypeLabel = (m: any) => {
    if (m.referenceType === 'sale') return 'فاتورة بيع';
    if (m.referenceType === 'purchase') return 'فاتورة شراء';
    if (m.referenceType === 'expense') return 'مصروف';
    if (m.referenceType === 'manual') return m.type === 'deposit' ? 'سند قبض' : 'سند صرف';
    return m.type === 'deposit' ? 'إيداع' : 'سحب';
  };

  const getMovements = () => {
    if (!box) return null;
    const all = s.cashMovements.filter((m: any) => m.cashBoxId === box.id).reverse();
    const deposits = all.filter((m: any) => m.type === 'deposit');
    const withdrawals = all.filter((m: any) => m.type === 'withdraw');
    const totalDeposits = deposits.reduce((sum: number, m: any) => sum + m.amount, 0);
    const totalWithdrawals = withdrawals.reduce((sum: number, m: any) => sum + m.amount, 0);
    return { all, deposits, withdrawals, totalDeposits, totalWithdrawals };
  };

  const data = getMovements();
  const reportId = 'cashbox-report-print';

  return (
    <div className="page-container">
      <h1 className="page-title">كشف حساب صندوق</h1>
      <div className="mb-4">
        <select value={selectedId} onChange={e => setSelectedId(e.target.value)} className="input-field">
          <option value="">اختر الصندوق</option>
          {s.cashBoxes.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>

      {box && data && (
        <>
          <div id={reportId} className="bg-white text-black p-4 space-y-4" style={{ fontFamily: 'Cairo, sans-serif', direction: 'rtl' }}>
            <div className="text-center mb-4">
              {storeLogo && <img src={storeLogo} alt="شعار" className="w-16 h-16 mx-auto mb-2" />}
              <h2 className="text-lg font-bold">{storeName}</h2>
              {storeOwner && <p className="text-sm">{storeOwner}</p>}
              {storePhone && <p className="text-sm">هاتف: {storePhone}</p>}
              {storeAddress && <p className="text-sm">{storeAddress}</p>}
              <hr className="my-2 border-dashed" />
              <h3 className="text-md font-bold">كشف حساب صندوق</h3>
              <p className="text-sm font-semibold mt-1">{box.name}</p>
              <p className="text-sm">التاريخ: {dt(new Date().toISOString())}</p>
              <p className="text-sm">العملة: {currency}</p>
              <p className={`text-sm font-bold mt-1 ${box.balance > 0 ? 'text-danger' : box.balance < 0 ? 'text-success' : 'text-info'}`}>
                الرصيد: {fmt(box.balance)} {currency} ({box.balance > 0 ? 'عليه' : box.balance < 0 ? 'له' : 'متزن'})
              </p>
              <hr className="my-2 border-dashed" />
            </div>

            {/* جميع الحركات */}
            <div>
              <div className="bg-info/10 border-r-4 border-info px-3 py-2 rounded-lg mb-2">
                <h4 className="text-md font-bold text-info">💰 جميع الحركات</h4>
              </div>
              <table className="w-full text-sm" style={{ borderCollapse: 'collapse', border: '1px solid #ccc' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #000' }}>
                    <th className="text-right py-1 px-1" style={{ border: '1px solid #ccc' }}>التاريخ</th>
                    <th className="text-center py-1 px-1" style={{ border: '1px solid #ccc' }}>النوع</th>
                    <th className="text-right py-1 px-1" style={{ border: '1px solid #ccc' }}>البيان</th>
                    <th className="text-center py-1 px-1" style={{ border: '1px solid #ccc' }}>المبلغ</th>
                  </tr>
                </thead>
                <tbody>
                  {data.all.map((m: any) => (
                    <tr key={m.id} style={{ borderBottom: '1px solid #ccc' }}>
                      <td className="text-right py-1 px-1" style={{ border: '1px solid #ccc' }}>{dt(m.createdAt)}</td>
                      <td className={`text-center py-1 px-1 font-semibold ${m.type === 'deposit' ? 'text-danger' : 'text-success'}`} style={{ border: '1px solid #ccc' }}>
                        {getTypeLabel(m)}
                      </td>
                      <td className="text-right py-1 px-1" style={{ border: '1px solid #ccc' }}>{getDescription(m)}</td>
                      <td className={`text-center py-1 px-1 font-bold ${m.type === 'deposit' ? 'text-danger' : 'text-success'}`} style={{ border: '1px solid #ccc' }}>
                        {m.type === 'deposit' ? '+' : '-'}{fmt(m.amount)} {currency}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ملخص */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold text-danger">
                <span>إجمالي الإيداعات (عليه)</span>
                <span>{fmt(data.totalDeposits)} {currency}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-success">
                <span>إجمالي المسحوبات (له)</span>
                <span>{fmt(data.totalWithdrawals)} {currency}</span>
              </div>
              <hr className="border-dashed" />
              <Card accent className="!bg-primary-light">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-body">الرصيد الحالي {box.balance > 0 ? 'عليه' : box.balance < 0 ? 'له' : 'متزن'}</span>
                  <span className={`text-financial ${box.balance > 0 ? 'text-danger' : box.balance < 0 ? 'text-success' : 'text-info'}`}>
                    {fmt(box.balance)} {currency}
                  </span>
                </div>
              </Card>
            </div>
          </div>

          <div className="flex gap-2 mt-4 no-print">
            <Button fullWidth variant="secondary" onClick={() => printElement(reportId)}><Printer size={16} />طباعة</Button>
            <Button fullWidth variant="secondary" onClick={() => sharePdfFromElement(reportId, `كشف حساب ${box.name}`)}><Share2 size={16} />مشاركة PDF</Button>
          </div>
        </>
      )}
    </div>
  );
          }
