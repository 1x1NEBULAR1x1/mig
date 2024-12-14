import { useUIStore } from "../../../stores/useUIStore.ts";
import { useDataStore } from "../../../stores/useDataStore.ts";
import { useEffect, useState, useCallback } from "react";
import { Product } from "../../../types/models.ts";
import { url } from "../../../requests/load_data.ts";
import { debounce } from "lodash";

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
    <div
      style={{
        display: "flex",
        maxWidth: "44vw",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "1.66667vh 1.0416667vw",
        gap: "1vh",
        position: "absolute",
        width: "44vw",
        height: "auto",
        left: "28vw",
        top: "8vh",
        background: "#FFFFFF",
        boxShadow: "4px 4px 42px rgba(156, 143, 132, 0.4)",
        borderRadius: "1.25vw",
        zIndex: "1",
        margin: 0,
      }}
    >
      {result.map((p, index) => (
        <div key={`product-${p.name}`} className="flex-col w-full h-auto cursor-pointer">
          <div
            className="text-sm text-[#56585F] flex flex-row items-center gap-[1vh] w-full h-auto"
            onClick={() => selectProduct(p)}
          >
            <div className="w-8 h-8 rounded-xl mr-2 object-contain flex justify-center items-center">
              <img
                className="h-full object-cover"
                src={url + p.imagePath}
                alt={p.name}
                width="auto"
              />
            </div>
            <p className="text-sm text-[#56585F] h-full flex items-center justify-center font-bold">
              {p.name}
            </p>
          </div>
          {index !== result.length - 1 && <hr className="w-full h-[1px] bg-gray-300" />}
        </div>
      ))}
    </div>
  );
};

export default Search;
