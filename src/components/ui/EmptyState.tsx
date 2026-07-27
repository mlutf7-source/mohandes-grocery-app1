import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
    icon?: React.ReactNode;
    }

    export default function EmptyState({ message = 'لا توجد بيانات', icon }: EmptyStateProps) {
      return (
          <div className="flex flex-col items-center justify-center py-12 text-text-secondary">
                {icon || <PackageOpen size={64} strokeWidth={1.5} />}
                      <p className="mt-4 text-body">{message}</p>
                          </div>
                            );
                            }