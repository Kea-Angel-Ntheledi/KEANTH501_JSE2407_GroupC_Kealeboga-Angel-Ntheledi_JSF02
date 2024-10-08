import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductGallery from '../../../components/ProductGallery';
import ReviewsList from '../../../components/ReviewsList';

async function getProduct(id) {
  const res = await fetch(`https://next-ecommerce-api.vercel.app/products/${id}`);
  
  if (!res.ok) {
    throw new Error('Failed to fetch product');
  }
 
  return res.json();
}

export default async function ProductPage({ params }) {
  try {
    const product = await getProduct(params.id);

    return (
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">&larr; Back to Products</Link>
        <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProductGallery images={product.images} />
          <div>
            <p className="text-2xl font-semibold mb-4">${product.price.toFixed(2)}</p>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-sm text-gray-500 mb-2">Category: {product.category}</p>
            <p className="text-sm text-gray-500 mb-2">Tags: {product.tags.join(', ')}</p>
            <div className="flex items-center mb-2">
              <span className="text-yellow-400 mr-1">★</span>
              <span>{product.rating.toFixed(1)}</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Stock: {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
            </p>
          </div>
        </div>
        <ReviewsList reviews={product.reviews} />
      </div>
    );
  } catch (error) {
    notFound();
  }
}