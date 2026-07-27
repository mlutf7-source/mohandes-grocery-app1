export interface Product {
    id: string;
      name: string;
        barcode: string;
          quantity: number;
            unit: string;
              purchasePrice: number;
                sellingPrice: number;
                  createdAt: string;
                    updatedAt: string;
                    }

                    export interface Customer {
                      id: string;
                        name: string;
                          phone: string;
                            address: string;
                              notes: string;
                                balance: number;
                                  createdAt: string;
                                    updatedAt: string;
                                    }

                                    export interface Supplier {
                                      id: string;
                                        name: string;
                                          phone: string;
                                            address: string;
                                              notes: string;
                                                balance: number;
                                                  createdAt: string;
                                                    updatedAt: string;
                                                    }

                                                    export interface CashBox {
                                                      id: string;
                                                        name: string;
                                                          balance: number;
                                                            createdAt: string;
                                                              updatedAt: string;
                                                              }

                                                              export interface CashMovement {
                                                                id: string;
                                                                  cashBoxId: string;
                                                                    type: 'deposit' | 'withdraw';
                                                                      amount: number;
                                                                        description: string;
                                                                          referenceType: 'sale' | 'purchase' | 'expense' | 'manual';
                                                                            referenceId: string;
                                                                              createdAt: string;
                                                                              }

                                                                              export interface SaleItem {
                                                                                productId: string;
                                                                                  productName: string;
                                                                                    barcode: string;
                                                                                      quantity: number;
                                                                                        unitPrice: number;
                                                                                          total: number;
                                                                                          }

                                                                                          export interface Sale {
                                                                                            id: string;
                                                                                              type: 'cash' | 'credit';
                                                                                                customerId: string | null;
                                                                                                  cashBoxId: string | null;
                                                                                                    items: SaleItem[];
                                                                                                      total: number;
                                                                                                        paid: number;
                                                                                                          remaining: number;
                                                                                                            createdAt: string;
                                                                                                            }

                                                                                                            export interface PurchaseItem {
                                                                                                              productId: string;
                                                                                                                productName: string;
                                                                                                                  barcode: string;
                                                                                                                    quantity: number;
                                                                                                                      unitPrice: number;
                                                                                                                        total: number;
                                                                                                                        }

                                                                                                                        export interface Purchase {
                                                                                                                          id: string;
                                                                                                                            supplierId: string | null;
                                                                                                                              cashBoxId: string | null;
                                                                                                                                items: PurchaseItem[];
                                                                                                                                  total: number;
                                                                                                                                    paid: number;
                                                                                                                                      remaining: number;
                                                                                                                                        createdAt: string;
                                                                                                                                        }

                                                                                                                                        export interface Expense {
                                                                                                                                          id: string;
                                                                                                                                            title: string;
                                                                                                                                              amount: number;
                                                                                                                                                cashBoxId: string;
                                                                                                                                                  date: string;
                                                                                                                                                    notes: string;
                                                                                                                                                      createdAt: string;
                                                                                                                                                      }

                                                                                                                                                      export interface AppState {
                                                                                                                                                        products: Product[];
                                                                                                                                                          customers: Customer[];
                                                                                                                                                            suppliers: Supplier[];
                                                                                                                                                              cashBoxes: CashBox[];
                                                                                                                                                                cashMovements: CashMovement[];
                                                                                                                                                                  sales: Sale[];
                                                                                                                                                                    purchases: Purchase[];
                                                                                                                                                                      expenses: Expense[];
                                                                                                                                                                      }
