import { useEffect, useCallback } from 'react';

export function usePreventLeave(hasChanges: boolean, message = 'لديك تغييرات غير محفوظة. هل تريد المغادرة؟') {
  useEffect(() => {
      (window as any).__hasUnsavedChanges = hasChanges;
        }, [hasChanges]);

          useEffect(() => {
              if (!hasChanges) return;

                  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
                        e.preventDefault();
                              e.returnValue = message;
                                  };
                                      window.addEventListener('beforeunload', handleBeforeUnload);

                                          return () => {
                                                window.removeEventListener('beforeunload', handleBeforeUnload);
                                                    };
                                                      }, [hasChanges, message]);

                                                        const confirmLeave = useCallback((): boolean => {
                                                            if (hasChanges) {
                                                                  return confirm(message);
                                                                      }
                                                                          return true;
                                                                            }, [hasChanges, message]);

                                                                              const clearChanges = useCallback(() => {
                                                                                  (window as any).__hasUnsavedChanges = false;
                                                                                    }, []);

                                                                                      return { confirmLeave, clearChanges };
                                                                                      }