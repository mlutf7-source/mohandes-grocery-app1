import { useState, useEffect } from 'react';
import { activateApp, getRemainingDays } from '@/utils/activation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Lock, Key, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const ADMIN_WHATSAPP = '967778880031';
const WHATSAPP_MESSAGE = encodeURIComponent('السلام عليكم\nأحتاج رمز تفعيل تطبيق البقالات');

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
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const success = await activateApp(code);
    if (success) {
      setSuccess(true);
      setTimeout(() => onActivated(), 1500);
    } else {
      setError('رمز التفعيل غير صحيح أو مستخدم مسبقاً.');
      setCode('');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-primary-dark flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl">
        
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
            <p className="text-small text-text-secondary text-center mb-4">
              يرجى إدخال رمز التفعيل للمتابعة
            </p>
            <a
              href={`https://wa.me/${ADMIN_WHATSAPP}?text=${WHATSAPP_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-success text-white rounded-btn text-small font-semibold mb-4 hover:bg-success/90 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              واتساب المسؤول
            </a>
          </>
        ) : (
          <>
            <h2 className="text-page-title text-text-primary text-center mb-2">فترة تجريبية</h2>
            <p className="text-small text-text-secondary text-center mb-2">
              متبقي {days} يوم على انتهاء الفترة التجريبية
            </p>
            <p className="text-small text-text-secondary text-center mb-6">
              يمكنك تفعيل التطبيق الآن
            </p>
          </>
        )}

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
    </div>
  );
                  }
