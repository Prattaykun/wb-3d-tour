"use client";

import { useState } from "react";

export default function StorePage() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const products = [
    {
      id: 1,
      name: "Shantiniketan Leather Bag",
      vendor: "Artisans of Bolpur",
      place: "Shantiniketan",
      price: "₹1,200",
      category: "Handicrafts",
      rating: 4.7,
      description:
        "Handmade leather bag crafted by artisans of Bolpur, Shantiniketan. Known for durability and unique artistic designs.",
      image: "https://res.cloudinary.com/demo/image/upload/leatherbag.jpg",
      qr: "https://res.cloudinary.com/demo/image/upload/sample_qr.png",
    },
    {
      id: 2,
      name: "Kantha Embroidery Saree",
      vendor: "Women Co-op",
      place: "Birbhum",
      price: "₹2,500",
      category: "Textiles",
      rating: 4.8,
      description:
        "Traditional Kantha embroidery saree showcasing the intricate hand-stitching art of rural Bengal.",
      image: "https://res.cloudinary.com/demo/image/upload/kantha.jpg",
      qr: "https://res.cloudinary.com/demo/image/upload/sample_qr.png",
    },
    {
      id: 3,
      name: "Terracotta Horse",
      vendor: "Village Craftsmen",
      place: "Bishnupur",
      price: "₹800",
      category: "Clay Art",
      rating: 4.5,
      description:
        "The famous terracotta horse of Bankura, symbolizing Bengal's folk culture and temple artistry.",
      image: "https://res.cloudinary.com/demo/image/upload/terracotta.jpg",
      qr: "https://res.cloudinary.com/demo/image/upload/sample_qr.png",
    },
    {
      id: 4,
      name: "Baluchari Silk Saree",
      vendor: "Silk Weavers",
      place: "Murshidabad",
      price: "₹6,500",
      category: "Silk Weaving",
      rating: 4.9,
      description:
        "Exquisite Baluchari silk saree depicting mythological scenes woven in intricate designs.",
      image: "https://res.cloudinary.com/demo/image/upload/baluchari.jpg",
      qr: "https://res.cloudinary.com/demo/image/upload/sample_qr.png",
    },
    {
      id: 5,
      name: "Rasgulla (Sweets Box)",
      vendor: "Local Sweet Shop",
      place: "Kolkata",
      price: "₹500",
      category: "Sweets",
      rating: 4.6,
      description:
        "Authentic Kolkata Rasgulla, soft and spongy, packed with sweetness of Bengal.",
      image: "https://res.cloudinary.com/demo/image/upload/rasgulla.jpg",
      qr: "https://res.cloudinary.com/demo/image/upload/sample_qr.png",
    },
    {
      id: 6,
      name: "Dokra Metal Craft",
      vendor: "Tribal Artisans",
      place: "Bankura",
      price: "₹1,800",
      category: "Metal Art",
      rating: 4.7,
      description:
        "Traditional Dokra craft made of non–ferrous metal casting using the lost-wax technique.",
      image: "https://res.cloudinary.com/demo/image/upload/dokra.jpg",
      qr: "https://res.cloudinary.com/demo/image/upload/sample_qr.png",
    },
    {
      id: 7,
      name: "Santali Bamboo Craft",
      vendor: "Tribal Co-op",
      place: "Purulia",
      price: "₹650",
      category: "Bamboo Craft",
      rating: 4.4,
      description:
        "Eco-friendly handmade bamboo baskets and decorative items crafted by Santali tribes.",
      image: "https://res.cloudinary.com/demo/image/upload/bamboo.jpg",
      qr: "https://res.cloudinary.com/demo/image/upload/sample_qr.png",
    },
    {
      id: 8,
      name: "Handmade Jute Bag",
      vendor: "Women SHG",
      place: "Howrah",
      price: "₹400",
      category: "Eco-friendly",
      rating: 4.3,
      description:
        "Eco-friendly and stylish jute bags made by women’s self-help groups in Howrah.",
      image: "https://res.cloudinary.com/demo/image/upload/jutebag.jpg",
      qr: "https://res.cloudinary.com/demo/image/upload/sample_qr.png",
    },
    
  ];

