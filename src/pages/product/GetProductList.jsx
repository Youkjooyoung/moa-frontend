import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import httpClient from '../../api/httpClient';
import { useAuthStore } from '../../store/authStore';

const GetProductList = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await httpClient.get('/product');
        if (response.success) {
          setProducts(response.data || []);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">구독 상품 목록</h1>
        {user?.role === 'ADMIN' && (
          <button
            onClick={() => navigate('/products/add')}
            className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            상품 등록
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          등록된 구독 상품이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div
              key={product.productId}
              onClick={() => navigate(`/products/${product.productId}`)}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="aspect-video bg-gray-100 relative">
                {product.image ? (
                  <img src={product.image} alt={product.productName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
                {product.categoryName && (
                  <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    {product.categoryName}
                  </span>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2 text-gray-900">{product.productName}</h3>
                <p className="text-brand-600 font-bold text-xl">
                  {product.price?.toLocaleString()}원
                  <span className="text-sm text-gray-500 font-normal ml-1">/월</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GetProductList;
