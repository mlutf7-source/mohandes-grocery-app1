/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#15803D',
          dark: '#166534',
          light: '#DCFCE7'
        },
        background: '#F4F7F5',
        surface: '#FFFFFF',
        border: '#E5E7EB',
        'text-primary': '#1F2937',
        'text-secondary': '#6B7280',
        danger: '#DC2626',
        warning: '#CA8A04',
        success: '#16A34A',
        info: '#2563EB'
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 6px rgba(0, 0, 0, 0.12)',
        'dialog': '0 10px 25px rgba(0, 0, 0, 0.15)',
        // ⭐ ظل ناعم للأيقونات رباعية الأبعاد
        'icon': '0 4px 12px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif']
      },
      fontSize: {
        'app-title': ['26px', { lineHeight: '1.3', fontWeight: '700' }],
        'page-title': ['22px', { lineHeight: '1.4', fontWeight: '700' }],
        'card-title': ['18px', { lineHeight: '1.5', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'small': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'financial': ['24px', { lineHeight: '1.2', fontWeight: '700' }]
      },
      spacing: {
        '1': '4px', '2': '8px', '3': '12px', '4': '16px', '6': '24px', '8': '32px'
      },
      borderRadius: {
        'input': '12px',
        'btn': '12px',
        'card': '18px',
        'dialog': '20px',
        // ⭐ نصف قطر ثابت للأيقونات الرباعية
        'icon': '16px' 
      }
    }
  },
  plugins: []
}
