'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from "@supabase/supabase-js";
import Link from 'next/link';

interface Artifact {
  name: string;
  images: string[];
  landmark: string;
  latitude: number;
  longitude: number;
  artifacts: Product[];
}

interface Product {
  name: string;
  price: string;
  images: string[];
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ArtifactProductList() {
  const [user, setUser] = useState<any>(null);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUserAndArtifacts = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data, error } = await supabase
          .from('artifacts')
          .select('*')
          .eq('artisan_id', user.id)
          .single();

        if (data && data.products) {
          setArtifacts(data.products);
        }
      }
      setLoading(false);
    };

    getUserAndArtifacts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Your Products</h1>
          <div className="space-x-4">
            <Link
              href="/ArtisanProductForm"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              Add Shop & Artifacts
            </Link>
          </div>
        </div>

        {artifacts.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">No Products Listed</h2>
              <p className="text-gray-600 mb-6">
                Pay the listing fee to showcase your products on our tour promotion map
              </p>
              <button
                onClick={() => router.push('/ArtisanPayment')}
                className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-green-600 hover:to-blue-700 transition-all"
              >
                Pay Listing Fee
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {artifacts.map((artifact, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img
                  src={artifact.images[0]}
                  alt={artifact.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{artifact.name}</h3>
                  <p className="text-purple-600 mb-4">{artifact.landmark}</p>
                  
                  <div className="space-y-4">
                    {artifact.artifacts.map((product, productIndex) => (
                      <div key={productIndex} className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div>
                          <h4 className="font-medium text-gray-800">{product.name}</h4>
                          <p className="text-green-600 font-semibold">{product.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}