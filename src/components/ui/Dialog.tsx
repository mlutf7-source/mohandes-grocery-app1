import { X } from 'lucide-react';
import { type ReactNode, useEffect, CSSProperties } from 'react';

interface DialogProps {
  open: boolean;
    onClose: () => void;
      title: string;
        children: ReactNode;
          style?: CSSProperties;
          }

          export default function Dialog({ open, onClose, title, children, style }: DialogProps) {
            useEffect(() => {
                if (open) {
                      document.body.style.overflow = 'hidden';
                          } else {
                                document.body.style.overflow = '';
                                    }
                                        return () => {
                                              document.body.style.overflow = '';
                                                  };
                                                    }, [open]);

                                                      if (!open) return null;

                                                        const handleClose = () => {
                                                            const hasChanges = (window as any).__hasUnsavedChanges;
                                                                if (hasChanges) {
                                                                      if (confirm('لديك تغييرات غير محفوظة. هل تريد المغادرة؟')) {
                                                                              (window as any).__hasUnsavedChanges = false;
                                                                                      onClose();
                                                                                            }
                                                                                                } else {
                                                                                                      onClose();
                                                                                                          }
                                                                                                            };

                                                                                                              return (
                                                                                                                  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
                                                                                                                        <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
                                                                                                                              <div className="relative bg-surface rounded-dialog w-full sm:max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-dialog" style={style}>
                                                                                                                                      <div className="flex items-center justify-between mb-4">
                                                                                                                                                <h2 className="text-card-title text-text-primary">{title}</h2>
                                                                                                                                                          <button onClick={handleClose} className="text-text-secondary hover:text-danger transition-colors">
                                                                                                                                                                      <X size={24} />
                                                                                                                                                                                </button>
                                                                                                                                                                                        </div>
                                                                                                                                                                                                {children}
                                                                                                                                                                                                      </div>
                                                                                                                                                                                                          </div>
                                                                                                                                                                                                            );
                                                                                                                                                                                                            }