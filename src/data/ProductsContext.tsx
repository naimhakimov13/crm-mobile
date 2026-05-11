import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Currency, Product } from "./types";
import { PRODUCTS_SEED } from "./mock";

export type ProductFilters = {
  minPrice: number | null;
  maxPrice: number | null;
  stockStatus: "all" | "in" | "low" | "out";
  currency: Currency | "all";
  unit: Product["unit"] | "all";
};

export const DEFAULT_FILTERS: ProductFilters = {
  minPrice: null,
  maxPrice: null,
  stockStatus: "all",
  currency: "all",
  unit: "all",
};

export function activeFilterCount(f: ProductFilters): number {
  let n = 0;
  if (f.minPrice !== null) n++;
  if (f.maxPrice !== null) n++;
  if (f.stockStatus !== "all") n++;
  if (f.currency !== "all") n++;
  if (f.unit !== "all") n++;
  return n;
}

type ProductsContextValue = {
  products: Product[];
  saveProduct: (product: Product) => void;
  filters: ProductFilters;
  setFilters: (f: ProductFilters) => void;
  resetFilters: () => void;
};

const ProductsContext = createContext<ProductsContextValue | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() =>
    PRODUCTS_SEED.map((p) => ({ ...p }))
  );
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);

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
      filters,
      setFilters,
      resetFilters: () => setFilters(DEFAULT_FILTERS),
    }),
    [products, filters]
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
