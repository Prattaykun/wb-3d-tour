// app/map/ArtifactsNearby.tsx
import { useState } from 'react';
import QRCode from 'react-qr-code';

interface Artifact {
  name: string;
  price: string;
  images: string[];
}

interface Shop {
  artisan: any;
  name: string;
  images: string[];
  landmark: string;
  latitude: number;
  longitude: number;
  artifacts: Artifact[];
}

interface ArtisanData {
  artisan_id: string;
  full_name: string;
  email: string;
  phone: string;
  products: Shop[];
  created_at: string;
  updated_at: string;
}

interface ArtifactsNearbyProps {
  activePlace: any;
  distanceSetting: number;
  shops: ArtisanData[];
}

export default function ArtifactsNearby({ activePlace, distanceSetting, shops }: ArtifactsNearbyProps) {
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [selectedArtifact, setSelectedArtifact] = useState<{artifact: Artifact, shop: Shop} | null>(null);
  const [activeQR, setActiveQR] = useState<'phone' | 'email' | null>(null);

  const haversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Flatten all shops from all artisans and filter by distance
  const allShops = shops.flatMap(artisan => 
    artisan.products.map(shop => ({
      ...shop,
      artisan: {
        full_name: artisan.full_name,
        email: artisan.email,
        phone: artisan.phone
      }
    }))
  );

  const shopsInRange = allShops.filter(shop => 
    haversine(activePlace.lat, activePlace.lon, shop.latitude, shop.longitude) <= distanceSetting
  );

  // Auto-select the first shop if none is selected
  if (shopsInRange.length > 0 && !selectedShop) {
    setSelectedShop(shopsInRange[0]);
  }

  if (shopsInRange.length === 0) return null;

  return (
    <>
      <div className="mt-4">
        <h4 className="font-semibold text-gray-400">Artisan Shops Nearby</h4>
        <div className="flex overflow-x-auto gap-2 py-2">
          {shopsInRange.map((shop, index) => (
            <div 
              key={index} 
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 ${selectedShop?.name === shop.name ? 'border-blue-500' : 'border-gray-300'}`}
              onClick={() => setSelectedShop(shop)}
            >
              {shop.images && shop.images.length > 0 ? (
                <img 
                  src={shop.images[0]} 
                  alt={shop.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xs text-gray-500">No Image</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedShop && (
          <div className="mt-2">
            <h5 className="font-medium text-gray-400">{selectedShop.name}</h5>
            <p className="text-xs text-gray-400 mb-2">{selectedShop.landmark}</p>
            
            <div className="grid grid-cols-2 gap-2">
              {selectedShop.artifacts.map((artifact, idx) => (
                <div 
                  key={idx} 
                  className="border rounded p-2 cursor-pointer hover:bg-blue-50 transition"
                  onClick={() => setSelectedArtifact({artifact, shop: selectedShop})}
                >
                  {/* Added artifact image preview */}
                  {artifact.images && artifact.images.length > 0 ? (
                    <img 
                      src={artifact.images[0]} 
                      alt={artifact.name}
                      className="w-full h-24 object-cover rounded mb-2"
                    />
                  ) : (
                    <div className="w-full h-24 bg-gray-200 flex items-center justify-center rounded mb-2">
                      <span className="text-xs text-gray-500">No Image</span>
                    </div>
                  )}
                  <div className="font-medium text-sm text-gray-400">{artifact.name}</div>
                  <div className="text-xs text-gray-400">{artifact.price}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Artifact Detail Modal */}
      {selectedArtifact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-blue-400 via-purple-500 to-green-400 rounded-lg p-1 w-full max-w-md">
            <div className="bg-white rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">{selectedArtifact.artifact.name}</h3>
                <button 
                  onClick={() => {
                    setSelectedArtifact(null);
                    setActiveQR(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="flex flex-col items-center">
                {selectedArtifact.artifact.images && selectedArtifact.artifact.images.length > 0 ? (
                  <a 
                    href={selectedArtifact.artifact.images[0]} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <img 
                      src={selectedArtifact.artifact.images[0]} 
                      alt={selectedArtifact.artifact.name}
                      className="w-full h-48 object-cover rounded-lg mb-4 cursor-pointer"
                    />
                  </a>
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg mb-4">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
                
                {selectedArtifact.shop.images && selectedArtifact.shop.images.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-1">From {selectedArtifact.shop.name}</p>
                    <a 
                      href={selectedArtifact.shop.images[0]} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <img 
                        src={selectedArtifact.shop.images[0]} 
                        alt={selectedArtifact.shop.name}
                        className="w-32 h-32 object-cover rounded-lg mx-auto cursor-pointer"
                      />
                    </a>
                  </div>
                )}
                  <div className="flex justify-center gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-sm mb-1">Call Artisan</p>
                    <a 
                      href={`tel:${selectedArtifact.shop.artisan.phone}`}
                      className="inline-block bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      📞 Call
                    </a>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm mb-1">Email Artisan</p>
                    <a 
                      href={`mailto:${selectedArtifact.shop.artisan.email}`}
                      className="inline-block bg-green-500 text-white px-4 py-2 rounded"
                    >
                      ✉️ Email
                    </a>
                  </div>
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-sm mb-1">Call Artisan</p>
                    <button 
                      onClick={() => setActiveQR(activeQR === 'phone' ? null : 'phone')}
                      className="inline-block bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      {activeQR === 'phone' ? 'Hide QR' : '📞 Show QR'}
                    </button>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm mb-1">Email Artisan</p>
                    <button 
                      onClick={() => setActiveQR(activeQR === 'email' ? null : 'email')}
                      className="inline-block bg-green-500 text-white px-4 py-2 rounded"
                    >
                      {activeQR === 'email' ? 'Hide QR' : '✉️ Show QR'}
                    </button>
                  </div>
                </div>
                
                {/* QR Code Display */}
                {activeQR && (
                  <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                    <p className="text-center mb-2 font-medium">
                      {activeQR === 'phone' 
                        ? `Call ${selectedArtifact.shop.artisan.full_name}` 
                        : `Email ${selectedArtifact.shop.artisan.full_name}`
                      }
                    </p>
                    <div className="flex justify-center">
                      <QRCode 
                        value={
                          activeQR === 'phone' 
                            ? `tel:${selectedArtifact.shop.artisan.phone}`
                            : `mailto:${selectedArtifact.shop.artisan.email}`
                        } 
                        size={128}
                      />
                    </div>
                    <p className="text-center mt-2 text-sm text-gray-600">
                      Scan to {activeQR === 'phone' ? 'call' : 'email'}
                    </p>
                  </div>
                  
                )}
                
                <div className="mt-4 text-center">
                  <p className="text-xl font-bold">{selectedArtifact.artifact.price}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}