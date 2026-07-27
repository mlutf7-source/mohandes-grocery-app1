import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
    onChange: (value: string) => void;
      placeholder?: string;
      }

      export default function SearchInput({
        value,
          onChange,
            placeholder = 'بحث...',
            }: SearchInputProps) {
              return (
                  <div className="relative w-full mb-4">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
                              <input
                                      type="text"
                                              value={value}
                                                      onChange={(e) => onChange(e.target.value)}
                                                              placeholder={placeholder}
                                                                      className="search-input"
                                                                            />
                                                                                  {value && (
                                                                                          <button
                                                                                                    onClick={() => onChange('')}
                                                                                                              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-danger transition-colors"
                                                                                                                      >
                                                                                                                                <X size={18} />
                                                                                                                                        </button>
                                                                                                                                              )}
                                                                                                                                                  </div>
                                                                                                                                                    );
                                                                                                                                                    }