import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const gid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);
const now = () => new Date().toISOString();
const today = () => new Date().toISOString().split('T')[0];

const defaultBox = { id: 'default-cash-box', name: 'الصندوق الرئيسي', balance: 0, createdAt: now(), updatedAt: now() };
const defaultSettings = { currency: 'ريال يمني' };

export const useStore = create<any>()(persist((set, get) => ({
  products: [], customers: [], suppliers: [], cashBoxes: [defaultBox], cashMovements: [], sales: [], purchases: [], expenses: [],
  settings: defaultSettings,
  trash: { products: [], customers: [], suppliers: [], cashBoxes: [], sales: [], purchases: [], expenses: [], cashMovements: [] },

  _del: (col: string, id: string) => set((s: any) => {
    const item = s[col].find((x: any) => x.id === id);
    if (!item || (col === 'cashBoxes' && id === 'default-cash-box')) return s;
    return { [col]: s[col].filter((x: any) => x.id !== id), trash: { ...s.trash, [col]: [...s.trash[col], item] } };
  }),
  _restore: (col: string, id: string) => set((s: any) => {
    const item = s.trash[col].find((x: any) => x.id === id);
    if (!item) return s;
    return { trash: { ...s.trash, [col]: s.trash[col].filter((x: any) => x.id !== id) }, [col]: [...s[col], item] };
  }),
  _permDel: (col: string, id: string) => set((s: any) => ({ trash: { ...s.trash, [col]: s.trash[col].filter((x: any) => x.id !== id) } })),

  addProduct: (p: any) => {
    const exists = get().products.find((x: any) => x.name === p.name);
    if (exists) return;
    set((s: any) => ({ products: [...s.products, { ...p, id: gid(), createdAt: p.createdAt || now(), updatedAt: now() }] }));
  },
  updateProduct: (id: string, d: any) => set((s: any) => ({ products: s.products.map((p: any) => p.id === id ? { ...p, ...d, updatedAt: now() } : p) })),
  deleteProduct: (id: string) => get()._del('products', id),
  restoreProduct: (id: string) => get()._restore('products', id),
  permanentDeleteProduct: (id: string) => get()._permDel('products', id),

  addCustomer: (c: any) => {
    const exists = get().customers.find((x: any) => x.name === c.name);
    if (exists) return;
    set((s: any) => ({ customers: [...s.customers, { ...c, id: gid(), balance: c.balance || 0, createdAt: c.createdAt || now(), updatedAt: now() }] }));
  },
  updateCustomer: (id: string, d: any) => set((s: any) => ({ customers: s.customers.map((c: any) => c.id === id ? { ...c, ...d, updatedAt: now() } : c) })),
  deleteCustomer: (id: string) => get()._del('customers', id),
  restoreCustomer: (id: string) => get()._restore('customers', id),
  permanentDeleteCustomer: (id: string) => get()._permDel('customers', id),

  addSupplier: (sup: any) => {
    const exists = get().suppliers.find((x: any) => x.name === sup.name);
    if (exists) return;
    set((s: any) => ({ suppliers: [...s.suppliers, { ...sup, id: gid(), balance: sup.balance || 0, createdAt: sup.createdAt || now(), updatedAt: now() }] }));
  },
  updateSupplier: (id: string, d: any) => set((s: any) => ({ suppliers: s.suppliers.map((s: any) => s.id === id ? { ...s, ...d, updatedAt: now() } : s) })),
  deleteSupplier: (id: string) => get()._del('suppliers', id),
  restoreSupplier: (id: string) => get()._restore('suppliers', id),
  permanentDeleteSupplier: (id: string) => get()._permDel('suppliers', id),

  addCashBox: (b: any) => set((s: any) => ({ cashBoxes: [...s.cashBoxes, { ...b, id: gid() }] })),
  updateCashBox: (id: string, d: any) => set((s: any) => ({ cashBoxes: s.cashBoxes.map((b: any) => b.id === id ? { ...b, ...d, updatedAt: now() } : b) })),
  deleteCashBox: (id: string) => get()._del('cashBoxes', id),
  restoreCashBox: (id: string) => get()._restore('cashBoxes', id),
  permanentDeleteCashBox: (id: string) => get()._permDel('cashBoxes', id),

  addCashMovement: (m: any) => set((s: any) => {
    const box = s.cashBoxes.find((b: any) => b.id === m.cashBoxId);
    const movement = { ...m, id: gid() };
    const updates: any = { cashMovements: [...s.cashMovements, movement] };
    if (box) {
      const nb = m.type === 'deposit' ? box.balance + m.amount : box.balance - m.amount;
      updates.cashBoxes = s.cashBoxes.map((b: any) => b.id === m.cashBoxId ? { ...b, balance: nb } : b);
    }
    return updates;
  }),
  updateCashMovement: (id: string, d: any) => set((s: any) => ({
    cashMovements: s.cashMovements.map((m: any) => m.id === id ? { ...m, ...d, updatedAt: now() } : m)
  })),
  deleteCashMovement: (id: string) => set((s: any) => {
    const item = s.cashMovements.find((x: any) => x.id === id);
    if (!item) return s;
    return {
      cashMovements: s.cashMovements.filter((x: any) => x.id !== id),
      trash: { ...s.trash, cashMovements: [...s.trash.cashMovements, item] },
    };
  }),
  restoreCashMovement: (id: string) => set((s: any) => {
    const item = s.trash.cashMovements.find((x: any) => x.id === id);
    if (!item) return s;
    return {
      trash: { ...s.trash, cashMovements: s.trash.cashMovements.filter((x: any) => x.id !== id) },
      cashMovements: [...s.cashMovements, item],
    };
  }),
  permanentDeleteCashMovement: (id: string) => set((s: any) => ({
    cashMovements: s.cashMovements.filter((m: any) => m.id !== id),
    trash: { ...s.trash, cashMovements: s.trash.cashMovements.filter((x: any) => x.id !== id) },
  })),

  // ========== البيع (Sales) ==========
  addSale: (sale: any) => set((s: any) => {
    const ns = { ...sale, id: gid(), invoiceNo: s.sales.length + 1 };
    const up: any = { sales: [...s.sales, ns] };
    // خصم المخزون
    up.products = s.products.map((p: any) => {
      const item = sale.items.find((i: any) => i.productId === p.id);
      if (item) return { ...p, stockQuantity: Math.max(0, p.stockQuantity - item.quantity), updatedAt: now() };
      return p;
    });
    // بيع آجل: العميل يصير مدين
    if (sale.type === 'credit' && sale.customerId) {
      up.customers = s.customers.map((c: any) => c.id === sale.customerId ? { ...c, balance: c.balance + sale.total, updatedAt: now() } : c);
    }
    // المدفوع يدخل الصندوق (للنقدي والآجل)
    const finalPaid = sale.type === 'cash' ? sale.total : (Number(sale.paid) || 0);
    if (sale.cashBoxId && finalPaid > 0) {
      const box = s.cashBoxes.find((b: any) => b.id === sale.cashBoxId);
      const desc = sale.type === 'credit'
        ? `قبض من فاتورة بيع #${ns.invoiceNo}`
        : `فاتورة بيع #${ns.invoiceNo}`;
      up.cashMovements = [...s.cashMovements, {
        id: gid(), cashBoxId: sale.cashBoxId, type: 'deposit',
        amount: finalPaid, description: desc,
        referenceType: 'sale', referenceId: ns.id, createdAt: now()
      }];
      if (box) up.cashBoxes = s.cashBoxes.map((b: any) => b.id === sale.cashBoxId ? { ...b, balance: b.balance + finalPaid } : b);
    }
    return up;
  }),

  // تعديل فاتورة بيع (يمنع الخصم المزدوج)
  updateSale: (id: string, saleData: any) => set((s: any) => {
    const oldSale = s.sales.find((x: any) => x.id === id);
    if (!oldSale) return s;

    // 1. إعادة المخزون والرصيد إلى ما كان عليه قبل الفاتورة القديمة
    let updatedProducts = s.products.map((p: any) => {
      const oldItem = oldSale.items.find((i: any) => i.productId === p.id);
      if (oldItem) return { ...p, stockQuantity: p.stockQuantity + oldItem.quantity };
      return p;
    });

    let updatedCustomers = s.customers;
    if (oldSale.type === 'credit' && oldSale.customerId) {
      updatedCustomers = updatedCustomers.map((c: any) =>
        c.id === oldSale.customerId ? { ...c, balance: c.balance - oldSale.total } : c
      );
    }

    // 2. حذف الحركة المالية القديمة من الصندوق
    let updatedCashMovements = s.cashMovements.filter((m: any) =>
      !(m.referenceType === 'sale' && m.referenceId === id)
    );
    let updatedCashBoxes = s.cashBoxes.map((b: any) => b);

    // 3. إنشاء الفاتورة الجديدة (نفس id والرقم)
    const newSale = {
      ...saleData,
      id: oldSale.id,
      invoiceNo: oldSale.invoiceNo,
      createdAt: oldSale.createdAt,
      updatedAt: now()
    };
    const updatedSales = s.sales.map((x: any) => x.id === id ? newSale : x);

    // 4. خصم المخزون للفاتورة الجديدة
    updatedProducts = updatedProducts.map((p: any) => {
      const newItem = newSale.items.find((i: any) => i.productId === p.id);
      if (newItem) return { ...p, stockQuantity: Math.max(0, p.stockQuantity - newItem.quantity) };
      return p;
    });

    // 5. تحديث رصيد العميل للفاتورة الجديدة
    if (newSale.type === 'credit' && newSale.customerId) {
      updatedCustomers = updatedCustomers.map((c: any) =>
        c.id === newSale.customerId ? { ...c, balance: c.balance + newSale.total } : c
      );
    }

    // 6. إضافة الحركة المالية الجديدة
    const finalPaid = newSale.type === 'cash' ? newSale.total : (Number(newSale.paid) || 0);
    if (newSale.cashBoxId && finalPaid > 0) {
      const box = updatedCashBoxes.find((b: any) => b.id === newSale.cashBoxId);
      const desc = newSale.type === 'credit'
        ? `قبض من فاتورة بيع #${newSale.invoiceNo}`
        : `فاتورة بيع #${newSale.invoiceNo}`;
      updatedCashMovements = [...updatedCashMovements, {
        id: gid(), cashBoxId: newSale.cashBoxId, type: 'deposit',
        amount: finalPaid, description: desc,
        referenceType: 'sale', referenceId: newSale.id, createdAt: newSale.createdAt
      }];
      if (box) {
        updatedCashBoxes = updatedCashBoxes.map((b: any) =>
          b.id === newSale.cashBoxId ? { ...b, balance: b.balance + finalPaid } : b
        );
      }
    }

    return {
      sales: updatedSales,
      products: updatedProducts,
      customers: updatedCustomers,
      cashMovements: updatedCashMovements,
      cashBoxes: updatedCashBoxes,
    };
  }),

  deleteSale: (id: string) => get()._del('sales', id),
  restoreSale: (id: string) => get()._restore('sales', id),
  permanentDeleteSale: (id: string) => get()._permDel('sales', id),  // ========== المشتريات (Purchases) ==========
  addPurchase: (purchase: any) => set((s: any) => {
    const np = { ...purchase, id: gid(), invoiceNo: s.purchases.length + 1 };
    const up: any = { purchases: [...s.purchases, np] };
    const updatedProducts = [...s.products];

    purchase.items.forEach((item: any) => {
      const idx = updatedProducts.findIndex((p: any) => p.id === item.productId);
      const addQty = item.unit === 'كرتون' && item.boxQty ? item.quantity * item.boxQty : item.quantity;
      const ppu = item.unit === 'كرتون' && item.boxQty ? item.unitPrice / item.boxQty : item.unitPrice;
      const sellingPrice = item.sellingPrice ? +item.sellingPrice : (idx >= 0 ? updatedProducts[idx].sellingPrice || 0 : 0);
      const minStock = item.minStock ? +item.minStock : (idx >= 0 ? updatedProducts[idx].minStock || 20 : 20);

      if (idx >= 0) {
        updatedProducts[idx] = { ...updatedProducts[idx], stockQuantity: updatedProducts[idx].stockQuantity + addQty, purchasePrice: ppu, lastPurchasePrice: ppu, sellingPrice: sellingPrice || updatedProducts[idx].sellingPrice || 0, minStock, updatedAt: now() };
      } else {
        updatedProducts.push({ id: item.productId || gid(), name: item.productName, barcode: item.barcode || '', stockQuantity: addQty, boxQty: item.boxQty || 1, unit: item.unit || 'حبة', purchasePrice: ppu, lastPurchasePrice: ppu, sellingPrice, minStock, openingStock: 0, createdAt: now(), updatedAt: now() });
      }
    });

    up.products = updatedProducts;
    if (purchase.supplierId && purchase.remaining > 0) {
      up.suppliers = s.suppliers.map((sup: any) => sup.id === purchase.supplierId ? { ...sup, balance: sup.balance + purchase.remaining, updatedAt: now() } : sup);
    }
    const finalPaid = Number(purchase.paid) || 0;
    if (purchase.cashBoxId && finalPaid > 0) {
      const box = s.cashBoxes.find((b: any) => b.id === purchase.cashBoxId);
      const desc = purchase.remaining > 0 ? `دفع من فاتورة شراء #${np.invoiceNo}` : `فاتورة شراء #${np.invoiceNo}`;
      up.cashMovements = [...s.cashMovements, { id: gid(), cashBoxId: purchase.cashBoxId, type: 'withdraw', amount: finalPaid, description: desc, referenceType: 'purchase', referenceId: np.id, createdAt: now() }];
      if (box) up.cashBoxes = s.cashBoxes.map((b: any) => b.id === purchase.cashBoxId ? { ...b, balance: b.balance - finalPaid } : b);
    }
    return up;
  }),

  // دالة تعديل فاتورة شراء (جديدة - تمنع الخصم المزدوج)
  updatePurchase: (id: string, purchaseData: any) => set((s: any) => {
    const oldPurchase = s.purchases.find((x: any) => x.id === id);
    if (!oldPurchase) return s;

    // 1. التراجع عن تأثير الفاتورة القديمة (إعادة المخزون، رصيد المورد، والحركة المالية)
    let updatedProducts = s.products.map((p: any) => {
      const oldItem = oldPurchase.items.find((i: any) => i.productId === p.id);
      if (oldItem) {
        const oldQty = oldItem.unit === 'كرتون' && oldItem.boxQty ? oldItem.quantity * oldItem.boxQty : oldItem.quantity;
        return { ...p, stockQuantity: Math.max(0, p.stockQuantity - oldQty) };
      }
      return p;
    });

    let updatedSuppliers = s.suppliers;
    if (oldPurchase.supplierId && oldPurchase.remaining > 0) {
      updatedSuppliers = updatedSuppliers.map((sup: any) =>
        sup.id === oldPurchase.supplierId ? { ...sup, balance: sup.balance - oldPurchase.remaining } : sup
      );
    }

    // حذف الحركة المالية القديمة (إرجاع الأموال للصندوق)
    let updatedCashMovements = s.cashMovements.filter((m: any) =>
      !(m.referenceType === 'purchase' && m.referenceId === id)
    );
    let updatedCashBoxes = s.cashBoxes.map((b: any) => b);

    // 2. إنشاء الفاتورة الجديدة (نفس id والرقم)
    const newPurchase = {
      ...purchaseData,
      id: oldPurchase.id,
      invoiceNo: oldPurchase.invoiceNo,
      createdAt: oldPurchase.createdAt,
      updatedAt: now()
    };
    const updatedPurchases = s.purchases.map((x: any) => x.id === id ? newPurchase : x);

    // 3. تطبيق تأثير الفاتورة الجديدة (زيادة المخزون، رصيد المورد، الحركة المالية)
    newPurchase.items.forEach((item: any) => {
      const idx = updatedProducts.findIndex((p: any) => p.id === item.productId);
      const addQty = item.unit === 'كرتون' && item.boxQty ? item.quantity * item.boxQty : item.quantity;
      const ppu = item.unit === 'كرتون' && item.boxQty ? item.unitPrice / item.boxQty : item.unitPrice;
      const sellingPrice = item.sellingPrice ? +item.sellingPrice : (idx >= 0 ? updatedProducts[idx].sellingPrice || 0 : 0);
      const minStock = item.minStock ? +item.minStock : (idx >= 0 ? updatedProducts[idx].minStock || 20 : 20);

      if (idx >= 0) {
        updatedProducts[idx] = { ...updatedProducts[idx], stockQuantity: updatedProducts[idx].stockQuantity + addQty, purchasePrice: ppu, lastPurchasePrice: ppu, sellingPrice: sellingPrice || updatedProducts[idx].sellingPrice || 0, minStock, updatedAt: now() };
      } else {
        updatedProducts.push({ id: item.productId || gid(), name: item.productName, barcode: item.barcode || '', stockQuantity: addQty, boxQty: item.boxQty || 1, unit: item.unit || 'حبة', purchasePrice: ppu, lastPurchasePrice: ppu, sellingPrice, minStock, openingStock: 0, createdAt: now(), updatedAt: now() });
      }
    });

    if (newPurchase.supplierId && newPurchase.remaining > 0) {
      updatedSuppliers = updatedSuppliers.map((sup: any) =>
        sup.id === newPurchase.supplierId ? { ...sup, balance: sup.balance + newPurchase.remaining, updatedAt: now() } : sup
      );
    }

    const finalPaid = Number(newPurchase.paid) || 0;
    if (newPurchase.cashBoxId && finalPaid > 0) {
      const box = updatedCashBoxes.find((b: any) => b.id === newPurchase.cashBoxId);
      const desc = newPurchase.remaining > 0 ? `دفع من فاتورة شراء #${newPurchase.invoiceNo}` : `فاتورة شراء #${newPurchase.invoiceNo}`;
      updatedCashMovements = [...updatedCashMovements, { id: gid(), cashBoxId: newPurchase.cashBoxId, type: 'withdraw', amount: finalPaid, description: desc, referenceType: 'purchase', referenceId: newPurchase.id, createdAt: now() }];
      if (box) updatedCashBoxes = updatedCashBoxes.map((b: any) => b.id === newPurchase.cashBoxId ? { ...b, balance: b.balance - finalPaid } : b);
    }

    return {
      purchases: updatedPurchases,
      products: updatedProducts,
      suppliers: updatedSuppliers,
      cashMovements: updatedCashMovements,
      cashBoxes: updatedCashBoxes,
    };
  }),

  deletePurchase: (id: string) => get()._del('purchases', id),
  restorePurchase: (id: string) => get()._restore('purchases', id),
  permanentDeletePurchase: (id: string) => get()._permDel('purchases', id),

  // ========== المصروفات (Expenses) ==========
  addExpense: (e: any) => set((s: any) => {
    const ne = { ...e, id: gid() };
    const box = s.cashBoxes.find((b: any) => b.id === e.cashBoxId);
    const up: any = { expenses: [...s.expenses, ne], cashMovements: [...s.cashMovements, { id: gid(), cashBoxId: e.cashBoxId, type: 'withdraw', amount: e.amount, description: `مصروف: ${e.title}`, referenceType: 'expense', referenceId: ne.id, createdAt: now() }] };
    if (box) up.cashBoxes = s.cashBoxes.map((b: any) => b.id === e.cashBoxId ? { ...b, balance: b.balance - e.amount } : b);
    return up;
  }),
  updateExpense: (id: string, d: any) => set((s: any) => ({ expenses: s.expenses.map((e: any) => e.id === id ? { ...e, ...d } : e) })),
  deleteExpense: (id: string) => get()._del('expenses', id),
  restoreExpense: (id: string) => get()._restore('expenses', id),
  permanentDeleteExpense: (id: string) => get()._permDel('expenses', id),

  // ========== دوال التقارير والمساعدات ==========
  getCustomerBalance: (id: string) => get().customers.find((c: any) => c.id === id)?.balance ?? 0,
  getSupplierBalance: (id: string) => get().suppliers.find((s: any) => s.id === id)?.balance ?? 0,
  getCashBoxBalance: (id: string) => get().cashBoxes.find((b: any) => b.id === id)?.balance ?? 0,

  getTodaySales: () => {
    const td = today();
    const ts = get().sales.filter((s: any) => s.createdAt.startsWith(td));
    let cash = 0, credit = 0;
    ts.forEach((s: any) => { cash += s.paid || 0; credit += s.remaining || 0; });
    return { cash, credit };
  },
  getTodayPurchases: () => {
    const td = today();
    const tp = get().purchases.filter((p: any) => p.createdAt.startsWith(td));
    let cash = 0, credit = 0;
    tp.forEach((p: any) => { cash += p.paid || 0; credit += p.remaining || 0; });
    return { cash, credit };
  },
  getTotalProfit: () => {
    return get().sales.reduce((a: number, s: any) => a + s.items.reduce((b: number, i: any) => b + (i.total - (i.cost || i.total)), 0), 0) - get().expenses.reduce((a: number, e: any) => a + e.amount, 0);
  },
  getTotalExpenses: () => get().expenses.reduce((a: number, e: any) => a + e.amount, 0),
}), { name: 'grocery-store' }));