const reviews = [
    {
      id: 1,
      name: "Priya Sharma",
      location: "Kolkata, India",
      rating: 5,
      comment:
        "The Kantha saree I bought was absolutely beautiful! The embroidery is so detailed and unique.",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      id: 2,
      name: "Arjun Das",
      location: "Bangalore, India",
      rating: 4,
      comment:
        "Ordered terracotta horses for decor. The packaging was safe and quality is authentic.",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    },
    {
      id: 3,
      name: "Sneha Mukherjee",
      location: "Delhi, India",
      rating: 5,
      comment:
        "Loved the Shantiniketan leather bag! It’s sturdy and stylish, exactly what I was looking for.",
      avatar: "https://randomuser.me/api/portraits/women/43.jpg",
    },
    {
      id: 4,
      name: "Rohit Roy",
      location: "Mumbai, India",
      rating: 4,
      comment:
        "The Rasgullas were fresh and delicious. It really felt like a taste of Bengal in Mumbai.",
      avatar: "https://randomuser.me/api/portraits/men/31.jpg",
    },
    {
      id: 5,
      name: "Emily Carter",
      location: "London, UK",
      rating: 5,
      comment:
        "I was amazed by the craftsmanship of the Dokra jewelry. It’s a true conversation starter at parties here!",
      avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    },
    {
      id: 6,
      name: "James Wilson",
      location: "New York, USA",
      rating: 5,
      comment:
        "The handloom dhurrie I ordered is top-notch quality. Adds so much charm to my living room!",
      avatar: "https://randomuser.me/api/portraits/men/44.jpg",
    },
    {
      id: 7,
      name: "Aiko Tanaka",
      location: "Tokyo, Japan",
      rating: 4,
      comment:
        "The Baluchari silk scarf is gorgeous and elegant. I’ll definitely recommend Bengal handicrafts to my friends.",
      avatar: "https://randomuser.me/api/portraits/women/50.jpg",
    },
    {
      id: 8,
      name: "Lucas Martin",
      location: "Paris, France",
      rating: 5,
      comment:
        "Absolutely loved the terracotta art piece! Reminds me of Indian heritage in my French apartment.",
      avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    },
  ];


  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-100 p-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 drop-shadow-lg">
          🛍️ West Bengal Local Stores
        </h1>
        <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
          Support local artisans, craftsmen, and cultural vendors of West Bengal.  
          Discover heritage products that carry stories of our tradition.
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:scale-105"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
              <p className="text-sm text-gray-600 mb-1">
                {product.vendor} • {product.place}
              </p>
              <p className="text-sm text-indigo-500 font-semibold">
                {product.category}
              </p>
              <p className="mt-2 text-gray-700 text-sm line-clamp-3">
                {product.description}
              </p>
              <div className="mt-3 flex justify-between items-center">
                <span className="font-semibold text-indigo-600">
                  {product.price}
                </span>
                <span className="text-yellow-500 font-medium">
                  ⭐ {product.rating}
                </span>
              </div>
              <button
                className="mt-4 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
                onClick={() => setSelectedProduct(product)}
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => setSelectedProduct(null)}
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">
              Buy {selectedProduct.name}
            </h2>
            <p className="text-gray-700 mb-2">{selectedProduct.description}</p>
            <p className="font-semibold text-gray-900 mb-4">
              Price: {selectedProduct.price}
            </p>

            <h3 className="font-semibold mb-2">Select Payment Method:</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="radio" name="payment" defaultChecked /> <span>UPI</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="payment" /> <span>Credit/Debit Card</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="payment" /> <span>Cash on Delivery</span>
              </label>
            </div>

            {/* QR Code */}
            <div className="mt-6 text-center">
              <p className="text-gray-700 mb-2">Scan to Pay (UPI):</p>
              <img
                src={selectedProduct.qr}
                alt="QR Code"
                className="w-40 h-40 mx-auto border p-2 rounded-lg"
              />
            </div>

            <button
              className="mt-6 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
              onClick={() => alert("Payment process initiated!")}
            >
              Confirm Purchase
            </button>
          </div>
        </div>
      )}

      {/* Customer Reviews Section */}
      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
            >
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-12 h-12 rounded-full border object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">{review.name}</p>
                  <p className="text-sm text-gray-500">{review.location}</p>
                </div>
              </div>
              <p className="text-gray-700 italic">“{review.comment}”</p>
              <div className="mt-3">
                <span className="text-yellow-500 font-medium">
                  ⭐ {review.rating}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}