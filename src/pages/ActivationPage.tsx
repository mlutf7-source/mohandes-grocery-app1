import { useState, useEffect } from 'react';
import { activateApp, getRemainingDays } from '@/utils/activation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Lock, Key } from 'lucide-react';

export default function ActivationPage({ onActivated }: { onActivated: () => void }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [days, setDays] = useState(0);

  useEffect(() => {
    getRemainingDays().then(setDays);
  }, []);

  const handleActivate = async () => {
    if (!code) { setError('أدخل رمز التفعيل'); return; }
    const success = await activateApp(code);
    if (success) {
      onActivated();
    } else {
      setError('رمز التفعيل غير صحيح');
      setCode('');
    }
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl">
        <div className="w-20 h-20 bg-danger/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Lock size={40} className="text-danger" />
        </div>
        <h2 className="text-page-title text-text-primary mb-2">انتهت الفترة التجريبية</h2>
        <p className="text-small text-text-secondary mb-2">المدة المتبقية: {days} يوم</p>
        <p className="text-small text-text-secondary mb-6">يرجى إدخال رمز التفعيل للمتابعة</p>
        
        <Input
          type="text"
          value={code}
          onChange={e => { setCode(e.target.value.toUpperCase()); setError(''); }}
          onKeyDown={e => e.key === 'Enter' && handleActivate()}
          placeholder="XXXX-XXXX-XXXX-XXXX"
          className="text-center font-bold tracking-widest"
        />
        {error && <p className="text-danger text-small mt-2">{error}</p>}
        
        <Button fullWidth onClick={handleActivate} className="mt-4">
          <Key size={18} /> تفعيل
        </Button>
      </div>
    </div>
  );
}
