import { useState, useRef } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Store, Camera } from 'lucide-react';

export default function StoreInfo() {
  const fileInputRef = useRef<HTMLInputElement>(null);
    const [info, setInfo] = useState({
        name: localStorage.getItem('store-name') || 'البقالات',
            owner: localStorage.getItem('store-owner') || '',
                phone: localStorage.getItem('store-phone') || '',
                    address: localStorage.getItem('store-address') || '',
                        logo: localStorage.getItem('store-logo') || '',
                          });

                            const save = () => {
                                localStorage.setItem('store-name', info.name);
                                    localStorage.setItem('store-owner', info.owner);
                                        localStorage.setItem('store-phone', info.phone);
                                            localStorage.setItem('store-address', info.address);
                                                localStorage.setItem('store-logo', info.logo);
                                                    alert('تم حفظ معلومات المتجر');
                                                      };

                                                        const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
                                                            const file = e.target.files?.[0];
                                                                if (!file) return;

                                                                    const reader = new FileReader();
                                                                        reader.onloadend = () => {
                                                                              setInfo({ ...info, logo: reader.result as string });
                                                                                  };
                                                                                      reader.readAsDataURL(file);
                                                                                        };

                                                                                          return (
                                                                                              <div className="page-container">
                                                                                                    <h1 className="page-title">بيانات المتجر</h1>

                                                                                                          <Card accent className="mb-4 text-center">
                                                                                                                  <div className="w-24 h-24 rounded-2xl bg-primary-light flex items-center justify-center mx-auto mb-3 relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                                                                                                            {info.logo ? (
                                                                                                                                        <img src={info.logo} alt="شعار المتجر" className="w-20 h-20 rounded-xl object-cover" />
                                                                                                                                                  ) : (
                                                                                                                                                              <Store size={48} className="text-primary" />
                                                                                                                                                                        )}
                                                                                                                                                                                  <div className="absolute bottom-0 right-0 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md">
                                                                                                                                                                                              <Camera size={14} />
                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        <p className="text-small text-text-secondary">اضغط على الشعار لتغييره</p>
                                                                                                                                                                                                                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                                                                                                                                                                                                                                      </Card>

                                                                                                                                                                                                                                            <div className="space-y-3">
                                                                                                                                                                                                                                                    <Input label="اسم المتجر" value={info.name} onChange={e => setInfo({ ...info, name: e.target.value })} />
                                                                                                                                                                                                                                                            <Input label="اسم المالك" value={info.owner} onChange={e => setInfo({ ...info, owner: e.target.value })} />
                                                                                                                                                                                                                                                                    <Input label="رقم الهاتف" type="tel" value={info.phone} onChange={e => setInfo({ ...info, phone: e.target.value })} />
                                                                                                                                                                                                                                                                            <Input label="العنوان" value={info.address} onChange={e => setInfo({ ...info, address: e.target.value })} />
                                                                                                                                                                                                                                                                                    <Button fullWidth onClick={save}>حفظ البيانات</Button>
                                                                                                                                                                                                                                                                                          </div>
                                                                                                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                                                                                                );
                                                                                                                                                                                                                                                                                                }