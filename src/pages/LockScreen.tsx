import { useState } from 'react';
import { Store, Lock } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState('');
    const [error, setError] = useState('');
      const passcode = localStorage.getItem('app-passcode');

        const handleUnlock = () => {
            if (code === passcode) {
                  onUnlock();
                      } else {
                            setError('رمز المرور غير صحيح');
                                  setCode('');
                                      }
                                        };

                                          return (
                                              <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-8">
                                                    <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl">
                                                            <div className="w-20 h-20 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-6">
                                                                      <Store size={40} className="text-primary" />
                                                                              </div>
                                                                                      <h2 className="text-page-title text-text-primary mb-2">البقالات</h2>
                                                                                              <p className="text-small text-text-secondary mb-6">أدخل رمز المرور للمتابعة</p>
                                                                                                      
                                                                                                              <Input
                                                                                                                        type="number"
                                                                                                                                  value={code}
                                                                                                                                            onChange={e => { setCode(e.target.value.slice(0, 6)); setError(''); }}
                                                                                                                                                      onKeyDown={e => e.key === 'Enter' && handleUnlock()}
                                                                                                                                                                placeholder="••••••"
                                                                                                                                                                          className="text-center text-financial tracking-widest"
                                                                                                                                                                                  />
                                                                                                                                                                                          {error && <p className="text-danger text-small mt-2">{error}</p>}
                                                                                                                                                                                                  
                                                                                                                                                                                                          <Button fullWidth onClick={handleUnlock} className="mt-4">
                                                                                                                                                                                                                    <Lock size={18} /> فتح
                                                                                                                                                                                                                            </Button>
                                                                                                                                                                                                                                  </div>
                                                                                                                                                                                                                                      </div>
                                                                                                                                                                                                                                        );
                                                                                                                                                                                                                                        }