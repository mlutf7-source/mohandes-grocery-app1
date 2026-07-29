import { useState } from 'react';
import { useStore } from '@/store';
import { usePreventLeave } from '@/hooks/usePreventLeave';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ArrowDown, Trash2, Pen, Calendar, User, PiggyBank, DollarSign, FileText } from 'lucide-react';

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
const dt = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

export default function Receipt() {
  const s = useStore();
  const currency = s.settings?.currency || 'ريال يمني';
  const [type, setType] = useState<'customer' | 'supplier'>('customer');
  const [selectedId, setSelectedId] = useState('');
  const [amount, setAmount] = useState('');
  const [box, setBox] = useState('default-cash-box');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  usePreventLeave(hasChanges);

  const list = type === 'customer' ? s.customers : s.suppliers;
  const selected = list.find((x: any) => x.id === selectedId);

  const allReceipts = s.cashMovements.filter((m: any) => m.type === 'deposit' && m.referenceType === 'manual');
  const nextReceiptNo = allReceipts.length + 1;

  const handleChange = (setter: any, value: string) => { setter(value); setHasChanges(true); };

  const save = () => {
    const amt = +amount || 0;
    if (!amt || !selectedId) return;

    if (editingId) {
      s.updateCashMovement(editingId, { amount: amt, date, notes, cashBoxId: box });
    } else {
      if (type === 'customer') s.updateCustomer(selectedId, { balance: Math.max(0, (selected?.balance || 0) - amt) });
      else s.updateSupplier(selectedId, { balance: Math.max(0, (selected?.balance || 0) - amt) });
      s.addCashMovement({
        cashBoxId: box, type: 'deposit', amount: amt,
        description: notes ? `سند قبض - ${notes}` : `سند قبض`,
        referenceType: 'manual', referenceId: selectedId, createdAt: new Date(date).toISOString(),
        receiptNo: nextReceiptNo,
      });
    }

    setAmount('');
    setNotes('');
    setEditingId(null);
    setHasChanges(false);
  };

  const deleteMovement = (m: any) => {
    if (confirm('سيتم نقل السند إلى سلة المحذوفات. متابعة؟')) {
      const target = type === 'customer' 
        ? s.customers.find((c: any) => c.id === m.referenceId) 
        : s.suppliers.find((sup: any) => sup.id === m.referenceId);
      
      if (!target) return;

      const newBalance = (target.balance || 0) + m.amount;
      
      if (type === 'customer') s.updateCustomer(m.referenceId, { balance: newBalance });
      else s.updateSupplier(m.referenceId, { balance: newBalance });
      
      s.deleteCashMovement(m.id);
    }
  };

  const editMovement = (m: any) => {
    setEditingId(m.id);
    setSelectedId(m.referenceId);
    setAmount(m.amount.toString());
    setBox(m.cashBoxId || 'default-cash-box');
    setDate(new Date(m.createdAt).toISOString().split('T')[0]);
    setNotes(m.description.replace('سند قبض - ', '').replace('سند قبض', ''));
    setHasChanges(true);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">سند قبض</h1>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setType('customer')} className={`flex-1 py-3 rounded-btn font-semibold ${type === 'customer' ? 'bg-success text-white' : 'bg-success/10 text-success'}`}>من عميل</button>
        <button onClick={() => setType('supplier')} className={`flex-1 py-3 rounded-btn font-semibold ${type === 'supplier' ? 'bg-success text-white' : 'bg-success/10 text-success'}`}>من مورد</button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">{type === 'customer' ? 'العميل' : 'المورد'}</label>
        <select value={selectedId} onChange={e => handleChange(setSelectedId, e.target.value)} className="input-field">
          <option value="">اختر {type === 'customer' ? 'العميل' : 'المورد'}</option>
          {list.map((x: any) => <option key={x.id} value={x.id}>{x.name}</option>)}
        </select>
      </div>

      {selected && (
        <Card accent className="mb-4">
          <div className="flex justify-between items-center">
            <span className="text-small text-text-secondary">الرصيد {selected.balance > 0 ? (type === 'customer' ? 'عليه' : 'له') : selected.balance < 0 ? (type === 'customer' ? 'له' : 'عليه') : ''}</span>
            <span className={`text-financial ${selected.balance > 0 ? (type === 'customer' ? 'text-danger' : 'text-success') : selected.balance < 0 ? (type === 'customer' ? 'text-success' : 'text-danger') : 'text-info'}`}>
              {fmt(Math.abs(selected.balance))} <span className="text-small">{currency}</span>
            </span>
          </div>
        </Card>
      )}

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">الصندوق</label>
        <select value={box} onChange={e => handleChange(setBox, e.target.value)} className="input-field">
          {s.cashBoxes.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <Input label="المبلغ" type="text" inputMode="decimal" value={amount ? fmt(+amount) : ''} onChange={e => handleChange(setAmount, e.target.value.replace(/,/g, ''))} />
        <div className="w-full">
          <label className="block text-sm font-semibold mb-1">التاريخ</label>
          <input type="date" value={date} onChange={e => handleChange(setDate, e.target.value)} className="input-field" dir="ltr" />
        </div>
      </div>

      <div className="mb-4"><Input label="الملاحظات" value={notes} onChange={e => handleChange(setNotes, e.target.value)} /></div>

      <Button fullWidth onClick={save}><ArrowDown size={20} />{editingId ? 'تحديث' : 'حفظ'} سند القبض</Button>

      {allReceipts.length > 0 && (
        <div className="mt-6">
          <h2 className="text-card-title mb-3 text-center">آخر السندات</h2>
          {[...allReceipts].reverse().map((m: any) => {
            const owner = s.customers.find((c: any) => c.id === m.referenceId) || s.suppliers.find((sup: any) => sup.id === m.referenceId);
            const boxName = s.cashBoxes.find((b: any) => b.id === m.cashBoxId)?.name || '';
            return (
              <Card key={m.id} className="mb-3 !p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex gap-1">
                    <button onClick={() => editMovement(m)} className="flex items-center gap-1 px-2 py-1 bg-success/10 text-success rounded-btn text-small"><Pen size={12} />تعديل</button>
                    <button onClick={() => deleteMovement(m)} className="flex items-center gap-1 px-2 py-1 bg-danger/10 text-danger rounded-btn text-small"><Trash2 size={12} />حذف</button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-success/10 text-success px-3 py-1 rounded-full text-small font-bold">#{m.receiptNo || m.id.slice(-6)}</span>
                    <span className="font-bold text-success flex items-center gap-1"><ArrowDown size={16} />سند قبض</span>
                  </div>
                </div>
                <div className="space-y-0 border border-border rounded-xl overflow-hidden">
                  <div className="flex justify-between items-center px-3 py-2 border-b border-border"><span className="text-small text-text-secondary flex items-center gap-2"><User size={14} className="text-success" />الحساب</span><span className="font-semibold text-small">{owner?.name || '-'}</span></div>
                  <div className="flex justify-between items-center px-3 py-2 border-b border-border"><span className="text-small text-text-secondary flex items-center gap-2"><Calendar size={14} className="text-success" />التاريخ</span><span className="font-semibold text-small">{dt(m.createdAt)}</span></div>
                  <div className="flex justify-between items-center px-3 py-2 border-b border-border"><span className="text-small text-text-secondary flex items-center gap-2"><DollarSign size={14} className="text-success" />المبلغ</span><span className="text-financial text-success">{fmt(m.amount)} <span className="text-small">{currency}</span></span></div>
                  <div className="flex justify-between items-center px-3 py-2"><span className="text-small text-text-secondary flex items-center gap-2"><PiggyBank size={14} className="text-success" />الصندوق</span><span className="font-semibold text-small">{boxName}</span></div>
                </div>
                {m.description && m.description !== 'سند قبض' && (
                  <div className="mt-2 bg-success/5 rounded-lg p-2 flex items-center gap-2 text-small">
                    <FileText size={14} className="text-success" />
                    <span>الملاحظات: {m.description.replace('سند قبض - ', '')}</span>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
  }
