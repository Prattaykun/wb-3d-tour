// app/MyTourPlan/page.tsx
"use client"
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

// Types (unchanged)
type Category = 'Heritage' | 'Temple' | 'Museum' | 'Nature' | 'Fort' | 'Beach' | 
  'Market' | 'Park' | 'Transport' | 'Wildlife' | 'National Park' | 'Village' | 
  'Town' | 'Viewpoint' | 'Cultural Site' | 'Pilgrimage' | 'Archaeological' | 
  'Hillstation' | 'Engineering' | 'Religious' | 'Lake' | 'Shopping';

type HotelPreference = 'Budget' | 'Mid' | 'Premium' | 'Luxury' | 'Heritage Property';

type JourneyType = 'Relaxed' | 'Adventurous' | 'Cultural' | 'Spiritual' | 'Family' | 'Solo';

interface TourPlanData {
  startingPoint: string;
  days: number;
  nights: number;
  budget: number;
  journeyType: JourneyType;
  categories: Category[];
  hotelPreference: HotelPreference;
  interestedInEvents: boolean;
  selectedEvents?: any[];
  additionalRequirements?: string;
  userId?: string;
  includeSavedPlaces?: boolean;
}

interface Event {
  id: string;
  title: string;
  category: string;
  start_date: string;
  end_date: string;
  venue: string;
  city: string;
  description: string;
  image_url: string;
}

interface ChatMessage {
  type: 'question' | 'answer' | 'event';
  content: string;
  step: number;
  data?: any;
}

interface SavedPlace {
  id: string;
  name: string;
  city?: string;
}

