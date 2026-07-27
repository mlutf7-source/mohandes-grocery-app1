interface ProductInfo {
          name: string;
            barcode: string;
              brand?: string;
                image?: string;
                  quantity?: string;
                    category?: string;
                    }

                    export async function lookupBarcode(barcode: string): Promise<ProductInfo | null> {
                      try {
                          // Open Food Facts
                              const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`);
                                  
                                      if (!response.ok) {
                                            console.log('Open Food Facts response not ok:', response.status);
                                                  return null;
                                                      }

                                                          const data = await response.json();
                                                              console.log('Open Food Facts data:', data);

                                                                  if (data.status === 1 && data.product) {
                                                                        const p = data.product;
                                                                              const result = {
                                                                                      name: p.product_name_ar || p.product_name || p.generic_name || '',
                                                                                              barcode: barcode,
                                                                                                      brand: p.brands || '',
                                                                                                              image: p.image_url || p.image_small_url || '',
                                                                                                                      quantity: p.quantity || '',
                                                                                                                              category: p.categories_tags?.[0]?.replace('en:', '') || '',
                                                                                                                                    };
                                                                                                                                          console.log('Found product:', result);
                                                                                                                                                return result;
                                                                                                                                                    }
                                                                                                                                                        
                                                                                                                                                            console.log('Product not found in Open Food Facts');
                                                                                                                                                                return null;
                                                                                                                                                                  } catch (err) {
                                                                                                                                                                      console.error('lookupBarcode error:', err);
                                                                                                                                                                          return null;
                                                                                                                                                                            }
                                                                                                                                                                            }
