import { useState } from 'react';
import { generateActivationCode, addActivationCode, removeActivationCode, getActivationCodes } from '@/utils/activation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Key, Plus, Trash2, Copy } from 'lucide-react';

export default function AdminPage() {
  const [codes, setCodes] = useState<string[]>(getActivationCodes());

  const handleGenerate = () => {
    const code = generateActivationCode();
    addActivationCode(code);
    setCodes(getActivationCodes());
  };

  const handleDelete = (code: string) => {
    if (confirm('حذف هذا الرمز؟')) {
      removeActivationCode(code);
      setCodes(getActivationCodes());
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    alert('تم النسخ');
  };

  return (
    <div className="page-container">
      <h1 className="page-title">إدارة التفعيل (المسؤول)</h1>

      <Button fullWidth onClick={handleGenerate} className="mb-4">
        <Plus size={18} /> إنشاء رمز تفعيل جديد
      </Button>

      {codes.length === 0 ? (
        <p className="text-center text-text-secondary">لا توجد رموز تفعيل</p>
      ) : (
        <div className="space-y-3">
          {codes.map((code: string) => (
            <Card key={code} accent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key size={20} className="text-primary" />
                  <span className="font-bold text-lg tracking-widest">{code}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleCopy(code)} className="p-2 text-info hover:bg-info/10 rounded-lg">
                    <Copy size={18} />
                  </button>
                  <button onClick={() => handleDelete(code)} className="p-2 text-danger hover:bg-danger/10 rounded-lg">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