// Initialize Supabase (unchanged)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const MyTourPlan = () => {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>('ai');
  const [events, setEvents] = useState<Event[]>([]);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [planResult, setPlanResult] = useState<string | null>(null);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [customLocation, setCustomLocation] = useState('');
  const [showEventSelection, setShowEventSelection] = useState(false);
  const [showCustomLocationInput, setShowCustomLocationInput] = useState(false);
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [showAdditionalRequirements, setShowAdditionalRequirements] = useState(false);
  const [showSavedPlacesPreview, setShowSavedPlacesPreview] = useState(false);
  
  const [formData, setFormData] = useState<TourPlanData>({
    startingPoint: '',
    days: 3,
    nights: 2,
    budget: 10000,
    journeyType: 'Cultural',
    categories: [],
    hotelPreference: 'Mid',
    interestedInEvents: false,
    selectedEvents: [],
    includeSavedPlaces: false
  });

  // Form steps with questions
  const [formSteps, setFormSteps] = useState<any[]>([]);
  
  // Ref for chat container to enable auto-scrolling
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Redirect to PlanTrip if agency tab is selected
  useEffect(() => {
    if (activeTab === 'agency') {
      router.push('/PlanTrip');
    }
  }, [activeTab, router]);

  // Fetch user, events, and saved places on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (!userError && user) {
          setUser(user);
          
          // Fetch user's saved places
          const { data: profileData, error: profileError } = await supabase
            .from('consumer_profiles')
            .select('visit_places')
            .eq('id', user.id)
            .maybeSingle();
            
          if (!profileError && profileData && profileData.visit_places) {
            // Filter out null values and ensure we have an array of SavedPlace
            const validPlaces = profileData.visit_places.filter((place: any) => place !== null) as SavedPlace[];
            setSavedPlaces(validPlaces);
          }
        }
        
        // Fetch upcoming events
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .gte('end_date', new Date().toISOString())
          .order('start_date', { ascending: true })
          .limit(5);
        
        if (!eventsError && eventsData) {
          setEvents(eventsData);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  // Form step type definition
  type FormStep =
    | {
        question: string;
        type: "select";
        options: string[];
        key: string;
      }
    | {
        question: string;
        type: "number";
        key: string;
        min: number;
        max: number;
      }
    | {
        question: string;
        type: "slider";
        key: string;
        min: number;
        max: number;
        step: number;
      }
    | {
        question: string;
        type: "button-group";
        options: string[];
        key: string;
      }
    | {
        question: string;
        type: "multi-select";
        options: string[];
        key: string;
      }
    | {
        question: string;
        type: "saved-places";
        key: string;
        places: SavedPlace[];
      }
    | {
        question: string;
        type: "events";
        key: string;
        options: string[];
      }
    | {
        question: string;
        type: "additional-requirements";
        key: string;
        options: string[];
      };

  // Build form steps dynamically based on whether user has saved places
  useEffect(() => {
    const baseSteps: FormStep[] = [
      {
        question: "Welcome to West Bengal Tour Planner! 🌄 Where would you like to start your journey?",
        type: "select",
        options: [
          "Netaji Subhas Chandra Bose International Airport, Kolkata",
          "Bagdogra Airport, Siliguri", 
          "Howrah Junction Railway Station",
          "Sealdah Railway Station",
          "Other location (please specify)"
        ],
        key: "startingPoint"
      },
      {
        question: "Great choice! How many days will you be exploring beautiful West Bengal?",
        type: "number",
        key: "days",
        min: 1,
        max: 30
      },
      {
        question: `You've selected ${formData.days} days. How many nights will you be staying? (Typically ${Math.max(1, formData.days - 1)} nights for ${formData.days} days)`,
        type: "number", 
        key: "nights",
        min: 1,
        max: 30
      },
      {
        question: "What's your total budget for this trip (in INR)?",
        type: "slider",
        key: "budget",
        min: 5000,
        max: 100000,
        step: 5000
      },
      {
        question: "What type of journey experience are you looking for?",
        type: "button-group",
        options: ['Relaxed', 'Adventurous', 'Cultural', 'Spiritual', 'Family', 'Solo'],
        key: "journeyType"
      },
      {
        question: "What interests you most about West Bengal? (Select all that apply)",
        type: "multi-select",
        options: [
          'Heritage', 'Temple', 'Museum', 'Nature', 'Fort', 'Beach', 
          'Market', 'Park', 'Wildlife', 'National Park', 'Village', 
          'Town', 'Viewpoint', 'Cultural Site', 'Pilgrimage', 
          'Archaeological', 'Hillstation', 'Lake', 'Shopping'
        ],
        key: "categories"
      },
      {
        question: "What type of accommodation do you prefer?",
        type: "button-group",
        options: ['Budget', 'Mid', 'Premium', 'Luxury', 'Heritage Property'],
        key: "hotelPreference"
      }
    ];
    
    // Add saved places question if user has saved places
    if (savedPlaces.length > 0) {
      baseSteps.push({
        question: "I see you have some places saved in your tour plan. Would you like to include these in your itinerary?",
        type: "saved-places",
        key: "includeSavedPlaces",
        places: savedPlaces
      });
    }
    
    // Add events and additional requirements questions
    baseSteps.push(
      {
        question: "Would you like to include any upcoming events in your itinerary?",
        type: "events",
        key: "interestedInEvents",
        options: ["Yes", "No"]
      },
      {
        question: "Do you have any additional requirements or preferences for your itinerary?",
        type: "additional-requirements",
        key: "additionalRequirements",
        options: ["Yes", "No"]
      }
    );
    
    setFormSteps(baseSteps);
  }, [savedPlaces, formData.days]); // Added formData.days as dependency

  // Initialize chat with first question when formSteps is available
  useEffect(() => {
    if (formSteps.length > 0 && chatMessages.length === 0) {
      setChatMessages([{
        type: 'question',
        content: formSteps[0].question,
        step: 0
      }]);
    }
  }, [formSteps, chatMessages.length]);

  // Auto-scroll to bottom when chat messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

const handleAnswer = (answer: any) => {
  if (formSteps.length === 0) return;
  
  const currentStepData = formSteps[currentStep];
  
  // Handle custom location selection
  if (currentStep === 0 && answer === "Other location (please specify)") {
    setShowCustomLocationInput(true);
    return;
  }
  
  // Handle custom location input
  if (currentStep === 0 && showCustomLocationInput) {
    if (!customLocation.trim()) return; // Don't proceed if no custom location provided
    answer = customLocation;
  }

  // Special handling for days - automatically set nights to days-1
  let newFormData = { ...formData };
  if (currentStepData.key === 'days') {
    // Automatically set nights to days-1 (minimum 1 night)
    const nights = Math.max(1, answer - 1);
    newFormData = { ...formData, [currentStepData.key]: answer, nights };
  } else {
    newFormData = { ...formData, [currentStepData.key]: answer };
  }
  
  setFormData(newFormData);

  // Special handling for additional requirements - don't set boolean value
  if (currentStep === formSteps.length - 1) {
    if (answer === true) {
      setShowAdditionalRequirements(true);
      return;
    } else {
      // If user selects "No" to additional requirements, submit with empty value
      const finalFormData = { ...newFormData, additionalRequirements: "None" };
      setFormData(finalFormData);
      handleSubmitWithData(finalFormData);
      return;
    }
  }

  // Add answer to chat
  setChatMessages(prev => [
    ...prev,
    {
      type: 'answer',
      content: typeof answer === 'string' ? answer : 
               Array.isArray(answer) ? answer.join(', ') : 
               answer.toString(),
      step: currentStep
    }
  ]);

  // Special handling for saved places question
  if (currentStepData.key === 'includeSavedPlaces') {
    if (answer === true) {
      setShowSavedPlacesPreview(true);
      return;
    } else {
      // If user selects "No", move to next step
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      // Add next question to chat
      setTimeout(() => {
        setChatMessages(prev => [
          ...prev,
          {
            type: 'question',
            content: formSteps[nextStep].question,
            step: nextStep
          }
        ]);
      }, 300);
      return;
    }
  }

  // Special handling for events question
  if (currentStepData.key === 'interestedInEvents' && answer === true && events.length > 0) {
    setShowEventSelection(true);
    // Add event selection question to chat
    setChatMessages(prev => [
      ...prev,
      {
        type: 'question',
        content: "Great! Here are the upcoming events in West Bengal. Which ones would you like to include?",
        step: currentStep + 0.5 // Use decimal step to indicate it's a sub-step
      }
    ]);
    return;
  }

  // Reset custom location input state
  if (currentStep === 0) {
    setShowCustomLocationInput(false);
    setCustomLocation('');
  }

  // Move to next step
  if (currentStep < formSteps.length - 1) {
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    
    // Update the nights question if we're moving to the nights step
    if (nextStep === 2) { // Assuming nights is the third step (index 2)
      // Update the form steps to reflect the correct number of nights suggestion
      const updatedSteps = [...formSteps];
      updatedSteps[2] = {
        ...updatedSteps[2],
        question: `You've selected ${newFormData.days} days. How many nights will you be staying? (Typically ${Math.max(1, newFormData.days - 1)} nights for ${newFormData.days} days)`
      };
      setFormSteps(updatedSteps);
    }
    
    // Add next question to chat
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          type: 'question',
          content: formSteps[nextStep].question,
          step: nextStep
        }
      ]);
    }, 300);
  }
};

