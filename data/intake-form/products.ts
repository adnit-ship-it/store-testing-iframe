import type { Product, ProductCategory } from "~/types/intake-form/checkout";
import productsData from "./productsList.json";

/**
 * Sorts products by their order field (ascending).
 * Products without an order value will be placed at the end.
 * @param products Array of products to sort
 * @returns Sorted array of products
 */
export function sortProductsByOrder(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
    return orderA - orderB;
  });
}

// Export sorted products array
export const products: Product[] = sortProductsByOrder(productsData);

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getPopularProducts(): Product[] {
  return sortProductsByOrder(products.filter((product) => product.popular));
}

export const categoryLabels: Record<ProductCategory, string> = {
  "weight-loss": "Weight Loss",
  "sexual health": "Sexual Health",
  "wellness": "Wellness",
  "hair": "Hair",
  "skin": "Skin"
};

// Get available categories from products
export function getAvailableCategories(): ProductCategory[] {
  const categories = new Set<ProductCategory>();
  products.forEach((product) => {
    if (product.category && isValidCategory(product.category)) {
      categories.add(product.category);
    }
  });
  return Array.from(categories);
}

// Helper function to check if a category is valid
function isValidCategory(cat: string): cat is ProductCategory {
  return ['weight-loss', 'sexual health', 'wellness', 'hair', 'skin'].includes(cat);
}

