'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/server';

export default function ArtisanPayment() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) console.error('Get user error:', error);
      setUser(user);
    };
    getUser();
  }, []);

  const handlePayment = async () => {
    if (!user) return;

    setLoading(true);

    // Simulate a payment delay
    setTimeout(async () => {
      // 1️⃣ Attempt to update an existing row
      const { data: updatedRows, error: updateError } = await supabase
        .from('artifacts')
        .update({ payment_status: true })
        .eq('artisan_id', user.id)
        .select();

      if (updateError) {
        console.error('Update error:', updateError);
        setLoading(false);
        return;
      }

      // 2️⃣ If no row existed, insert a new one
      if (!updatedRows || updatedRows.length === 0) {
        const { error: insertError } = await supabase
          .from('artifacts')
          .insert({
            artisan_id: user.id,
            payment_status: true,
            // add any other required columns here with default values
          });

        if (insertError) {
          console.error('Insert error:', insertError);
          setLoading(false);
          return;
        }
      }

      // 3️⃣ Show success UI and redirect
      setPaymentSuccess(true);
      setTimeout(() => router.push('/ArtisanProductForm'), 2000);
      setLoading(false);
    }, 2000);
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Payment Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Your product listing payment has been processed successfully.
          </p>
          <p className="text-blue-500 animate-pulse">
            Redirecting to product form...
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 p-6">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Product Listing Payment</h1>
            <p className="text-gray-600">Pay once to list your products on our tour promotion map</p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Listing Fee</span>
              <span className="text-2xl font-bold text-purple-700">₹2,000</span>
            </div>
            <div className="text-sm text-gray-500">
              <p>✓ One-time payment</p>
              <p>✓ List multiple products</p>
              <p>✓ Featured on our map</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Secure Payment</h3>
                <p className="text-sm text-gray-600">All transactions are secure and encrypted</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Trusted by Artisans</h3>
                <p className="text-sm text-gray-600">Join hundreds of successful sellers</p>
              </div>
            </div>
          </div>
          
          <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full mt-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </div>
        ) : (
          'Pay ₹2,000 (Demo)'
        )}
      </button>
          
          <p className="text-center text-gray-500 text-sm mt-4">
            This is a demo payment. No real transaction will occur.
          </p>
        </div>
        
        <div className="bg-gray-50 p-4 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Artisan Marketplace. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}