// ... rest of the code remains unchanged

const handleAdditionalRequirementsSubmit = () => {
  // Store the additional requirements in form data
  const requirements = additionalRequirements.trim();
  const newFormData = { ...formData, additionalRequirements: requirements || "None" };
  setFormData(newFormData);
  
  // Add requirements to chat
  setChatMessages(prev => [
    ...prev,
    {
      type: 'answer',
      content: requirements || "No additional requirements",
      step: formSteps.length - 1
    }
  ]);

  // Clear the input field and hide the input UI
  setAdditionalRequirements('');
  setShowAdditionalRequirements(false);
  
  // Submit the form with the updated data
  handleSubmitWithData(newFormData);
};

const handleEventSelection = (selectedEvents: Event[]) => {
  setFormData(prev => ({ ...prev, selectedEvents }));
  
  // Add event selections to chat
  if (selectedEvents.length > 0) {
    setChatMessages(prev => [
      ...prev,
      {
        type: 'answer',
        content: `Selected events: ${selectedEvents.map(e => e.title).join(', ')}`,
        step: formSteps.length - 1
      }
    ]);
  } else {
    setChatMessages(prev => [
      ...prev,
      {
        type: 'answer',
        content: "No events selected",
        step: formSteps.length - 1
      }
    ]);
  }
  
  // Close the event selection section
  setShowEventSelection(false);
  
  // Move to additional requirements step
  const nextStep = formSteps.length - 1;
  setCurrentStep(nextStep);
  
  // Add additional requirements question to chat
  setTimeout(() => {
    setChatMessages(prev => [
      ...prev,
      {
        type: 'question',
        content: formSteps[nextStep].question,
        step: nextStep
      }
    ]);
  }, 300);
};

