import { useState } from 'react';
import { useStore } from '@/store';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Printer, Share2 } from 'lucide-react';
import { sharePdfFromElement, printElement } from '@/utils/pdfShare';

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
const dt = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

export default function CustomerReport() {
  const s = useStore();
  const currency = s.settings?.currency || 'ريال يمني';
  const storeName = localStorage.getItem('store-name') || 'البقالات';
  const storeOwner = localStorage.getItem('store-owner') || '';
  const storePhone = localStorage.getItem('store-phone') || '';
  const storeAddress = localStorage.getItem('store-address') || '';
  const storeLogo = localStorage.getItem('store-logo') || '';

  const [selectedId, setSelectedId] = useState('');
  const customer = s.customers.find((c: any) => c.id === selectedId);

  const getStatement = () => {
    if (!customer) return null;
    const sales = s.sales.filter((sale: any) => sale.customerId === customer.id);
    const movements = s.cashMovements.filter((m: any) => m.referenceId === customer.id && m.referenceType === 'manual');
    const receipts = movements.filter((m: any) => m.type === 'deposit');
    const payments = movements.filter((m: any) => m.type === 'withdraw');
    const totalRemaining = sales.reduce((sum: number, sale: any) => sum + sale.remaining, 0);
    const totalReceipts = receipts.reduce((sum: number, m: any) => sum + m.amount, 0);
    const totalPayments = payments.reduce((sum: number, m: any) => sum + m.amount, 0);
    const balance = totalRemaining + totalPayments - totalReceipts;
    return { sales, receipts, payments, totalRemaining, totalReceipts, totalPayments, balance };
  };

  const statement = getStatement();
  const reportId = 'customer-report-print';

  return (
    <div className="page-container">
      <h1 className="page-title">كشف حساب عميل</h1>
      <div className="mb-4">
        <select value={selectedId} onChange={e => setSelectedId(e.target.value)} className="input-field">
          <option value="">اختر العميل</option>
          {s.customers.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {customer && statement && (
        <>
          <div id={reportId} className="bg-white text-black p-4 space-y-4" style={{ fontFamily: 'Cairo, sans-serif', direction: 'rtl' }}>
            {/* كليشة المتجر */}
            <div className="text-center mb-4">
              {storeLogo && <img src={storeLogo} alt="شعار" className="w-16 h-16 mx-auto mb-2" />}
              <h2 className="text-lg font-bold">{storeName}</h2>
              {storeOwner && <p className="text-sm">{storeOwner}</p>}
              {storePhone && <p className="text-sm">هاتف: {storePhone}</p>}
              {storeAddress && <p className="text-sm">{storeAddress}</p>}
              <hr className="my-2 border-dashed" />
              <h3 className="text-md font-bold">كشف حساب عميل</h3>
              <p className="text-sm font-semibold mt-1">{customer.name}</p>
              <p className="text-sm">التاريخ: {dt(new Date().toISOString())}</p>
              <p className="text-sm">العملة: {currency}</p>
              <hr className="my-2 border-dashed" />
            </div>

            {/* الفواتير */}
            {statement.sales.length > 0 && (
              <div>
                <div className="bg-success/10 border-r-4 border-success px-3 py-2 rounded-lg mb-2">
                  <h4 className="text-md font-bold text-success">📄 الفواتير</h4>
                </div>
                <div className="space-y-2">
                  {statement.sales.map((sale: any) => (
                    <Card key={sale.id} className="!bg-white !border !border-gray-200 !shadow-none sale-card" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                      <div className="flex justify-between items-center text-sm pb-1.5">
                        <span className="font-bold">فاتورة رقم: {sale.invoiceNo || sale.id.replace(/\D/g, '').slice(-6)}</span>
                        <span className="text-text-secondary">{dt(sale.createdAt)}</span>
                      </div>
                      <hr className="border-gray-200 mb-2" />
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
                        <div className="flex justify-between">
                          <span className="text-text-secondary">الإجمالي</span>
                          <span className="font-bold">{fmt(sale.total)} {currency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">المدفوع</span>
                          <span className="font-bold">{fmt(sale.paid)} {currency}</span>
                        </div>
                        <div className={`flex justify-between font-bold pt-1 border-t border-gray-200 ${sale.remaining > 0 ? 'text-danger' : 'text-success'}`}>
                          <span>المتبقي {sale.remaining > 0 ? '(عليه)' : '(له)'}</span>
                          <span>{fmt(sale.remaining)} {currency}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                {(() => {
                  const rem = statement.totalRemaining;
                  const remStatus = rem > 0 ? 'عليه' : rem < 0 ? 'له' : '';
                  const remColor = rem > 0 ? '#dc2626' : rem < 0 ? '#16a34a' : '#2563eb';
                  const remBg = rem > 0 ? 'rgba(220,38,38,0.05)' : rem < 0 ? 'rgba(22,163,74,0.05)' : 'rgba(37,99,235,0.05)';
                  return (
                    <div style={{ backgroundColor: remBg, borderLeft: `4px solid ${remColor}`, color: remColor }} className="px-3 py-2 rounded-lg mt-3 text-left font-bold">
                      إجمالي المتبقي {remStatus}: {fmt(Math.abs(rem))} {currency}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* سندات الصرف */}
            {statement.payments.length > 0 && (
              <div>
                <div className="bg-danger/10 border-r-4 border-danger px-3 py-2 rounded-lg mb-2">
                  <h4 className="text-md font-bold text-danger">🔴 سندات الصرف</h4>
                </div>
                <table className="w-full text-sm" style={{ borderCollapse: 'collapse', border: '1px solid #ccc' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #000' }}>
                      <th className="text-right py-1 px-1" style={{ border: '1px solid #ccc' }}>التاريخ</th>
                      <th className="text-center py-1 px-1" style={{ border: '1px solid #ccc' }}>البيان</th>
                      <th className="text-center py-1 px-1" style={{ border: '1px solid #ccc' }}>المبلغ</th>
                      <th className="text-center py-1 px-1" style={{ border: '1px solid #ccc' }}>الملاحظات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statement.payments.map((m: any) => (
                      <tr key={m.id} style={{ borderBottom: '1px solid #ccc' }}>
                        <td className="text-right py-1 px-1" style={{ border: '1px solid #ccc' }}>{dt(m.createdAt)}</td>
                        <td className="text-center py-1 px-1" style={{ border: '1px solid #ccc' }}>سند صرف</td>
                        <td className="text-center py-1 px-1" style={{ border: '1px solid #ccc' }}>{fmt(m.amount)}</td>
                        <td className="text-center py-1 px-1" style={{ border: '1px solid #ccc' }}>{m.description.replace('سند صرف - ', '').replace('سند صرف', '')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="bg-danger/5 border-l-4 border-danger px-3 py-2 rounded-lg mt-2 text-left font-bold">
                  إجمالي سندات الصرف: {fmt(statement.totalPayments)} {currency}
                </div>
                <hr className="my-2 border-dashed" />
              </div>
            )}

            {/* سندات القبض */}
            {statement.receipts.length > 0 && (
              <div>
                <div className="bg-success/10 border-r-4 border-success px-3 py-2 rounded-lg mb-2">
                  <h4 className="text-md font-bold text-success">🟢 سندات القبض</h4>
                </div>
                <table className="w-full text-sm" style={{ borderCollapse: 'collapse', border: '1px solid #ccc' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #000' }}>
                      <th className="text-right py-1 px-1" style={{ border: '1px solid #ccc' }}>التاريخ</th>
                      <th className="text-center py-1 px-1" style={{ border: '1px solid #ccc' }}>البيان</th>
                      <th className="text-center py-1 px-1" style={{ border: '1px solid #ccc' }}>المبلغ</th>
                      <th className="text-center py-1 px-1" style={{ border: '1px solid #ccc' }}>الملاحظات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statement.receipts.map((m: any) => (
                      <tr key={m.id} style={{ borderBottom: '1px solid #ccc' }}>
                        <td className="text-right py-1 px-1" style={{ border: '1px solid #ccc' }}>{dt(m.createdAt)}</td>
                        <td className="text-center py-1 px-1" style={{ border: '1px solid #ccc' }}>سند قبض</td>
                        <td className="text-center py-1 px-1" style={{ border: '1px solid #ccc' }}>{fmt(m.amount)}</td>
                        <td className="text-center py-1 px-1" style={{ border: '1px solid #ccc' }}>{m.description.replace('سند قبض - ', '').replace('سند قبض', '')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="bg-success/5 border-l-4 border-success px-3 py-2 rounded-lg mt-2 text-left font-bold">
                  إجمالي سندات القبض: {fmt(statement.totalReceipts)} {currency}
                </div>
                <hr className="my-2 border-dashed" />
              </div>
            )}

            {/* ملخص الرصيد */}
            <div className="space-y-2">
              {statement.sales.length > 0 && (
                <div className="flex justify-between text-sm font-bold text-danger">
                  <span>إجمالي المتبقي من الفواتير</span>
                  <span>{fmt(statement.totalRemaining)} {currency}</span>
                </div>
              )}
              {statement.payments.length > 0 && (
                <div className="flex justify-between text-sm font-bold text-danger">
                  <span>إجمالي سندات الصرف</span>
                  <span>{fmt(statement.totalPayments)} {currency}</span>
                </div>
              )}
              {statement.receipts.length > 0 && (
                <div className="flex justify-between text-sm font-bold text-success">
                  <span>إجمالي سندات القبض</span>
                  <span>{fmt(statement.totalReceipts)} {currency}</span>
                </div>
              )}
              <hr className="border-dashed" />
              <Card accent className="!bg-primary-light">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-body">الرصيد {statement.balance > 0 ? 'عليه' : statement.balance < 0 ? 'له' : 'متزن'}</span>
                  <span className={`text-financial ${statement.balance > 0 ? 'text-danger' : statement.balance < 0 ? 'text-success' : 'text-info'}`}>
                    {fmt(Math.abs(statement.balance))} {currency}
                  </span>
                </div>
              </Card>
            </div>
          </div>

          <div className="flex gap-2 mt-4 no-print">
            <Button fullWidth variant="secondary" onClick={() => printElement(reportId)}><Printer size={16} />طباعة</Button>
            <Button fullWidth variant="secondary" onClick={() => sharePdfFromElement(reportId, `كشف حساب ${customer.name}`)}><Share2 size={16} />مشاركة PDF</Button>
          </div>
        </>
      )}
    </div>
  );
              }
