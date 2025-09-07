import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Define the public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/role',
  '/auth/signup',
  '/About',
  '/MyTourPlan',
  '/Culture',
  '/Events',
  '/Heritage',
  '/map',
  '/unauthorized'
];

// Define routes accessible only to consumers
const consumerOnlyRoutes = [
  '/payment/razorpay',
  '/PlanTrip',
  '/TravelCheckout'
];

// Define routes accessible only to business users
const businessOnlyRoutes = [
  '/TravelProductList',
  '/TravelProductForm',
  '/BusinessDashboard',
  '/BusinessForm',
  '/BusinessLoader'
];

// Define routes accessible only to admins
const adminOnlyRoutes = [
  '/admin'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the current route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
  
  // If it's a public route, allow access to everyone
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // Create Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  // Get the user ID from cookies directly
  const userId = request.cookies.get('user-id')?.value;
  
  // If no user ID found, user is not logged in - redirect to unauthorized
  if (!userId) {
    return NextResponse.next();
  }
  
  let userRole = null;
  
  try {
    // Get user role directly from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (!profileError && profile) {
      userRole = profile.role;
    } else {
      console.error('Error fetching user profile:', profileError);
      // If no profile found, redirect to role selection
      return NextResponse.redirect(new URL('/auth/role', request.url));
    }
  } catch (error) {
    console.error('Error in profile lookup:', error);
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
  
  // Check if user is trying to access consumer-only routes
  const isConsumerRoute = consumerOnlyRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
  
  if (isConsumerRoute && userRole !== 'consumer') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
  
  // Check if user is trying to access business-only routes
  const isBusinessRoute = businessOnlyRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
  
  if (isBusinessRoute && userRole !== 'business') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
  
  // Check if user is trying to access admin-only routes
  const isAdminRoute = adminOnlyRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
  
  if (isAdminRoute && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
  
  // If user has a role but it doesn't match any protected route patterns,
  // allow access (this handles cases where routes don't require specific roles)
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};