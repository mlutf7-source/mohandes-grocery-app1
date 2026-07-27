import { Barcode } from 'lucide-react';

interface BarcodeButtonProps {
  onClick: () => void;
  }

  export default function BarcodeButton({ onClick }: BarcodeButtonProps) {
    return (
        <button
              type="button"
                    onClick={onClick}
                          className="flex items-center justify-center w-[48px] h-[48px] rounded-input border border-border bg-surface
                                           text-text-secondary hover:text-primary hover:border-primary transition-colors active:bg-primary-light"
                                               >
                                                     <Barcode size={22} />
                                                         </button>
                                                           );
                                                           }