const handleSavedPlacesConfirmation = (include: boolean) => {
  setFormData(prev => ({ ...prev, includeSavedPlaces: include }));
  
  // Add answer to chat
  setChatMessages(prev => [
    ...prev,
    {
      type: 'answer',
      content: include ? "Yes, include my saved places" : "No, don't include saved places",
      step: currentStep
    }
  ]);
  
  // Close the saved places preview
  setShowSavedPlacesPreview(false);
  
  // Move to next step
  const nextStep = currentStep + 1;
  setCurrentStep(nextStep);
  
  // Add next question to chat
  setTimeout(() => {
    setChatMessages(prev => [
      ...prev,
      {
        type: 'question',
        content: formSteps[nextStep].question,
        step: nextStep
      }
    ]);
  }, 300);
};

const handleSubmitWithData = async (submissionData: TourPlanData) => {
  setIsLoading(true);
  setError(null);
  
  try {
    // Include saved places in the data if user opted in
    const finalData = {
      ...submissionData,
      savedPlaces: submissionData.includeSavedPlaces ? savedPlaces : []
    };

    // Save plan to database with user ID if available
    const planData = {
      user_id: user?.id || null,
      plan_data: finalData,
      created_at: new Date().toISOString()
    };

    const { error: dbError } = await supabase
      .from('consumer_tour_plan')
      .insert([planData]);
    
    if (dbError) {
      console.error('Database error:', dbError);
      // Continue anyway as this is not critical
    }

    // Call Gemini API
    const response = await fetch('/api/generate-tour-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(finalData),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to generate plan');
    }

    setPlanResult(result.plan);
    
  } catch (error) {
    console.error('Error:', error);
    setError('There was an error creating your tour plan. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

const handleSubmit = async () => {
  handleSubmitWithData(formData);
};

  const renderInput = (step: number) => {
    if (formSteps.length === 0) return null;
    
    const stepData = formSteps[step];
    
    // Show saved places preview if needed
    if (showSavedPlacesPreview) {
      return (
        <SavedPlacesPreview 
          places={savedPlaces}
          onConfirm={(include) => handleSavedPlacesConfirmation(include)}
        />
      );
    }
    
    // Show event selection in chat instead of input area
    if (showEventSelection) {
      return (
        <EventSelection 
          events={events}
          onSelect={handleEventSelection}
          onSkip={() => handleEventSelection([])}
        />
      );
    }
    
    // Show additional requirements input if needed
    if (showAdditionalRequirements) {
      return (
        <div className="space-y-4">
          <textarea
            placeholder="Please share any additional requirements, preferences, or special requests for your itinerary..."
            value={additionalRequirements}
            onChange={(e) => setAdditionalRequirements(e.target.value)}
            className="w-full p-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24"
          />
          <div className="flex space-x-2">
            <button
              onClick={handleAdditionalRequirementsSubmit}
              className="flex-1 p-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
            >
              Submit Requirements
            </button>
            <button
              onClick={() => {
                const newFormData = {...formData, additionalRequirements: "None"};
                setFormData(newFormData);
                handleSubmitWithData(newFormData);
              }}
              className="flex-1 p-3 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors"
            >
              Skip
            </button>
          </div>
        </div>
      );
    }
    
    // Show custom location input if needed
    if (step === 0 && showCustomLocationInput) {
      return (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Please specify your starting location"
            value={customLocation}
            onChange={(e) => setCustomLocation(e.target.value)}
            className="w-full p-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            onClick={() => handleAnswer(customLocation)}
            disabled={!customLocation.trim()}
            className="w-full p-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Location
          </button>
        </div>
      );
    }
    
    switch (stepData.type) {
      case 'select':
        return (
          <div className="space-y-2">
            {stepData.options?.map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="w-full p-3 text-left rounded-lg bg-indigo-100 hover:bg-indigo-200 transition-colors text-indigo-800"
              >
                {option}
              </button>
            ))}
          </div>
        );
      
      case 'number':
        return (
          <div className="flex space-x-4">
            {stepData.key === 'days' ? (
              // For days, show standard options
              [3, 5, 7, 10].map(num => (
                <button
                  key={num}
                  onClick={() => handleAnswer(num)}
                  className="flex-1 p-3 rounded-lg bg-teal-100 hover:bg-teal-200 transition-colors text-teal-800"
                >
                  {num} Days
                </button>
              ))
            ) : (
              // For nights, show options based on selected days
              [Math.max(1, formData.days - 1), formData.days, formData.days + 1].map(num => (
                <button
                  key={num}
                  onClick={() => handleAnswer(num)}
                  className="flex-1 p-3 rounded-lg bg-teal-100 hover:bg-teal-200 transition-colors text-teal-800"
                >
                  {num} Nights
                </button>
              ))
            )}
          </div>
        );
      
      case 'slider':
        return (
          <div className="space-y-4">
            <input
              type="range"
              min={stepData.min}
              max={stepData.max}
              step={stepData.step}
              value={formData.budget}
              onChange={(e) => setFormData({...formData, budget: parseInt(e.target.value)})}
              className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-purple-700">
              <span>₹{stepData.min?.toLocaleString('en-IN')}</span>
              <span className="font-bold">₹{formData.budget.toLocaleString('en-IN')}</span>
              <span>₹{stepData.max?.toLocaleString('en-IN')}</span>
            </div>
            <button
              onClick={() => handleAnswer(formData.budget)}
              className="w-full p-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
            >
              Confirm Budget
            </button>
          </div>
        );
      
      case 'button-group':
        return (
          <div className="grid grid-cols-2 gap-2">
            {stepData.options?.map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className={`p-3 rounded-lg transition-colors ${
                  formData[stepData.key as keyof TourPlanData] === option
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        );
      
      case 'multi-select':
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {stepData.options?.map((category: string, index: number) => (
                <button
                  key={index}
                  onClick={() => {
                    const newCategories = formData.categories.includes(category as Category)
                      ? formData.categories.filter(c => c !== category)
                      : [...formData.categories, category as Category];
                    setFormData({...formData, categories: newCategories});
                  }}
                  className={`p-2 rounded-lg transition-colors text-sm ${
                    formData.categories.includes(category as Category)
                      ? 'bg-green-600 text-white'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <button
              onClick={() => handleAnswer(formData.categories)}
              className="w-full p-3 mt-4 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              Confirm Interests
            </button>
          </div>
        );
      
      case 'saved-places':
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => handleAnswer(true)}
              className="flex-1 p-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
            >
              Yes, include them
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="flex-1 p-3 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors"
            >
              No, create new plan
            </button>
          </div>
        );
      
      case 'events':
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => handleAnswer(true)}
              className="flex-1 p-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
            >
              Yes, show me events
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="flex-1 p-3 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors"
            >
              No thanks
            </button>
          </div>
        );
      
      case 'additional-requirements':
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => handleAnswer(true)}
              className="flex-1 p-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
            >
              Yes, add requirements
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="flex-1 p-3 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors"
            >
              No, generate now
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Saved places preview component
  const SavedPlacesPreview = ({ places, onConfirm }: { 
    places: SavedPlace[], 
    onConfirm: (include: boolean) => void 
  }) => {
    return (
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Your Saved Places:</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {places.map((place, index) => (
              <div key={index} className="p-2 bg-white rounded border">
                <h4 className="font-medium">{place.name}</h4>
                {place.city && <p className="text-sm text-gray-600">{place.city}</p>}
              </div>
            ))}
          </div>
        </div>
        <p className="text-gray-700">Would you like to include these places in your travel plan?</p>
        <div className="flex space-x-2">
          <button
            onClick={() => onConfirm(true)}
            className="flex-1 p-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
          >
            Yes, include them
          </button>
          <button
            onClick={() => onConfirm(false)}
            className="flex-1 p-3 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors"
          >
            No, create new plan
          </button>
        </div>
      </div>
    );
  };

  // Event selection component that appears in the chat
  const EventSelection = ({ events, onSelect, onSkip }: { 
    events: Event[], 
    onSelect: (events: Event[]) => void, 
    onSkip: () => void 
  }) => {
    const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);

    const toggleEvent = (event: Event) => {
      setSelectedEvents(prev => 
        prev.some(e => e.id === event.id)
          ? prev.filter(e => e.id !== event.id)
          : [...prev, event]
      );
    };

    return (
      <div className="space-y-4">
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {events.map(event => (
            <div 
              key={event.id} 
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedEvents.some(e => e.id === event.id)
                  ? 'border-purple-500 bg-purple-100'
                  : 'border-gray-300 hover:border-purple-300'
              }`}
              onClick={() => toggleEvent(event)}
            >
              <h4 className="font-semibold text-purple-800">{event.title}</h4>
              <p className="text-sm text-purple-600">
                {new Date(event.start_date).toLocaleDateString()} - {event.venue}, {event.city}
              </p>
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onSelect(selectedEvents)}
            className="flex-1 p-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
          >
            Confirm Events
          </button>
          <button
            onClick={onSkip}
            className="flex-1 p-3 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors"
          >
            Skip Events
          </button>
        </div>
      </div>
    );
  };

  // Don't render anything if redirecting to agency
  if (activeTab === 'agency') {
    return null;
  }

  if (planResult) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-100 py-8 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <h1 className="text-3xl font-bold">Your West Bengal Adventure Awaits!</h1>
            <p className="mt-2">Here's your personalized itinerary crafted with care</p>
          </div>
          
          <div className="p-6 prose max-w-none" dangerouslySetInnerHTML={{ __html: planResult }} />
          
          <div className="p-6 bg-gray-50 flex justify-between">
            <button 
              onClick={() => setPlanResult(null)}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Modify Plan
            </button>
            <button 
              onClick={() => window.print()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Print Itinerary
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800">Discover Incredible West Bengal</h1>
          <p className="text-purple-600 mt-2">Plan your perfect journey through the cultural heart of India</p>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl shadow-md p-1 flex">
            <button
              onClick={() => setActiveTab('agency')}
              className={`px-6 py-3 rounded-xl transition-colors ${
                activeTab === 'agency' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 hover:bg-blue-100'
              }`}
            >
              Travel Agency
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-6 py-3 rounded-xl transition-colors ${
                activeTab === 'ai' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 hover:bg-blue-100'
              }`}
            >
              AI Planner
            </button>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <h2 className="text-2xl font-bold">Plan with AI</h2>
            <p>Let's create your perfect West Bengal itinerary together</p>
          </div>

          <div 
            ref={chatContainerRef}
            className="p-4 h-96 overflow-y-auto bg-gray-50"
          >
            <div className="space-y-4">
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'question' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                      message.type === 'question'
                        ? 'bg-blue-100 text-blue-800 rounded-bl-none'
                        : 'bg-green-100 text-green-800 rounded-br-none'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-blue-100 text-blue-800 p-3 rounded-lg rounded-bl-none">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-white border-t">
            {formSteps.length > 0 && renderInput(currentStep)}
          </div>

          {error && (
            <div className="p-4 bg-red-100 text-red-700 border-t">
              {error}
            </div>
          )}
        </div>

        {/* West Bengal Highlights */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <h2 className="text-2xl font-bold">Why West Bengal?</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 text-xl">🎭</span>
              </div>
              <h3 className="font-medium text-blue-800">Rich Culture</h3>
              <p className="text-sm text-gray-600 mt-1">From Durga Puja to Poila Boishakh</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 text-xl">🏞️</span>
              </div>
              <h3 className="font-medium text-green-800">Diverse Landscapes</h3>
              <p className="text-sm text-gray-600 mt-1">Himalayas to Sundarbans</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 text-xl">🍴</span>
              </div>
              <h3 className="font-medium text-purple-800">Culinary Delights</h3>
              <p className="text-sm text-gray-600 mt-1">From street food to royal cuisine</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTourPlan;