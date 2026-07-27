import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './Header';

export default function Layout() {
  const navigate = useNavigate();
    const location = useLocation();

      useEffect(() => {
          const handlePopState = (e: PopStateEvent) => {
                const hasUnsavedChanges = (window as any).__hasUnsavedChanges;
                      if (hasUnsavedChanges) {
                              const confirm = window.confirm('لديك تغييرات غير محفوظة. هل تريد المغادرة؟');
                                      if (!confirm) {
                                                window.history.pushState(null, '', location.pathname);
                                                        } else {
                                                                  (window as any).__hasUnsavedChanges = false;
                                                                          }
                                                                                }
                                                                                    };

                                                                                        window.addEventListener('popstate', handlePopState);
                                                                                            return () => window.removeEventListener('popstate', handlePopState);
                                                                                              }, [location]);

                                                                                                return (
                                                                                                    <div className="min-h-screen">
                                                                                                          <Header />
                                                                                                                <main className="pt-[108px] pb-4">
                                                                                                                        <Outlet />
                                                                                                                              </main>
                                                                                                                                  </div>
                                                                                                                                    );
                                                                                                                                    }