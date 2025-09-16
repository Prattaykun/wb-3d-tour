import { useState, useEffect } from 'react';
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Travel {
  pricing: { btc: number; eth: number; inr: number };
  category: string;
  booked_at: string;
  product_id: string;
  payment_status: string;
}

interface Place {
  id: string;
  city?: string;
  name: string;
}

interface TourPlan {
  days: number;
  budget: number;
  nights: number;
  categories: string[];
  journeyType: string;
  savedPlaces: Place[];
  startingPoint: string;
  hotelPreference: string;
  additionalRequirements: string;
}

const ConsumerProfile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [tourPlan, setTourPlan] = useState<TourPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch consumer profile
      const { data: profileData } = await supabase
        .from('consumer_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Fetch tour plan
      const { data: tourPlanData } = await supabase
        .from('consumer_tour_plan')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setProfile(profileData);
      setTourPlan(tourPlanData?.plan_data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
  </div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-2xl p-8 mb-8 text-white shadow-xl">
          <h1 className="text-4xl font-bold mb-2">Travel Dashboard</h1>
          <p className="text-blue-100">Welcome back, {profile?.full_name}!</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
            <h2 className="text-2xl font-bold mb-4 text-purple-700">Profile Information</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="w-32 font-medium text-blue-600">Full Name:</span>
                <span className="text-gray-700">{profile?.full_name}</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 font-medium text-blue-600">Email:</span>
                <span className="text-gray-700">{profile?.email}</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 font-medium text-blue-600">Total Trips:</span>
                <span className="text-gray-700">{profile?.booked_travels?.length || 0}</span>
              </div>
            </div>
          </div>

          {/* Travel Stats */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
            <h2 className="text-2xl font-bold mb-4 text-green-700">Travel Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-blue-600 font-semibold">Booked Travels</p>
                <p className="text-3xl font-bold text-blue-700">{profile?.booked_travels?.length || 0}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl">
                <p className="text-purple-600 font-semibold">Visited Places</p>
                <p className="text-3xl font-bold text-purple-700">{profile?.visit_places?.length || 0}</p>
              </div>
            </div>
          </div>

          {/* Booked Travels */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Recent Bookings</h2>
            <div className="space-y-4">
              {profile?.booked_travels?.map((travel: Travel, index: number) => (
                <div key={index} className="border-l-4 border-purple-500 pl-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">{travel.category} Package</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      travel.payment_status === 'complete' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {travel.payment_status}
                    </span>
                  </div>
                  <p className="text-gray-600">Booked on: {new Date(travel.booked_at).toLocaleDateString()}</p>
                  <div className="flex gap-4 mt-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">₹{travel.pricing.inr}</span>
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">ETH {travel.pricing.eth}</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">BTC {travel.pricing.btc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tour Plan */}
          {tourPlan && (
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-green-100">
              <h2 className="text-2xl font-bold mb-4 text-green-700">Your Tour Plan</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-purple-600">Trip Details</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium text-blue-600">Duration:</span> {tourPlan.days} days / {tourPlan.nights} nights</p>
                    <p><span className="font-medium text-blue-600">Budget:</span> ₹{tourPlan.budget}</p>
                    <p><span className="font-medium text-blue-600">Journey Type:</span> {tourPlan.journeyType}</p>
                    <p><span className="font-medium text-blue-600">Hotel Preference:</span> {tourPlan.hotelPreference}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-purple-600">Special Requirements</h3>
                  <p className="bg-blue-50 p-4 rounded-lg text-blue-800">{tourPlan.additionalRequirements}</p>
                </div>

                <div className="md:col-span-2">
                  <h3 className="font-semibold text-lg mb-3 text-purple-600">Places to Visit</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {tourPlan.savedPlaces?.map((place: Place, index: number) => (
                      <div key={index} className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg border border-purple-100">
                        <h4 className="font-semibold text-green-700">{place.name}</h4>
                        <p className="text-sm text-gray-600">{place.city}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsumerProfile;