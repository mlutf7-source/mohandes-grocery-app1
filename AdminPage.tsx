import React from 'react';
import { useStore } from '@/store';

export default function AdminPage() {
  const s = useStore();
  const [codes, setCodes] = React.useState<string[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem('bakala-admin-codes');
    if (saved) setCodes(JSON.parse(saved));
  }, []);

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) code += chars.charAt(Math.floor(Math.random() * chars.length));
      if (i < 3) code += '-';
    }
    const updated = [...codes, code];
    setCodes(updated);
    localStorage.setItem('bakala-admin-codes', JSON.stringify(updated));
  };

  const deleteCode = (code: string) => {
    const updated = codes.filter(c => c !== code);
    setCodes(updated);
    localStorage.setItem('bakala-admin-codes', JSON.stringify(updated));
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert('تم النسخ');
  };

  return (
    <div className="page-container">
      <h1 className="page-title">إدارة التفعيل (المسؤول)</h1>
      <button onClick={generateCode} className="btn-primary w-full mb-4">إنشاء رمز تفعيل جديد</button>
      {codes.length === 0 ? (
        <p className="text-center text-text-secondary">لا توجد رموز تفعيل</p>
      ) : (
        <div className="space-y-3">
          {codes.map((code: string) => (
            <div key={code} className="card flex items-center justify-between">
              <span className="font-bold text-lg tracking-widest">{code}</span>
              <div className="flex gap-2">
                <button onClick={() => copyCode(code)} className="p-2 text-info">نسخ</button>
                <button onClick={() => deleteCode(code)} className="p-2 text-danger">حذف</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
          }
