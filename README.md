# West Bengal Tour App
[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/Prattaykun/wb-3d-tour)

The West Bengal  Tour App is a comprehensive platform designed to showcase the rich cultural heritage, natural beauty, and vibrant traditions of West Bengal, India. It serves as a bridge connecting tourists with local artisans and travel businesses, offering an immersive experience for consumers and a powerful tool for local entrepreneurs.

The application is built with a modern stack, including Next.js, Supabase for the backend, and Google's Gemini AI for intelligent features like semantic search and automated tour plan generation. It is also packaged with Capacitor for deployment as a native mobile application.

## Core Features

### For Consumers:
- **AI-Powered Tour Planning**: Generate personalized tour itineraries for West Bengal based on interests, budget, and duration using Gemini AI.
- **Interactive  Map Exploration**: Discover heritage sites, temples, beaches, mountains, artisan shops, and hotels on an interactive  map powered by MapLibre GL.
- **Comprehensive Search**: A unified search bar with semantic capabilities to find places, hotels, events, and artisan products.
- **Booking and Checkout**: Book travel packages and manage your cart. Payments are just demos as it's a prototype and will not be approved in the scrutiny check of Razorpay.
- **User Profiles**: Manage personal information, view booked trips, and save favorite places to visit.
- **Reviews**: Share feedback and ratings on visited places, hotels, and events.

### For Businesses (Travel Agencies & Artisans):
- **Business Registration**: A chat-based form for travel agencies, artisans, and other businesses to register their profile.
- **Artisan Product Management**: Artisans can list their shops and artifacts through a conversational UI, including image uploads via Cloudinary. Products are displayed on the main map to attract tourists.
- **Travel Package Management**: Travel agencies can create and manage detailed, multi-category tour packages with complex itineraries, including day-by-day stops and meal plans.
- **Customer Management**: View details of customers who have booked travel packages.
- **Role-Based Dashboards**: Separate, intuitive dashboards for consumers and business owners to manage their respective activities.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Backend & Database**: [Supabase](https://supabase.io/) (PostgreSQL, Auth, Storage)
- **AI & Embeddings**: [Google Gemini](https://ai.google.dev/)
- **Mobile Wrapper**: [Capacitor](https://capacitorjs.com/)
- **Mapping**: [MapLibre GL](https://maplibre.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Image Management**: [Cloudinary](https://cloudinary.com/)
- **Payments**: [Razorpay](https://razorpay.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## Getting Started

### Prerequisites

- Node.js (v20 or later)
- npm, yarn, or pnpm
- A Supabase account
- A MapTiler account for map rendering
- A Google Gemini API key
- A Cloudinary account for image hosting

### 1. Set up Environment Variables

Create a `.env.local` file in the root of the project and add the following environment variables. Obtain the values from your respective service dashboards.

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

NEXT_PUBLIC_MAPTILER_KEY=your_maptiler_api_key
NEXT_PUBLIC_MAPTILER_STYLE=your_maptiler_style_id

GEMINI_API_KEY=your_gemini_api_key

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
```

### 2. Set up Supabase Database

This project uses Supabase for its backend. You will need to set up the database schema. The necessary SQL migrations are located in the `/supabase/migrations` directory. You can apply these migrations using the Supabase CLI.

Refer to the Supabase documentation for [local development](https://supabase.com/docs/guides/cli) to set up and apply migrations.

### 3. Install Dependencies

Navigate to the project directory and install the required dependencies.

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 4. Run the Development Server

Start the Next.js development server.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

> **Note:** This project is focused on tourism in West Bengal, India. All maps, search results, and content are tailored to showcase the state's unique attractions, artisan communities, and businesses.
