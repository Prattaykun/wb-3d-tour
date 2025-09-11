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
// Enhanced Sample Response Generator with consistent styling
function generateSampleResponse(tourData: any) {
  const savedPlacesSection = tourData.includeSavedPlaces && tourData.savedPlaces?.length
    ? `<div class="bg-gradient-to-r from-green-100 to-green-200 p-5 rounded-2xl shadow-lg mb-6 border border-green-300">
        <h2 class="text-2xl font-bold text-green-800 mb-3">✨ Including Your Saved Places</h2>
        <ul class="list-disc list-inside text-black space-y-1">
          ${tourData.savedPlaces.map((p: any) => `<li>${p.name}${p.city ? ` in ${p.city}` : ''}</li>`).join('')}
        </ul>
      </div>`
    : '';

  return `
  <div class="bg-white p-8 rounded-3xl shadow-2xl max-w-7xl mx-auto">
    <h1 class="text-4xl md:text-5xl font-extrabold text-amber-700 mb-6 text-center">🌟 Discover West Bengal: A Cultural Odyssey 🌟</h1>
    <p class="text-gray-700 text-lg md:text-xl mb-8 text-center">Your personalized ${tourData.days}-day journey through the heart of Bengal</p>

    ${savedPlacesSection}

    <div class="bg-amber-50 p-6 rounded-2xl mb-8 shadow-inner border border-amber-200">
      <h2 class="text-2xl font-bold text-amber-800 mb-4">Tour Overview</h2>
      <ul class="list-disc list-inside text-black space-y-1">
        <li><strong>Starting Point:</strong> ${tourData.startingPoint}</li>
        <li><strong>Duration:</strong> ${tourData.days} days, ${tourData.nights} nights</li>
        <li><strong>Budget:</strong> ₹${tourData.budget.toLocaleString('en-IN')}</li>
        <li><strong>Travel Style:</strong> ${tourData.journeyType}</li>
        <li><strong>Interests:</strong> ${tourData.categories.join(', ')}</li>
        ${tourData.interestedInEvents && tourData.selectedEvents ? `<li><strong>Events:</strong> ${tourData.selectedEvents.map((e: any) => e.title).join(', ')}</li>` : ''}
        ${tourData.additionalRequirements && tourData.additionalRequirements !== "None" ? `<li><strong>Additional Requirements:</strong> ${tourData.additionalRequirements}</li>` : ''}
      </ul>
    </div>

    <div class="mb-10">
      <h2 class="text-3xl font-bold text-amber-700 mb-6 text-center">Journey Flow 📍</h2>
      ${generateVerticalFlowChart(tourData)}
    </div>

    <h2 class="text-3xl font-bold text-amber-700 mb-6">Sample Itinerary</h2>

    <div class="space-y-8">
      ${generateItineraryDays(tourData)}
    </div>

    <div class="bg-gradient-to-r from-amber-100 to-amber-200 p-6 rounded-2xl mt-10 shadow-lg border border-amber-300">
      <h2 class="text-2xl font-bold text-amber-800 mb-4">Travel Tips ✨</h2>
      <ul class="list-disc list-inside text-black space-y-1">
        <li>Try authentic Bengali sweets like Rosogolla and Sandesh</li>
        <li>Bargain at local markets for best prices</li>
        <li>Carry light cotton clothes as Bengal can be humid</li>
        <li>Respect local customs at religious sites</li>
        <li>Don't miss sunset at Howrah Bridge for amazing photos</li>
      </ul>
    </div>

    <div class="bg-gradient-to-r from-blue-100 to-blue-200 p-6 rounded-2xl mt-8 shadow-lg border border-blue-300">
      <h2 class="text-2xl font-bold text-blue-800 mb-4">Packing Essentials 🎒</h2>
      <ul class="list-disc list-inside text-black space-y-1">
        <li>Light cotton clothing</li>
        <li>Comfortable walking shoes</li>
        <li>Rain gear (monsoon season)</li>
        <li>Camera for photos</li>
        <li>Power bank for devices</li>
      </ul>
    </div>

    <div class="bg-green-50 p-6 rounded-2xl mt-8 shadow-inner border border-green-200">
      <h2 class="text-2xl font-bold text-green-800 mb-2">Note</h2>
      <p class="text-black">This is a sample itinerary. For a fully personalized plan, ensure your Gemini API key is configured.</p>
    </div>
  </div>
  `;
}

// Professional Vertical Flow Chart Generator - Connected Line
function generateVerticalFlowChart(tourData: any): string {
  const steps = [
    `Starting Point: ${tourData.startingPoint.split(',')[0]}`,
    `Day 1-2: Explore ${tourData.startingPoint.split(',')[0]}`,
    `Morning: Victoria Memorial & St. Paul's Cathedral`,
    `Afternoon: Indian Museum & Park Street Dinner`,
    `Travel to Darjeeling (3-4 hrs)`,
    `Day 3-4: Darjeeling Sightseeing`,
    `Visit Tiger Hill & Batasia Loop`,
    `Explore Darjeeling Tea Gardens`,
    `Travel to Kalimpong (2 hrs)`,
    `Day 5: Kalimpong Adventure`,
    `Explore Zang Dhok Palri Monastery`,
    `Local Markets & Cultural Walk`,
    `Return to Kolkata (7-8 hrs)`
  ];

  return `
    <div class="relative flex flex-col items-center py-6">
      <!-- Vertical line -->
      <div class="absolute top-0 left-1/2 w-1 h-full bg-gray-400 -translate-x-1/2 rounded"></div>

      ${steps.map((title, idx) => `
        <div class="flex flex-col items-center relative mb-8 z-10">
          <!-- Step circle -->
          <div class="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg mb-2">${idx + 1}</div>
          <!-- Step box -->
          <div class="bg-gradient-to-r from-gray-200 to-gray-300 text-black p-4 rounded-2xl shadow-lg min-w-[300px] text-center font-semibold">
            ${title}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// Itinerary days generator for consistent styling
function generateItineraryDays(tourData: any): string {
  const days = [
    { day: 'Day 1', title: `Arrival in ${tourData.startingPoint}`, activities: [
      `Morning: Arrive at ${tourData.startingPoint}. Check-in at your ${tourData.hotelPreference.toLowerCase()} hotel. Enjoy a traditional Bengali breakfast.`,
      `Afternoon: Visit Victoria Memorial, St. Paul's Cathedral, and Indian Museum.`,
      `Evening: Explore Park Street for dinner and experience Kolkata's vibrant nightlife.`
    ], colorFrom: 'from-blue-50', colorTo: 'to-blue-100', textColor: 'text-black' },
    { day: 'Day 2', title: 'Spiritual & Heritage Tour', activities: [
      'Morning: Visit Dakshineswar Kali Temple and Belur Math.',
      'Afternoon: Explore Kumartuli (potter\'s quarter) and Marble Palace.',
      'Evening: Attend a cultural show or enjoy local Bengali cuisine.'
    ], colorFrom: 'from-purple-50', colorTo: 'to-purple-100', textColor: 'text-black' },
  ];

  return days.map(day => `
    <div class="bg-gradient-to-r ${day.colorFrom} ${day.colorTo} p-6 rounded-2xl shadow-md border border-gray-300">
      <h3 class="text-2xl font-semibold ${day.textColor} mb-3">${day.day}: ${day.title}</h3>
      ${day.activities.map(act => `<p class="text-black mb-2">${act}</p>`).join('')}
    </div>
  `).join('');
}

