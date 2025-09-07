// app/api/generate-tour-plan/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

export async function POST(request: NextRequest) {
  try {
    const tourData = await request.json();

    // If Gemini is not configured, return a sample response
    if (!genAI) {
      console.warn('GEMINI_API_KEY not configured, returning sample response');
      return NextResponse.json({ 
        plan: generateSampleResponse(tourData),
        note: 'This is a sample response as Gemini API is not configured'
      });
    }

    const prompt = `
      Create a detailed, engaging tour plan for West Bengal based on the following preferences:
      - Starting point: ${tourData.startingPoint}
      - Duration: ${tourData.days} days, ${tourData.nights} nights
      - Budget: INR ${tourData.budget}
      - Journey type: ${tourData.journeyType}
      - Interests: ${tourData.categories.join(', ')}
      - Accommodation preference: ${tourData.hotelPreference}
      ${tourData.interestedInEvents && tourData.events ? `- Interested in events: Yes, including ${tourData.events.map((e: any) => e.title).join(', ')}` : ''}
      ${tourData.additionalRequirements && tourData.additionalRequirements !== "None" ? `- Additional requirements: ${tourData.additionalRequirements}` : ''}

      Please create an engaging, well-structured itinerary that includes:
      1. A catchy title for the tour
      2. Daily breakdown with morning, afternoon, and evening activities
      3. Recommendations for places to eat local cuisine
      4. Accommodation suggestions matching the preference
      5. Transportation tips between locations
      6. Estimated costs for major activities
      7. Cultural tips and etiquette reminders
      8. Safety recommendations

      Format the response in clean HTML with proper structure but NO inline styles. Use semantic HTML tags like:
      <h1>, <h2>, <h3> for headings
      <p> for paragraphs
      <ul> and <li> for lists
      <strong> for emphasis
      <div> with clear class names that would work with Tailwind CSS

      IMPORTANT: Do NOT use markdown formatting or code blocks. Return only clean HTML.

      Focus on showcasing the rich culture, heritage, and beauty of West Bengal. Include specific details that make the itinerary personal and engaging.
      
      ${tourData.additionalRequirements && tourData.additionalRequirements !== "None" ? 'IMPORTANT: Make sure to address the additional requirements mentioned above in your itinerary.' : ''}
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up the response - remove markdown code blocks if present
    text = text.replace(/```html|```/g, '').trim();

    return NextResponse.json({ plan: text });

  } catch (error) {
    console.error('Error generating tour plan:', error);
    
    // Return a sample response if Gemini API fails
    try {
      const tourData = await request.json();
      return NextResponse.json({ 
        plan: generateSampleResponse(tourData),
        note: 'This is a fallback response due to API error'
      });
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Failed to generate tour plan and parse request' },
        { status: 500 }
      );
    }
  }
}

// Fallback function to generate a sample response
function generateSampleResponse(tourData: any) {
  return `
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-amber-700 mb-4">Discover West Bengal: A Cultural Odyssey</h1>
      <p class="text-gray-600 mb-6">Your personalized ${tourData.days}-day journey through the heart of Bengal</p>
      
      <div class="bg-amber-50 p-4 rounded-lg mb-6">
        <h2 class="text-xl font-semibold text-amber-800 mb-2">Tour Overview</h2>
        <ul class="list-disc list-inside text-gray-700">
          <li><strong>Starting Point:</strong> ${tourData.startingPoint}</li>
          <li><strong>Duration:</strong> ${tourData.days} days, ${tourData.nights} nights</li>
          <li><strong>Budget:</strong> ₹${tourData.budget.toLocaleString('en-IN')}</li>
          <li><strong>Travel Style:</strong> ${tourData.journeyType}</li>
          <li><strong>Interests:</strong> ${tourData.categories.join(', ')}</li>
          ${tourData.interestedInEvents && tourData.events ? `<li><strong>Events:</strong> ${tourData.events.map((e: any) => e.title).join(', ')}</li>` : ''}
          ${tourData.additionalRequirements && tourData.additionalRequirements !== "None" ? `<li><strong>Additional Requirements:</strong> ${tourData.additionalRequirements}</li>` : ''}
        </ul>
      </div>
      
      <h2 class="text-2xl font-bold text-amber-700 mb-4">Sample Itinerary</h2>
      
      <div class="mb-6">
        <h3 class="text-xl font-semibold text-amber-600 mb-2">Day 1: Arrival in Kolkata - The Cultural Capital</h3>
        <div class="ml-4">
          <p class="text-gray-700"><strong>Morning:</strong> Arrive at ${tourData.startingPoint}. Transfer to your ${tourData.hotelPreference.toLowerCase()} hotel. Freshen up and enjoy traditional Bengali breakfast.</p>
          <p class="text-gray-700"><strong>Afternoon:</strong> Visit Victoria Memorial, St. Paul's Cathedral, and Indian Museum.</p>
          <p class="text-gray-700"><strong>Evening:</strong> Explore Park Street for dinner and experience Kolkata's famous nightlife.</p>
        </div>
      </div>
      
      <div class="mb-6">
        <h3 class="text-xl font-semibold text-amber-600 mb-2">Day 2: Spiritual and Heritage Tour</h3>
        <div class="ml-4">
          <p class="text-gray-700"><strong>Morning:</strong> Visit Dakshineswar Kali Temple and Belur Math.</p>
          <p class="text-gray-700"><strong>Afternoon:</strong> Explore Kumartuli (potter's quarter) and Marble Palace.</p>
          <p class="text-gray-700"><strong>Evening:</strong> Attend cultural show or enjoy Bengali cuisine at a local restaurant.</p>
        </div>
      </div>
      
      <div class="bg-amber-50 p-4 rounded-lg mb-6">
        <h2 class="text-xl font-semibold text-amber-800 mb-2">Travel Tips</h2>
        <ul class="list-disc list-inside text-gray-700">
          <li>Try authentic Bengali sweets like Rosogolla and Sandesh</li>
          <li>Bargain at local markets for best prices</li>
          <li>Carry light cotton clothes as Bengal can be humid</li>
          <li>Respect local customs at religious sites</li>
        </ul>
      </div>
      
      <div class="bg-blue-50 p-4 rounded-lg">
        <h2 class="text-xl font-semibold text-blue-800 mb-2">Note</h2>
        <p class="text-blue-700">This is a sample itinerary. For a fully personalized plan based on your preferences, please ensure your Gemini API key is properly configured.</p>
      </div>
    </div>
  `;
}