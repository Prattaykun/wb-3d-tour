'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import ConsumerProfile from '@/components/consumer/ConsumerProfile';
import BusinessDashboard from '@/app/(business)/BusinessDashboard/page';
import ConsumerReview from '@/components/consumer/ConsumerReview';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: 'consumer' | 'business' | 'admin' | '';
  created_at: string;
  user: any;
}

export default function UserProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();
    window.addEventListener('hashchange', checkUser);
    
    return () => {
      window.removeEventListener('hashchange', checkUser);
    };
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user: userData } } = await supabase.auth.getUser();
      
      if (!userData) {
        router.push('/auth/login');
        return;
      }
      
      setUser(userData);
      await fetchProfile(userData.id);
    } catch (error) {
      console.error('Error checking user:', error);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please log in</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view this page.</p>
          <button 
            onClick={() => router.push('/auth/login')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
            User Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all"
          >
            Sign Out
          </button>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8 border border-purple-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{profile?.full_name || 'User'}</h2>
              <div className="flex flex-wrap gap-3 mb-4 md:mb-0">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {profile?.email}
                </span>
                <span className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  Joined: {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  profile?.role === 'admin' 
                    ? 'bg-gradient-to-r from-purple-100 to-green-100 text-purple-800' 
                    : profile?.role === 'business'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {profile?.role?.toUpperCase() || 'USER'}
                </span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
              <div className="text-white text-center">
                <p className="text-sm">User ID</p>
                <p className="text-xs font-mono truncate max-w-[140px]">{user.id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Role-Based Content */}
        <div className="grid grid-cols-1 gap-8">
          {(!profile?.role || profile.role === 'consumer') && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
              <h3 className="text-xl font-bold text-green-700 mb-4">Consumer Profile</h3>
              <ConsumerProfile />
            </div>
          )}
          
          {(profile?.role === 'business' || profile?.role === 'admin') && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
              <h3 className="text-xl font-bold text-blue-700 mb-4">Business Dashboard</h3>
              <BusinessDashboard />
            </div>
          )}
          
          {/* Consumer Review for all logged in users */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
            <h3 className="text-xl font-bold text-purple-700 mb-4">Your Reviews</h3>
            
            <ConsumerReview user={user} />

          </div>
        </div>
      </div>
    </div>
  );
}