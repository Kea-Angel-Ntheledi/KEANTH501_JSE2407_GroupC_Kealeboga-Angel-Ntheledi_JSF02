// File: components/ProductsList.js
"use client"
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductCard from './ProductCard';

const PRODUCTS_PER_PAGE = 20;

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    fetchProducts();
  }, [page]);

  async function fetchProducts() {
    setLoading(true);
    try {
      console.log(`Fetching products for page ${page}`);
      const res = await fetch(`https://next-ecommerce-api.vercel.app/products?limit=${PRODUCTS_PER_PAGE}&skip=${(page - 1) * PRODUCTS_PER_PAGE}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      console.log('API response:', data);
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid data structure received from API');
      }
      
      setProducts(data);
      console.log(`Set ${data.length} products`);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(`An error occurred while fetching products: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  const handlePageChange = (newPage) => {
    router.push(`/?page=${newPage}`);
  };

  console.log('Rendering ProductsList. Products:', products);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-10">No products found.</div>
        )}
      </div>
      <div className="flex justify-center items-center space-x-4 mt-8">
        <button 
          onClick={() => handlePageChange(page - 1)} 
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Previous Page
        </button>
        <span>Page {page}</span>
        <button 
          onClick={() => handlePageChange(page + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Next Page
        </button>
      </div>
    </div>
  );
}