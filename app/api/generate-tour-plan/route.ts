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

    // Build the prompt with saved places if included
    let savedPlacesPrompt = '';
    if (tourData.includeSavedPlaces && tourData.savedPlaces && tourData.savedPlaces.length > 0) {
      savedPlacesPrompt = `- Must include these specific places: ${tourData.savedPlaces.map((p: any) => `${p.name}${p.city ? ` in ${p.city}` : ''}`).join(', ')}\n`;
    }

    const prompt = `
      Create a highly engaging, visually appealing, and catchy tour plan for West Bengal based on the following preferences:
      - Starting point: ${tourData.startingPoint}
      - Duration: ${tourData.days} days, ${tourData.nights} nights
      - Budget: INR ${tourData.budget}
      - Journey type: ${tourData.journeyType}
      - Interests: ${tourData.categories.join(', ')}
      - Accommodation preference: ${tourData.hotelPreference}
      ${savedPlacesPrompt}
      ${tourData.interestedInEvents && tourData.selectedEvents ? `- Interested in events: Yes, including ${tourData.selectedEvents.map((e: any) => e.title).join(', ')}` : ''}
      ${tourData.additionalRequirements && tourData.additionalRequirements !== "None" ? `- Additional requirements: ${tourData.additionalRequirements}` : ''}

      Please create an extremely engaging, well-structured itinerary that includes:
      1. A catchy, attention-grabbing title for the tour with emojis
      2. Daily breakdown with morning, afternoon, and evening activities with exciting descriptions
      3. Recommendations for places to eat local cuisine with must-try dishes
      4. Accommodation suggestions matching the preference with brief highlights
      5. Transportation tips between locations with estimated times
      6. Estimated costs for major activities
      7. Cultural tips and etiquette reminders
      8. Safety recommendations
      9. A colorful HTML-based flow chart using div elements with Tailwind CSS classes to visualize the travel flow between locations and accommodations
      10. Fun facts and hidden gems about each location
      11. Photo opportunities suggestions for Instagram-worthy shots
      12. Packing recommendations based on the itinerary

      Format the response in clean HTML with proper structure but NO inline styles. Use semantic HTML tags like:
      <h1>, <h2>, <h3> for headings
      <p> for paragraphs
      <ul> and <li> for lists
      <strong> for emphasis
      <div> with clear class names that would work with Tailwind CSS

      IMPORTANT: For the flow chart, use HTML div elements with Tailwind CSS classes for colors and styling.
      Do NOT use ASCII art or markdown formatting. Return only clean HTML.

      Focus on showcasing the rich culture, heritage, and beauty of West Bengal with vibrant, exciting language.
      Use a colorful HTML-based flow chart to visualize the journey between locations and accommodations.
      
      ${tourData.additionalRequirements && tourData.additionalRequirements !== "None" ? 'IMPORTANT: Make sure to address the additional requirements mentioned above in your itinerary.' : ''}
      
      ${savedPlacesPrompt ? 'IMPORTANT: The itinerary MUST include all the specific places mentioned above.' : ''}

      Make the response so engaging that the user feels excited to embark on this journey immediately!
      Use emojis sparingly to highlight key points and make the content more visually appealing.
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
  // Include saved places in the sample response if applicable
  let savedPlacesSection = '';
  if (tourData.includeSavedPlaces && tourData.savedPlaces && tourData.savedPlaces.length > 0) {
    savedPlacesSection = `
      <div class="bg-green-50 p-4 rounded-lg mb-6">
        <h2 class="text-xl font-semibold text-green-800 mb-2">Including Your Saved Places</h2>
        <ul class="list-disc list-inside text-gray-700">
          ${tourData.savedPlaces.map((p: any) => `<li>${p.name}${p.city ? ` in ${p.city}` : ''}</li>`).join('')}
        </ul>
      </div>
    `;
  }
  
  return `
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-amber-700 mb-4">🌟 Discover West Bengal: A Cultural Odyssey 🌟</h1>
      <p class="text-gray-600 mb-6">Your personalized ${tourData.days}-day journey through the heart of Bengal</p>
      
      ${savedPlacesSection}
      
      <div class="bg-amber-50 p-4 rounded-lg mb-6">
        <h2 class="text-xl font-semibold text-amber-800 mb-2">Tour Overview</h2>
        <ul class="list-disc list-inside text-gray-700">
          <li><strong>Starting Point:</strong> ${tourData.startingPoint}</li>
          <li><strong>Duration:</strong> ${tourData.days} days, ${tourData.nights} nights</li>
          <li><strong>Budget:</strong> ₹${tourData.budget.toLocaleString('en-IN')}</li>
          <li><strong>Travel Style:</strong> ${tourData.journeyType}</li>
          <li><strong>Interests:</strong> ${tourData.categories.join(', ')}</li>
          ${tourData.interestedInEvents && tourData.selectedEvents ? `<li><strong>Events:</strong> ${tourData.selectedEvents.map((e: any) => e.title).join(', ')}</li>` : ''}
          ${tourData.additionalRequirements && tourData.additionalRequirements !== "None" ? `<li><strong>Additional Requirements:</strong> ${tourData.additionalRequirements}</li>` : ''}
        </ul>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-amber-700 mb-4">Your Journey Flow 📍</h2>
        ${generateColorfulFlowChart(tourData)}
      </div>
      
      <h2 class="text-2xl font-bold text-amber-700 mb-4">Sample Itinerary</h2>
      
      <div class="mb-6">
        <h3 class="text-xl font-semibold text-amber-600 mb-2">Day 1: Arrival in Kolkata - The Cultural Capital 🏙️</h3>
        <div class="ml-4">
          <p class="text-gray-700"><strong>Morning:</strong> Arrive at ${tourData.startingPoint}. Transfer to your ${tourData.hotelPreference.toLowerCase()} hotel. Freshen up and enjoy traditional Bengali breakfast.</p>
          <p class="text-gray-700"><strong>Afternoon:</strong> Visit Victoria Memorial, St. Paul's Cathedral, and Indian Museum.</p>
          <p class="text-gray-700"><strong>Evening:</strong> Explore Park Street for dinner and experience Kolkata's famous nightlife.</p>
        </div>
      </div>
      
      <div class="mb-6">
        <h3 class="text-xl font-semibold text-amber-600 mb-2">Day 2: Spiritual and Heritage Tour ⛪</h3>
        <div class="ml-4">
          <p class="text-gray-700"><strong>Morning:</strong> Visit Dakshineswar Kali Temple and Belur Math.</p>
          <p class="text-gray-700"><strong>Afternoon:</strong> Explore Kumartuli (potter's quarter) and Marble Palace.</p>
          <p class="text-gray-700"><strong>Evening:</strong> Attend cultural show or enjoy Bengali cuisine at a local restaurant.</p>
        </div>
      </div>
      
      <div class="bg-amber-50 p-4 rounded-lg mb-6">
        <h2 class="text-xl font-semibold text-amber-800 mb-2">Travel Tips ✨</h2>
        <ul class="list-disc list-inside text-gray-700">
          <li>Try authentic Bengali sweets like Rosogolla and Sandesh</li>
          <li>Bargain at local markets for best prices</li>
          <li>Carry light cotton clothes as Bengal can be humid</li>
          <li>Respect local customs at religious sites</li>
          <li>Don't miss the sunset at Howrah Bridge for amazing photos</li>
        </ul>
      </div>

      <div class="bg-blue-50 p-4 rounded-lg mb-6">
        <h2 class="text-xl font-semibold text-blue-800 mb-2">Packing Essentials 🎒</h2>
        <ul class="list-disc list-inside text-gray-700">
          <li>Light cotton clothing</li>
          <li>Comfortable walking shoes</li>
          <li>Rain gear (if traveling during monsoon)</li>
          <li>Camera for capturing beautiful moments</li>
          <li>Power bank for your devices</li>
        </ul>
      </div>
      
      <div class="bg-green-50 p-4 rounded-lg">
        <h2 class="text-xl font-semibold text-green-800 mb-2">Note</h2>
        <p class="text-green-700">This is a sample itinerary. For a fully personalized plan based on your preferences, please ensure your Gemini API key is properly configured.</p>
      </div>
    </div>
  `;
}

// Helper function to generate colorful HTML flow chart
function generateColorfulFlowChart(tourData: any): string {
  return `
  <div class="flowchart-container overflow-x-auto py-4">
    <div class="flowchart flex flex-col items-center min-w-[800px] p-4">
      <div class="flowchart-step bg-blue-500 text-white font-bold p-4 rounded-lg mb-2 text-center min-w-[250px] shadow-md">
        Starting Point: ${tourData.startingPoint.split(',')[0]}
      </div>
      <div class="flowchart-arrow blue-to-green">
        <div class="absolute -bottom-2 -left-1 w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-green-500"></div>
      </div>
      
      <div class="flowchart-step bg-purple-500 text-white p-4 rounded-lg mb-2 text-center min-w-[250px] shadow-md">
        Day 1-2: Explore ${tourData.startingPoint.split(',')[0]}
      </div>
      <div class="flowchart-arrow purple-to-green">
        <div class="absolute -bottom-2 -left-1 w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-green-500"></div>
      </div>
      
      <div class="flowchart-step bg-green-500 text-white p-4 rounded-lg mb-2 text-center min-w-[250px] shadow-md">
        Travel to Darjeeling (3-4 hours)
      </div>
      <div class="flowchart-arrow green-to-yellow">
        <div class="absolute -bottom-2 -left-1 w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-yellow-500"></div>
      </div>
      
      <div class="flowchart-step bg-yellow-500 text-gray-800 p-4 rounded-lg mb-2 text-center min-w-[250px] shadow-md">
        Day 3-4: Discover Darjeeling
      </div>
      <div class="flowchart-arrow yellow-to-orange">
        <div class="absolute -bottom-2 -left-1 w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-orange-500"></div>
      </div>
      
      <div class="flowchart-step bg-orange-500 text-white p-4 rounded-lg mb-2 text-center min-w-[250px] shadow-md">
        Travel to Kalimpong (2 hours)
      </div>
      <div class="flowchart-arrow orange-to-red">
        <div class="absolute -bottom-2 -left-1 w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-red-500"></div>
      </div>
      
      <div class="flowchart-step bg-red-500 text-white p-4 rounded-lg mb-2 text-center min-w-[250px] shadow-md">
        Day 5: Kalimpong Adventure
      </div>
      <div class="flowchart-arrow red-to-indigo">
        <div class="absolute -bottom-2 -left-1 w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-indigo-500"></div>
      </div>
      
      <div class="flowchart-step bg-indigo-500 text-white font-bold p-4 rounded-lg text-center min-w-[250px] shadow-md">
        Return to Kolkata (7-8 hours)
      </div>
    </div>
  </div>
  
  <h3 class="text-lg font-semibold mt-8 mb-4 text-gray-700">Accommodation Flow</h3>
  <div class="flowchart-container overflow-x-auto py-4">
    <div class="flowchart-branch flex justify-center gap-8 relative">
      <div class="flowchart-branch-connector"></div>
      
      <div class="branch-column flex flex-col items-center z-10">
        <div class="flowchart-step bg-blue-200 text-blue-800 p-4 rounded-lg text-center min-w-[200px] shadow-md">
          Kolkata<br>${tourData.hotelPreference} Hotel
        </div>
      </div>
      
      <div class="branch-column flex flex-col items-center z-10">
        <div class="flowchart-step bg-green-200 text-green-800 p-4 rounded-lg text-center min-w-[200px] shadow-md">
          Darjeeling<br>${tourData.hotelPreference} Hotel
        </div>
      </div>
      
      <div class="branch-column flex flex-col items-center z-10">
        <div class="flowchart-step bg-yellow-200 text-yellow-800 p-4 rounded-lg text-center min-w-[200px] shadow-md">
          Kalimpong<br>${tourData.hotelPreference} Hotel
        </div>
      </div>
    </div>
  </div>
  `;
}