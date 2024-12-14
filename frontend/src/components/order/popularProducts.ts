import { useDataStore } from '../../../stores/useDataStore.ts';
import { type Product } from "../../../types/models.ts";

export function useRecommendedProducts() {

  const cart = useDataStore((state) => state.cart);

  const categories = useDataStore((state) => state.categories);

  const recommendedProducts: Product[] = cart
    .map(cartItem => cartItem.product)
    .filter(product => product.tags?.some(tag => tag.name === 'Popular'));
  if (recommendedProducts.length < 4) {
    const allProducts = categories.flatMap(category =>
      category.subCategories?.flatMap(subCategory => subCategory.products) || []
    );
    while (recommendedProducts.length < 4 && allProducts.length > 0) {
      const randomProduct = allProducts[Math.floor(Math.random() * allProducts.length)];
      if (randomProduct && !recommendedProducts.includes(randomProduct)) {
        if (!recommendedProducts.some(product => product.id === randomProduct.id)) {
          recommendedProducts.push(randomProduct);
        }
      }
    }
  }

  return recommendedProducts.slice(0, 4);
}
