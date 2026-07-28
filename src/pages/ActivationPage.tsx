import { useState, useEffect } from 'react';
import { activateApp, getRemainingDays } from '@/utils/activation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Lock, Key, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function ActivationPage({ onActivated }: { onActivated: () => void }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [days, setDays] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getRemainingDays().then(setDays);
  }, []);

  const handleActivate = async () => {
    if (!code) { setError('أدخل رمز التفعيل'); return; }
    if (code.length < 19) { setError('الرمز غير مكتمل'); return; }
    
    setLoading(true);
    setError('');
    
    // محاكاة تأخير بسيط للشبكة
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const success = await activateApp(code);
    if (success) {
      setSuccess(true);
      setTimeout(() => onActivated(), 1500);
    } else {
      setError('رمز التفعيل غير صحيح. تأكد من الرمز أو اتصل بالدعم.');
      setCode('');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-primary-dark flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl">
        
        {/* أيقونة الحالة */}
        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-colors duration-300 ${
          success ? 'bg-success/10' : days <= 0 ? 'bg-danger/10' : 'bg-warning/10'
        }`}>
          {success ? (
            <CheckCircle size={40} className="text-success" />
          ) : days <= 0 ? (
            <Lock size={40} className="text-danger" />
          ) : (
            <Clock size={40} className="text-warning" />
          )}
        </div>

        {/* العنوان والوصف */}
        {success ? (
          <>
            <h2 className="text-page-title text-success text-center mb-2">تم التفعيل بنجاح</h2>
            <p className="text-small text-text-secondary text-center mb-6">جاري تحويلك للتطبيق...</p>
          </>
        ) : days <= 0 ? (
          <>
            <h2 className="text-page-title text-text-primary text-center mb-2">انتهت الفترة التجريبية</h2>
            <div className="flex items-center justify-center gap-1 mb-2 text-danger">
              <AlertCircle size={16} />
              <p className="text-small font-bold">التطبيق مقفل</p>
            </div>
            <p className="text-small text-text-secondary text-center mb-6">
              يرجى إدخال رمز التفعيل للمتابعة. تواصل مع المسؤول للحصول على الرمز.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-page-title text-text-primary text-center mb-2">فترة تجريبية</h2>
            <p className="text-small text-text-secondary text-center mb-2">
              متبقي {days} يوم على انتهاء الفترة التجريبية
            </p>
            <p className="text-small text-text-secondary text-center mb-6">
              يمكنك تفعيل التطبيق الآن لإلغاء المهلة
            </p>
          </>
        )}

        {/* حقل إدخال رمز التفعيل */}
        {!success && (
          <>
            <Input
              type="text"
              value={code}
              onChange={e => {
                let val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                if (val.length > 4) val = val.slice(0, 4) + '-' + val.slice(4);
                if (val.length > 9) val = val.slice(0, 9) + '-' + val.slice(9);
                if (val.length > 14) val = val.slice(0, 14) + '-' + val.slice(14);
                if (val.length > 19) val = val.slice(0, 19);
                setCode(val);
                setError('');
              }}
              onKeyDown={e => e.key === 'Enter' && handleActivate()}
              placeholder="XXXX-XXXX-XXXX-XXXX"
              className="text-center font-bold text-lg tracking-widest"
              maxLength={19}
              disabled={loading}
            />
            {error && (
              <div className="flex items-center gap-2 mt-2 text-danger text-small">
                <AlertCircle size={14} />
                <p>{error}</p>
              </div>
            )}
            
            <Button fullWidth onClick={handleActivate} className="mt-4" loading={loading}>
              <Key size={18} /> {loading ? 'جاري التفعيل...' : 'تفعيل'}
            </Button>
          </>
        )}
      </div>

      {/* تذييل */}
      <p className="text-white/50 text-small mt-6 text-center">Mohandes Digital © 2025</p>
    </div>
  );
              }
