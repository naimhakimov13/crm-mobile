import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "./types";
import { PRODUCTS_SEED } from "./mock";

type ProductsContextValue = {
  products: Product[];
  saveProduct: (product: Product) => void;
};

const ProductsContext = createContext<ProductsContextValue | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() =>
    PRODUCTS_SEED.map((p) => ({ ...p }))
  );

  const value = useMemo<ProductsContextValue>(
    () => ({
      products,
      saveProduct: (product) => {
        setProducts((prev) => {
          const i = prev.findIndex((x) => x.id === product.id);
          if (i >= 0) {
            const next = [...prev];
            next[i] = product;
            return next;
          }
          return [...prev, product];
        });
      },
    }),
    [products]
  );

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) {
    throw new Error("useProducts must be used within ProductsProvider");
  }
  return ctx;
}
