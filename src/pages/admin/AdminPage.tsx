import { useState } from 'react';
import { generateActivationCode, addActivationCode, removeActivationCode, getActivationCodes } from '@/utils/activation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Key, Plus, Trash2, Copy, Download, Shield } from 'lucide-react';

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

  const handleExport = () => {
    const text = codes.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `رموز-التفعيل-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-4">
        <h1 className="page-title mb-0">إدارة التفعيل</h1>
        <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-small font-semibold flex items-center gap-1">
          <Shield size={14} />
          نسخة المسؤول
        </div>
      </div>

      {/* إحصائيات */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card accent className="!bg-info/5 text-center">
          <p className="text-small text-text-secondary">إجمالي الرموز</p>
          <p className="text-financial text-info">{codes.length}</p>
        </Card>
        <Card accent className="!bg-warning/5 text-center">
          <p className="text-small text-text-secondary">رموز متاحة</p>
          <p className="text-financial text-warning">{codes.length}</p>
        </Card>
      </div>

      <div className="flex gap-2 mb-4">
        <Button fullWidth onClick={handleGenerate}>
          <Plus size={18} /> إنشاء رمز جديد
        </Button>
        {codes.length > 0 && (
          <Button fullWidth variant="secondary" onClick={handleExport}>
            <Download size={18} /> تصدير
          </Button>
        )}
      </div>

      {codes.length === 0 ? (
        <div className="text-center py-12">
          <Key size={48} className="text-text-secondary mx-auto mb-4 opacity-50" />
          <p className="text-text-secondary">لا توجد رموز تفعيل</p>
          <p className="text-small text-text-secondary mt-1">اضغط على "إنشاء رمز جديد" لإضافة رموز</p>
        </div>
      ) : (
        <div className="space-y-3">
          {codes.map((code: string, index: number) => (
            <Card key={code} accent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-small text-text-secondary w-6">{index + 1}.</span>
                  <Key size={20} className="text-primary" />
                  <span className="font-bold text-lg tracking-widest">{code}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleCopy(code)} className="p-2 text-info hover:bg-info/10 rounded-lg" title="نسخ">
                    <Copy size={18} />
                  </button>
                  <button onClick={() => handleDelete(code)} className="p-2 text-danger hover:bg-danger/10 rounded-lg" title="حذف">
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
