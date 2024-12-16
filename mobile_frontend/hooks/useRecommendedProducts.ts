import {CartProduct, Category, Product} from "../types/models"
export function useRecommendedProducts(categories: Category[], cart: CartProduct[], length: number = 12): Product[] {

  const recommendedProducts: Product[] = cart
    .map(cartItem => cartItem.product)
    .filter(product => product.tags?.some(tag => tag.name === 'Popular'));
  if (recommendedProducts.length < length) {
    const allProducts = categories.flatMap(category =>
      category.subCategories?.flatMap(subCategory => subCategory.products) || []
    );
    while (recommendedProducts.length < length && allProducts.length > 0) {
      const randomProduct = allProducts[Math.floor(Math.random() * allProducts.length)];
      if (randomProduct && !recommendedProducts.includes(randomProduct)) {
        if (!recommendedProducts.some(product => product.id === randomProduct.id)) {
          recommendedProducts.push(randomProduct);
        }
      }
    }
  }

  return recommendedProducts.slice(0, length);
}
