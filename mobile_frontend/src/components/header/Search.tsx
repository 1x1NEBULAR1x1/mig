import { useUIStore } from "../../../stores/useUIStore.ts";
import { useDataStore } from "../../../stores/useDataStore.ts";
import { useEffect, useState, useCallback } from "react";
import { Product } from "../../../types/models.ts";
import { url } from "../../../requests/load_data.ts";
import { debounce } from "lodash";
import classes from "./Header.module.css";

const Search = () => {
  const uiStore = useUIStore((state) => state);
  const dataStore = useDataStore((state) => state);

  const selectProduct = (product: Product) => {
    uiStore.setSelectedProduct({ product: product, amount: 1 });
  };

  const [result, setResult] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    if (dataStore.categories) {
      const allProducts: Product[] = [];
      dataStore.categories.forEach((category) => {
        category.subCategories?.forEach((subCategory) => {
          if (subCategory.products) {
            allProducts.push(...subCategory.products.filter((p) => p !== undefined));
          }
        });
      });
      setProducts(allProducts);
    }
  }, [dataStore.categories]);
  const handleSearch = useCallback(
    debounce((value: string) => {
      if (value) {
        const filtered = products.filter((product) =>
          product.name.toLowerCase().includes(value.toLowerCase())
        );
        setResult(filtered);
      } else {
        setResult(products);
      }
    }, 300),
    [products]
  );

  // Слушаем изменения в поисковом запросе
  useEffect(() => {
    if (uiStore.searchValue !== undefined) {
      // Мгновенный фильтр при первом вводе
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(uiStore.searchValue?.toLowerCase() || '')
      );
      setResult(filtered);

      // Запуск дебаунса для последующих изменений
      handleSearch(uiStore.searchValue);
    } else {
      setResult(products);
    }
  }, [uiStore.searchValue, products, handleSearch]);

  return (
    <div className={classes.searchMenuOverlay}
      onClick={() => uiStore.setSearchValue('')}
    >
      <div
        className={classes.searchMenu}
        onClick={(e) => e.stopPropagation()}
      >
        {result.map((p, index) => (
          <div key={`product-${p.name}`} className="flex-col w-full h-auto cursor-pointer">
            <div
              className={classes.searchProduct}
              onClick={() => selectProduct(p)}
            >
              <div className={classes.searchProductImage}>
                <img
                  className="h-full object-cover"
                  src={url + p.imagePath}
                  alt={p.name}
                  width="auto"
                />
              </div>
              <p className={classes.searchProductName}>
                {p.name}
              </p>
            </div>
            {index !== result.length - 1 && <hr className="w-full h-[1px] bg-gray-300" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
