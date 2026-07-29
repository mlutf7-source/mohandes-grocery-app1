import { useState, useMemo, useRef, useEffect } from 'react';
import { useStore } from '@/store';
import { usePreventLeave } from '@/hooks/usePreventLeave';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Dialog from '@/components/ui/Dialog';
import BarcodeScanner from '@/components/ui/BarcodeScanner';
import { sharePdfFromElement, printElement } from '@/utils/pdfShare';
import { Trash2, ArrowDownToLine, Plus, X, Package, Edit2, Barcode, Keyboard, Scan, Printer, Share2 } from 'lucide-react';

// تنسيق الأرقام بالإنجليزية (موحد مع المبيعات)
const fmt = (n: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.round(n));
// تنسيق التاريخ (موحد مع المبيعات)
const dt = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
// فئة CSS موحدة لحقول الإدخال
const IC = "w-full h-[44px] rounded-input border border-border text-center text-body font-bold";
const LC = "block text-sm font-bold text-primary mb-1 border-r-4 border-primary pr-2";

export default function Purchases() {
  const s = useStore();
  const currency = s.settings?.currency || 'ريال يمني';
  const storeName = localStorage.getItem('store-name') || 'البقالات';
  const storeOwner = localStorage.getItem('store-owner') || '';
  const storePhone = localStorage.getItem('store-phone') || '';
  const storeAddress = localStorage.getItem('store-address') || '';
  const storeLogo = localStorage.getItem('store-logo') || '';

  // State
  const [supplier, setSupplier] = useState('');
  const [box, setBox] = useState('default-cash-box');
  const [paid, setPaid] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [show, setShow] = useState(false);
  const [supOpen, setSupOpen] = useState(false);
  const [supForm, setSupForm] = useState({ name: '', phone: '', address: '', notes: '' });
  const [prodOpen, setProdOpen] = useState(false);
  const [pf, setPf] = useState({ name: '', barcode: '', quantity: '', unit: 'كرتون', boxQty: '', unitPrice: '', sellingPrice: '', minStock: '' });
  const [editPur, setEditPur] = useState<any>(null);
  const [invoiceNo, setInvoiceNo] = useState('');
  const [mode, setMode] = useState<'manual' | 'barcode'>('manual');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [barcodeOpen, setBarcodeOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const qtyRef = useRef<HTMLInputElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  usePreventLeave(hasChanges);
  useEffect(() => { if (editPur && topRef.current) topRef.current.scrollIntoView({ behavior: 'smooth' }); }, [editPur]);

  // دوال مساعدة
  const isCashPurchase = !supplier; // إذا لم يتم اختيار مورد، يعتبر شراء نقدي
  const finalPaid = isCashPurchase ? total : (+paid || 0);
  const remaining = total - finalPaid;
  const allPurchases = [...s.purchases].reverse();
  const nextInvoiceNo = s.purchases.length + 1;
  const currentInvoiceNo = editPur ? (editPur.invoiceNo || editPur.id.replace(/\D/g, '').slice(-6)) : nextInvoiceNo;
  const supName = (id: string) => s.suppliers.find((x: any) => x.id === id)?.name || 'شراء نقدي';
  const boxName = (id: string) => s.cashBoxes.find((b: any) => b.id === id)?.name || '';

  // حساب الإجمالي والفلترة (استخدام useMemo للكفاءة مثل المبيعات)
  const total = items.reduce((sum: number, i: any) => sum + i.total, 0);
  const filtered = useMemo(() => {
    let list = s.products;
    if (search) list = list.filter((p: any) => p.name.includes(search) || p.barcode.includes(search));
    return list;
  }, [s.products, search]);

  // دوال إضافة المنتج للفاتورة (سيتم إكمالها في الجزء الثاني)
  const openPf = (p?: any) => { /* ... */ };
  const addToCart = () => { /* ... */ };
  const handleBarcodeDetected = (bc: string) => { /* ... */ };
  const addByBarcode = (bc: string) => { /* ... */ };

  // دوال تعديل الكمية والسعر والحذف
  const remove = (id: string) => { setItems(items.filter((i: any) => i.productId !== id)); setHasChanges(true); };
  const updQty = (id: string, q: number) => { if (q <= 0) return remove(id); setItems(items.map((i: any) => i.productId === id ? { ...i, quantity: q, total: q * i.unitPrice } : i)); setHasChanges(true); };
  const updPrice = (id: string, v: string) => { const n = +v.replace(/,/g, '') || 0; setItems(items.map((i: any) => { if (i.productId !== id) return i; const pp = i.unit === 'كرتون' && i.boxQty ? n / i.boxQty : n; return { ...i, unitPrice: n, total: i.quantity * n, pricePerPiece: pp }; })); setHasChanges(true); };

  // دوال المورد
  const saveSup = () => { if (!supForm.name) return; if (s.suppliers.find((x: any) => x.name === supForm.name)) { alert('يوجد مورد بنفس الاسم'); return; } s.addSupplier({ id: '', ...supForm, balance: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }); setSupForm({ name: '', phone: '', address: '', notes: '' }); setSupOpen(false); };

  // دوال الحفظ والتعديل والحذف (سيتم إكمالها في الجزء الثاني)
  const reset = () => { setItems([]); setPaid(''); setEditPur(null); setInvoiceNo(''); setSupplier(''); setHasChanges(false); };
  const startEdit = (p: any) => { /* ... */ };
  const save = () => { /* ... */ };
  const delPur = (id: string) => { /* ... */ };

  // ====== بداية واجهة المستخدم (JSX) ======
  return (
    <div className="page-container" ref={topRef}>
      {editPur && (
        <Card accent className="mb-4 !bg-info/5 !border-info/30">
          <div className="flex justify-between items-center">
            <span className="font-bold text-info text-body">تعديل فاتورة شراء #{currentInvoiceNo}</span>
            <button onClick={reset} className="flex items-center gap-1 px-3 py-1.5 bg-danger/10 text-danger rounded-btn text-small font-semibold"><X size={16} />إلغاء</button>
          </div>
        </Card>
      )}

      {!editPur && (
        <div className="flex items-center justify-between mb-3">
          <h1 className="page-title mb-0">فاتورة شراء #{currentInvoiceNo}</h1>
          <div className="flex gap-2">
            <button onClick={() => setMode('manual')} className={`flex items-center gap-1 px-3 py-2 rounded-btn text-small font-semibold ${mode === 'manual' ? 'bg-primary text-white' : 'bg-primary-light text-primary'}`}><Keyboard size={16} />يدوي</button>
            <button onClick={() => setMode('barcode')} className={`flex items-center gap-1 px-3 py-2 rounded-btn text-small font-semibold ${mode === 'barcode' ? 'bg-primary text-white' : 'bg-primary-light text-primary'}`}><Barcode size={16} />باركود</button>
            <button onClick={() => setBarcodeOpen(true)} className={`flex items-center gap-1 px-3 py-2 rounded-btn text-small font-semibold bg-primary-light text-primary hover:bg-primary hover:text-white`}><Scan size={16} />تصوير</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div><label className="block text-sm font-semibold mb-1">المورد</label><select value={supplier} onChange={e => setSupplier(e.target.value)} className="input-field"><option value="">شراء نقدي (لا يوجد مورد)</option>{s.suppliers.map((x: any) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></div>
        <div className="flex items-end"><Button fullWidth onClick={() => setSupOpen(true)}><Plus size={18} />مورد جديد</Button></div>
      </div>

      <div className="mb-4"><label className="block text-sm font-semibold mb-1">الصندوق</label><select value={box} onChange={e => setBox(e.target.value)} className="input-field">{s.cashBoxes.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></div>

      {mode === 'barcode' && (
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">الباركود</label>
          <div className="flex gap-2">
            <input type="text" value={barcodeInput} onChange={e => setBarcodeInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && barcodeInput && addByBarcode(barcodeInput)} placeholder="ادخل الباركود..." className="input-field flex-1" autoFocus />
            <Button onClick={() => addByBarcode(barcodeInput)}>بحث</Button>
          </div>
        </div>
      )}

      {items.length > 0 && (
        <div className="space-y-1 mb-4">
          <div className="grid grid-cols-12 gap-2 px-3 py-2 text-small font-bold text-text-secondary bg-background rounded-lg">
            <span className="col-span-4">المنتج</span>
            <span className="col-span-2 text-center">الكمية</span>
            <span className="col-span-2 text-center">سعر الوحدة</span>
            <span className="col-span-3 text-center">الإجمالي</span>
            <span className="col-span-1"></span>
          </div>
          {items.map((i: any) => (
            <div key={i.productId} className="grid grid-cols-12 gap-2 items-center px-3 py-2 border-b border-border">
              <span className="col-span-4 font-semibold text-body truncate">
                {i.productName}{i.unit === 'كرتون' && i.boxQty ? ` (كرتون ${i.boxQty} ح)` : ''}
              </span>
              <div className="col-span-2">
                <input ref={qtyRef} type="number" value={i.quantity} onChange={e => updQty(i.productId, +e.target.value)} onFocus={e => e.target.select()} className={IC} min="1" inputMode="numeric" />
              </div>
              <div className="col-span-2">
                <input type="text" value={fmt(i.unitPrice)} onChange={e => updPrice(i.productId, e.target.value)} onFocus={e => e.target.select()} className={IC} inputMode="decimal" />
              </div>
              <span className="col-span-3 text-center text-financial text-primary">{fmt(i.total)}</span>
              <div className="col-span-1 flex justify-end">
                <button onClick={() => { if (confirm('النقل لسلة المحذوفات؟')) remove(i.productId); }} className="p-1 text-danger"><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      )}// ====== استكمال الدوال المفقودة (الجزء 2-أ) ======

// فتح نافذة إضافة منتج (للفاتورة الحالية)
const openPf = (p?: any) => {
  if (p) {
    const isCarton = p.unit === 'كرتون' && p.boxQty;
    const cartonPrice = isCarton ? (p.lastPurchasePrice || p.purchasePrice || 0) * p.boxQty : (p.lastPurchasePrice || p.purchasePrice || 0);
    setPf({
      name: p.name,
      barcode: p.barcode || '',
      quantity: '1',
      unit: p.unit || 'حبة',
      boxQty: p.boxQty?.toString() || '',
      unitPrice: cartonPrice.toString(),
      sellingPrice: (p.sellingPrice || '').toString(),
      minStock: (p.minStock || '20').toString()
    });
  } else {
    setPf({ name: '', barcode: '', quantity: '1', unit: 'كرتون', boxQty: '', unitPrice: '', sellingPrice: '', minStock: '' });
  }
  setShow(false);
  setProdOpen(true);
};

// إضافة المنتج إلى الفاتورة (من نافذة prodOpen)
const addToCart = () => {
  if (!pf.sellingPrice || +pf.sellingPrice <= 0) { alert('يجب إدخال سعر البيع (حبة)'); return; }
  if (!pf.unitPrice || +pf.unitPrice <= 0) { alert('يجب إدخال السعر'); return; }
  const name = pf.name || 'منتج';
  const bc = pf.barcode || '';
  const existing = s.products.find((x: any) => x.name === name || (bc && x.barcode === bc));
  const productId = existing?.id || bc || Date.now().toString();
  const qty = +pf.quantity || 1;
  const unit = pf.unit;
  const boxQty = +pf.boxQty || 1;
  const inputPrice = +pf.unitPrice || 0;
  const pricePerPiece = unit === 'كرتون' ? inputPrice / boxQty : inputPrice;
  const sellingPrice = +pf.sellingPrice || 0;
  const minStock = +pf.minStock || 20;
  const ex = items.find((i: any) => i.productId === productId);
  if (ex) {
    setItems(items.map((i: any) => i.productId === productId ? { ...i, quantity: i.quantity + qty, unit, boxQty, unitPrice: inputPrice, pricePerPiece, sellingPrice, minStock, total: (i.quantity + qty) * inputPrice } : i));
  } else {
    setItems([...items, { productId, productName: name, barcode: bc, quantity: qty, unit, boxQty, unitPrice: inputPrice, pricePerPiece, sellingPrice, minStock, total: qty * inputPrice }]);
  }
  setProdOpen(false);
  setHasChanges(true);
  setTimeout(() => qtyRef.current?.focus(), 100);
};

// معالجة الباركود
const handleBarcodeDetected = (bc: string) => {
  const p = s.products.find((x: any) => x.barcode === bc);
  if (p) { openPf(p); setBarcodeInput(bc); }
  else {
    setPf({ name: '', barcode: bc, quantity: '1', unit: 'كرتون', boxQty: '', unitPrice: '', sellingPrice: '', minStock: '' });
    setProdOpen(true);
  }
};

const addByBarcode = (bc: string) => {
  const p = s.products.find((x: any) => x.barcode === bc);
  p ? openPf(p) : alert('المنتج غير موجود');
};

// دوال الحفظ والتعديل والحذف
const startEdit = (p: any) => {
  setEditPur(p);
  setSupplier(p.supplierId || '');
  setBox(p.cashBoxId || 'default-cash-box');
  setPaid(p.paid.toString());
  setItems(p.items.map((i: any) => ({ ...i })));
  setInvoiceNo(p.invoiceNo || '');
  setHasChanges(true);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const save = () => {
  if (!items.length) return;
  if (!isCashPurchase && !supplier) return alert('اختر المورد للشراء الآجل');

  // التحقق من صحة الكميات (اختياري، لكن مفيد)
  for (const item of items) {
    if (item.quantity <= 0) { alert(`الكمية غير صالحة للمنتج: ${item.productName}`); return; }
  }

  const purchaseData = {
    supplierId: supplier || null,
    cashBoxId: box || null,
    items,
    total,
    paid: finalPaid,
    remaining: remaining > 0 ? remaining : 0,
    invoiceNo: currentInvoiceNo.toString()
  };

  if (editPur) {
    // استخدام دالة updatePurchase الجديدة (لمنع الخصم المزدوج)
    s.updatePurchase(editPur.id, purchaseData);
  } else {
    s.addPurchase({ id: '', ...purchaseData, createdAt: new Date().toISOString() });
  }
  reset();
};

const delPur = (id: string) => {
  if (confirm('سيتم نقل الفاتورة إلى سلة المحذوفات. متابعة؟')) s.deletePurchase(id);
};  // ====== استكمال واجهة المستخدم (JSX) - الجزء 2-ب ======

  {/* استكمال بعد جدول العناصر - البحث اليدوي */}
  {mode === 'manual' && (
    <div className="relative mb-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setShow(true); }}
            onFocus={() => setShow(true)}
            placeholder="إضافة منتج..."
            className="search-input"
          />
          {search && (
            <button onClick={() => { setSearch(''); setShow(false); }} className="absolute left-3 top-1/2 -translate-y-1/2">
              ✕
            </button>
          )}
          {show && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShow(false)} />
              <div className="absolute z-40 left-0 right-0 top-full mt-1 border border-border rounded-card bg-surface max-h-56 overflow-y-auto shadow-dialog">
                {!filtered.length ? (
                  <p className="p-3 text-center text-small">لا توجد منتجات</p>
                ) : (
                  filtered.map((p: any) => (
                    <button
                      key={p.id}
                      onClick={() => openPf(p)}
                      className="w-full flex items-center justify-between p-3 hover:bg-primary-light border-b border-border last:border-b-0"
                    >
                      <div className="text-right">
                        <p className="font-semibold">{p.name}</p>
                        <p className="text-small text-text-secondary">{p.barcode || '-'}</p>
                      </div>
                      <Plus size={18} className="text-primary" />
                    </button>
                  ))
                )}
              </div>
            </>
          )}
        </div>
        <Button onClick={() => openPf()}><Package size={18} />جديد</Button>
      </div>
    </div>
  )}

  {/* عرض الإجمالي والمدفوع (بتصميم موحد مع المبيعات) */}
  {items.length > 0 && (
    <>
      <div className="flex justify-between items-start mb-3 gap-3">
        {!isCashPurchase && (
          <div className="flex-1">
            <Input
              label="المدفوع"
              type="text"
              inputMode="decimal"
              value={paid ? fmt(+paid) : ''}
              onChange={e => setPaid(e.target.value.replace(/,/g, ''))}
            />
            {+paid > 0 && remaining > 0 && (
              <p className="text-small text-text-secondary mt-1">
                المتبقي: {fmt(remaining)} <span className="text-small">{currency}</span>
              </p>
            )}
          </div>
        )}
        <div className={`${isCashPurchase ? 'w-full' : ''} pt-6`}>
          <Card className="!py-3 !px-6">
            <div className="flex items-center gap-4">
              <span className="text-card-title">الإجمالي</span>
              <span className="text-financial text-primary">
                {fmt(total)} <span className="text-small">{currency}</span>
              </span>
            </div>
          </Card>
        </div>
      </div>

      {!isCashPurchase && (
        <div className="mb-3">
          <Input
            label="رقم فاتورة المورد (اختياري)"
            value={invoiceNo}
            onChange={e => setInvoiceNo(e.target.value)}
          />
        </div>
      )}

      <Button fullWidth onClick={save}>
        <ArrowDownToLine size={20} />
        {editPur ? 'تحديث الفاتورة' : 'حفظ الفاتورة'}
      </Button>
    </>
  )}

  {/* الفواتير السابقة (بتصميم موحد مع المبيعات) */}
  <div className="mt-6">
    <h2 className="text-card-title mb-3">الفواتير السابقة</h2>
    {allPurchases.length === 0 ? (
      <p className="text-small text-text-secondary text-center">لا توجد فواتير</p>
    ) : (
      allPurchases.map((p: any) => (
        <div key={p.id}>
          <Card className="mb-3">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-small font-bold text-info mb-1">{supName(p.supplierId)}</p>
                <span className="text-small font-semibold px-2 py-0.5 rounded bg-info/10 text-info">
                  فاتورة شراء #{p.invoiceNo || p.id.replace(/\D/g, '').slice(-6)}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(p)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-info/10 text-info rounded-btn text-small font-semibold"
                >
                  <Edit2 size={14} />تعديل
                </button>
                <button
                  onClick={() => delPur(p.id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-danger/10 text-danger rounded-btn text-small font-semibold"
                >
                  <Trash2 size={14} />حذف
                </button>
              </div>
            </div>
            <p className="text-small text-text-secondary mb-2">{dt(p.createdAt)}</p>
            <div className="space-y-1 mb-3">
              {p.items.map((i: any, idx: number) => (
                <div key={idx} className="flex items-center text-small">
                  <span className="flex-[3] font-semibold">
                    {i.productName}{i.unit === 'كرتون' && i.boxQty ? ` (كرتون ${i.boxQty} ح)` : ''}
                  </span>
                  <span className="flex-1 text-center">{i.quantity} {i.unit === 'كرتون' ? 'كرتون' : 'حبة'}</span>
                  <span className="flex-[2] text-center">{fmt(i.unitPrice)}</span>
                  <span className="flex-[2] text-center font-bold">{fmt(i.total)}</span>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 rounded-lg p-2 space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-text-secondary">الإجمالي</span><span className="font-bold">{fmt(p.total)} {currency}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">المدفوع</span><span className="font-bold">{fmt(p.paid)} {currency}</span></div>
              {p.remaining > 0 && (
                <div className={`flex justify-between font-bold pt-1 border-t border-gray-200 ${p.remaining > 0 ? 'text-danger' : 'text-success'}`}>
                  <span>المتبقي {p.remaining > 0 ? '(عليه)' : '(له)'}</span>
                  <span>{fmt(p.remaining)} {currency}</span>
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => printElement(`invoice-${p.id}`)}
                className="flex items-center gap-1 px-3 py-1.5 bg-primary-light text-primary rounded-btn text-small font-semibold"
              >
                <Printer size={14} />طباعة
              </button>
              <button
                onClick={() => sharePdfFromElement(`invoice-${p.id}`, `فاتورة شراء #${p.invoiceNo || p.id.slice(-6)}`)}
                className="flex items-center gap-1 px-3 py-1.5 bg-primary-light text-primary rounded-btn text-small font-semibold"
              >
                <Share2 size={14} />مشاركة
              </button>
            </div>
          </Card>

          {/* قالب الطباعة (مخفي) */}
          <div
            id={`invoice-${p.id}`}
            style={{
              position: 'absolute',
              left: '-9999px',
              top: 0,
              width: '80mm',
              padding: '10px',
              fontFamily: 'Cairo, sans-serif',
              direction: 'rtl',
              backgroundColor: '#fff',
              color: '#000'
            }}
          >
            <div className="text-center mb-3">
              {storeLogo && <img src={storeLogo} alt="شعار" style={{ width: '16mm', height: '16mm', margin: '0 auto 2mm' }} />}
              <h2 style={{ fontSize: '14px', fontWeight: 'bold', margin: '2px 0' }}>{storeName}</h2>
              {storeOwner && <p style={{ fontSize: '10px', margin: '1px 0' }}>{storeOwner}</p>}
              {storePhone && <p style={{ fontSize: '10px', margin: '1px 0' }}>هاتف: {storePhone}</p>}
              {storeAddress && <p style={{ fontSize: '10px', margin: '1px 0' }}>{storeAddress}</p>}
              <hr style={{ margin: '3px 0', border: 'none', borderTop: '1px dashed #000' }} />
              <h3 style={{ fontSize: '12px', fontWeight: 'bold', margin: '2px 0' }}>فاتورة شراء #{p.invoiceNo || p.id.replace(/\D/g, '').slice(-6)}</h3>
              <p style={{ fontSize: '10px', margin: '1px 0' }}>التاريخ: {dt(p.createdAt)}</p>
              {p.supplierId && <p style={{ fontSize: '10px', margin: '1px 0' }}>المورد: {supName(p.supplierId)}</p>}
              <hr style={{ margin: '3px 0', border: 'none', borderTop: '1px dashed #000' }} />
            </div>
            <table style={{ width: '100%', fontSize: '10px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #000' }}>
                  <th style={{ textAlign: 'right', padding: '2px' }}>المنتج</th>
                  <th style={{ textAlign: 'center', padding: '2px' }}>الكمية</th>
                  <th style={{ textAlign: 'center', padding: '2px' }}>السعر</th>
                  <th style={{ textAlign: 'center', padding: '2px' }}>الإجمالي</th>
                </tr>
              </thead>
              <tbody>
                {p.items.map((i: any, idx: number) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #ccc' }}>
                    <td style={{ textAlign: 'right', padding: '2px' }}>{i.productName}{i.unit === 'كرتون' && i.boxQty ? ` (${i.boxQty} ح)` : ''}</td>
                    <td style={{ textAlign: 'center', padding: '2px' }}>{i.quantity} {i.unit === 'كرتون' ? 'كرتون' : 'حبة'}</td>
                    <td style={{ textAlign: 'center', padding: '2px' }}>{fmt(i.unitPrice)}</td>
                    <td style={{ textAlign: 'center', padding: '2px' }}>{fmt(i.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <hr style={{ margin: '3px 0', border: 'none', borderTop: '1px dashed #000' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '10px' }}><span>الإجمالي</span><span>{fmt(p.total)} {currency}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}><span>المدفوع</span><span>{fmt(p.paid)} {currency}</span></div>
            {p.remaining > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}><span>المتبقي</span><span>{fmt(p.remaining)} {currency}</span></div>}
            <hr style={{ margin: '3px 0', border: 'none', borderTop: '1px dashed #000' }} />
            <p style={{ textAlign: 'center', fontSize: '8px', marginTop: '4px' }}>شكراً لتعاملكم مع {storeName}</p>
          </div>
        </div>
      ))
    )}
  </div>

  {/* نوافذ الحوار (Dialogs) */}
  <Dialog open={supOpen} onClose={() => setSupOpen(false)} title="إضافة مورد جديد">
    <div className="space-y-3 pb-4">
      <Input label="اسم المورد" value={supForm.name} onChange={e => setSupForm({ ...supForm, name: e.target.value })} />
      <Input label="الهاتف" type="tel" value={supForm.phone} onChange={e => setSupForm({ ...supForm, phone: e.target.value })} />
      <Input label="العنوان" value={supForm.address} onChange={e => setSupForm({ ...supForm, address: e.target.value })} />
      <Input label="الملاحظات" value={supForm.notes} onChange={e => setSupForm({ ...supForm, notes: e.target.value })} />
      <Button fullWidth onClick={saveSup}>حفظ المورد</Button>
    </div>
  </Dialog>

  <Dialog open={prodOpen} onClose={() => setProdOpen(false)} title="إضافة منتج للفاتورة">
    <div className="space-y-3 pb-4">
      <div><label className={LC}>اسم المنتج</label><Input value={pf.name} onChange={e => setPf({ ...pf, name: e.target.value })} /></div>
      <div><label className={LC}>الباركود</label><Input value={pf.barcode} onChange={e => setPf({ ...pf, barcode: e.target.value })} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className={LC}>وحدة الشراء</label><select value={pf.unit} onChange={e => setPf({ ...pf, unit: e.target.value })} className="input-field"><option value="كرتون">كرتون</option><option value="حبة">حبة</option></select></div>
        <div><label className={LC}>{pf.unit === 'كرتون' ? 'عدد الكراتين' : 'الكمية (حبة)'}</label><input type="number" value={pf.quantity} onChange={e => setPf({ ...pf, quantity: e.target.value })} onFocus={e => e.target.select()} className="w-full h-[42px] rounded-input border border-border text-center text-[19px] font-bold" inputMode="numeric" /></div>
      </div>
      {pf.unit === 'كرتون' && (
        <div className="grid grid-cols-2 gap-3">
          <div><label className={LC}>عدد الحبات في الكرتون</label><input type="number" value={pf.boxQty} onChange={e => setPf({ ...pf, boxQty: e.target.value })} onFocus={e => e.target.select()} className="w-full h-[42px] rounded-input border border-border text-center text-[19px] font-bold" inputMode="numeric" /></div>
          <div><label className={LC}>سعر الكرتون</label><input type="text" value={pf.unitPrice ? fmt(+pf.unitPrice) : ''} onChange={e => setPf({ ...pf, unitPrice: e.target.value.replace(/,/g, '') })} onFocus={e => e.target.select()} className="w-full h-[42px] rounded-input border border-border text-center text-[19px] font-bold" inputMode="decimal" /></div>
        </div>
      )}
      {pf.unit === 'حبة' && (
        <div className="grid grid-cols-2 gap-3">
          <div><label className={LC}>سعر الشراء (حبة)</label><input type="text" value={pf.unitPrice ? fmt(+pf.unitPrice) : ''} onChange={e => setPf({ ...pf, unitPrice: e.target.value.replace(/,/g, '') })} onFocus={e => e.target.select()} className="w-full h-[42px] rounded-input border border-border text-center text-[19px] font-bold" inputMode="decimal" /></div>
          <div><label className={LC}>سعر البيع (حبة)</label><input type="text" value={pf.sellingPrice ? fmt(+pf.sellingPrice) : ''} onChange={e => setPf({ ...pf, sellingPrice: e.target.value.replace(/,/g, '') })} onFocus={e => e.target.select()} className="w-full h-[42px] rounded-input border border-border text-center text-[19px] font-bold" inputMode="decimal" /></div>
        </div>
      )}
      {pf.unit === 'كرتون' && +pf.boxQty > 0 && +pf.unitPrice > 0 && (
        <div className="bg-primary-light rounded-input p-3 text-center">
          <span className="text-small text-text-secondary">سعر الحبة: </span>
          <span className="text-financial text-primary">{fmt(+pf.unitPrice / +pf.boxQty)}</span>
          <span className="text-small text-text-secondary mr-2">({fmt(+pf.quantity * +pf.boxQty)} حبة = {fmt(+pf.quantity * +pf.unitPrice)})</span>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div><label className={LC}>سعر البيع (حبة)</label><input type="text" value={pf.sellingPrice ? fmt(+pf.sellingPrice) : ''} onChange={e => setPf({ ...pf, sellingPrice: e.target.value.replace(/,/g, '') })} onFocus={e => e.target.select()} className="w-full h-[42px] rounded-input border border-border text-center text-[19px] font-bold" inputMode="decimal" /></div>
        <div><label className={LC}>تنبيه الحد الأدنى</label><input type="number" value={pf.minStock} onChange={e => setPf({ ...pf, minStock: e.target.value })} onFocus={e => e.target.select()} className="w-full h-[42px] rounded-input border border-border text-center text-[19px] font-bold" inputMode="numeric" /></div>
      </div>
      <Button fullWidth onClick={addToCart}>إضافة إلى الفاتورة</Button>
    </div>
  </Dialog>

  <BarcodeScanner
    open={barcodeOpen}
    onClose={() => setBarcodeOpen(false)}
    onDetected={handleBarcodeDetected}
    onProductFound={(product: any) => { openPf(product); }}
  />
</div>
);
  }
