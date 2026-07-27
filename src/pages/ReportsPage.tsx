import { useState } from 'react';
import CustomerReport from './reports/CustomerReport';
import SupplierReport from './reports/SupplierReport';
import CashBoxReport from './reports/CashBoxReport';
import SalesReport from './reports/SalesReport';
import PurchasesReport from './reports/PurchasesReport';
import InventoryReport from './reports/InventoryReport';
import ProfitReport from './reports/ProfitReport';
import ExpensesReport from './reports/ExpensesReport';

const tabs = [
  { key: 'customers', label: 'العملاء' },
    { key: 'suppliers', label: 'الموردين' },
      { key: 'cashboxes', label: 'الصناديق' },
        { key: 'sales', label: 'المبيعات' },
          { key: 'purchases', label: 'المشتريات' },
            { key: 'inventory', label: 'المخزون' },
              { key: 'profits', label: 'الأرباح' },
                { key: 'expenses', label: 'المصروفات' },
                ];

                export default function ReportsPage() {
                  const [activeTab, setActiveTab] = useState('customers');

                    return (
                        <div className="page-container">
                              <h1 className="page-title">التقارير</h1>

                                    <div className="flex gap-1 overflow-x-auto mb-4 pb-1">
                                            {tabs.map((t) => (
                                                      <button
                                                                  key={t.key}
                                                                              onClick={() => setActiveTab(t.key)}
                                                                                          className={`px-3 py-2 rounded-btn text-small font-semibold whitespace-nowrap transition-colors ${activeTab === t.key ? 'bg-primary text-white' : 'bg-primary-light text-primary'}`}
                                                                                                    >
                                                                                                                {t.label}
                                                                                                                          </button>
                                                                                                                                  ))}
                                                                                                                                        </div>

                                                                                                                                              {activeTab === 'customers' && <CustomerReport />}
                                                                                                                                                    {activeTab === 'suppliers' && <SupplierReport />}
                                                                                                                                                          {activeTab === 'cashboxes' && <CashBoxReport />}
                                                                                                                                                                {activeTab === 'sales' && <SalesReport />}
                                                                                                                                                                      {activeTab === 'purchases' && <PurchasesReport />}
                                                                                                                                                                            {activeTab === 'inventory' && <InventoryReport />}
                                                                                                                                                                                  {activeTab === 'profits' && <ProfitReport />}
                                                                                                                                                                                        {activeTab === 'expenses' && <ExpensesReport />}
                                                                                                                                                                                            </div>
                                                                                                                                                                                              );
                                                                                                                                                                                              }