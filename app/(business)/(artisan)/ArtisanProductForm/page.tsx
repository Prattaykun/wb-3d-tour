// app/ArtisanProductList/page.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Artifact {
  name: string;
  images: string[];
  price: string;
}

interface Shop {
  name: string;
  landmark: string;
  images: string[];
  latitude: number | null;
  longitude: number | null;
  artifacts: Artifact[];
}

interface FormData {
  full_name: string;
  email: string;
  phone: string;
  shops: Shop[];
}

interface ConversationMessage {
  type: 'bot' | 'user';
  text: string;
}

export default function ArtisanProductForm() {
  const [conversation, setConversation] = useState<ConversationMessage[]>([
    { type: 'bot', text: "Hello! Let's get your products listed. First, what's your name?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [step, setStep] = useState('name');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentImages, setCurrentImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    email: '',
    phone: '',
    shops: []
  });
  
  const [currentShop, setCurrentShop] = useState<Shop>({
    name: '',
    landmark: '',
    images: [],
    latitude: null,
    longitude: null,
    artifacts: []
  });
  
  const [currentArtifact, setCurrentArtifact] = useState<Artifact>({
    name: '',
    images: [],
    price: ''
  });
  
  const [currentShopIndex, setCurrentShopIndex] = useState(-1);
  const [currentArtifactIndex, setCurrentArtifactIndex] = useState(-1);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null); // Add this state

  // Auto-scroll to bottom of chat
  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch user profile data
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      if (user) {
        await fetchProfile(user.id);
      }
    };
    getUser();
  }, []);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      if (data) {
        setFormData(prev => ({
          ...prev,
          full_name: data.full_name || '',
          email: data.email || ''
        }));
        
        if (data.full_name) {
          setConversation(prev => [
            ...prev,
            { type: 'bot', text: `Hi ${data.full_name}! What's your phone number?` }
          ]);
          setStep('phone');
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setConversation(prev => [
        ...prev,
        { type: 'bot', text: "Please enter your name:" }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const files = Array.from(e.target.files);
    setCurrentImages(files);
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };


  // Upload images to Cloudinary with proper error handling
  const uploadImagesToCloudinary = async (): Promise<string[]> => {
    if (currentImages.length === 0) return [];
    
    setIsUploading(true);
    const uploadedUrls: string[] = [];
    
    
    try {
       const uploadPromises = currentImages.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default');
        
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        if (!cloudName) {
          throw new Error('Cloudinary cloud name is not configured');
        }
        
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Upload failed');
        }
        
        const data = await response.json();
        return data.secure_url;
      });
      
      // Wait for all uploads to complete
      const results = await Promise.all(uploadPromises);
      uploadedUrls.push(...results);
      
      return uploadedUrls;
    } catch (error) {
      console.error('Error uploading images:', error);
      setConversation(prev => [
        ...prev, 
        { type: 'bot', text: "Sorry, there was an error uploading your images. Please try again." }
      ]);
      return [];
    } finally {
      setIsUploading(false);
      setCurrentImages([]);
      setImagePreviews([]);
    }
  };

  // Handle continue after image upload
  const handleImageUploadContinue = async () => {
    const uploadedUrls = await uploadImagesToCloudinary();
    
    if (uploadedUrls.length === 0) {
      setConversation(prev => [
        ...prev, 
        { type: 'bot', text: "No images were uploaded. Would you like to try again or continue without images?" }
      ]);
      return;
    }
    
    if (step === 'shopImagesUpload') {
      setCurrentShop(prev => ({ 
        ...prev, 
        images: [...prev.images, ...uploadedUrls] 
      }));
      setConversation(prev => [
        ...prev, 
        { type: 'bot', text: `Great! Added ${uploadedUrls.length} image(s) to your shop.` }
      ]);
      proceedToArtifacts();
    } else if (step === 'artifactImagesUpload') {
      setCurrentArtifact(prev => ({ 
        ...prev, 
        images: [...prev.images, ...uploadedUrls] 
      }));
      setConversation(prev => [
        ...prev, 
        { type: 'bot', text: `Great! Added ${uploadedUrls.length} image(s) to your artifact.` }
      ]);
      saveArtifact();
    }
  };

  // Handle skip image upload
const handleSkipImageUpload = async () => {
  if (step === 'shopImagesUpload') {
    // If there are selected images but user clicks skip, we need to clear them
    setCurrentImages([]);
    setImagePreviews([]);
    proceedToArtifacts();
  } else if (step === 'artifactImagesUpload') {
    // If there are selected images but user clicks skip, we need to clear them
    setCurrentImages([]);
    setImagePreviews([]);
    saveArtifact();
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    setIsLoading(true);
    
    // Add user message to conversation
    setConversation(prev => [...prev, { type: 'user', text: inputValue }]);

    try {
      // Process based on current step
      switch (step) {
        case 'name':
          setFormData(prev => ({ ...prev, full_name: inputValue }));
          setConversation(prev => [
            ...prev, 
            { type: 'bot', text: `Nice to meet you, ${inputValue}! What's your phone number?` }
          ]);
          setStep('phone');
          break;
        
        case 'phone':
          setFormData(prev => ({ ...prev, phone: inputValue }));
          setConversation(prev => [
            ...prev, 
            { type: 'bot', text: 'Great! Now, would you like to add a shop? (yes/no)' }
          ]);
          setStep('addShop');
          break;
        
        case 'addShop':
          if (inputValue.toLowerCase().startsWith('y')) {
            setConversation(prev => [
              ...prev, 
              { type: 'bot', text: "What's the name of your shop location?" }
            ]);
            setStep('shopName');
          } else if (formData.shops.length > 0) {
            // Submit the form if they don't want to add more shops but have at least one
            await submitForm();
          } else {
            setConversation(prev => [
              ...prev, 
              { type: 'bot', text: "You need to add at least one shop to list your artifacts. Would you like to add a shop? (yes/no)" }
            ]);
          }
          break;
        
        case 'shopName':
          setCurrentShop(prev => ({ ...prev, name: inputValue }));
          setConversation(prev => [
            ...prev, 
            { type: 'bot', text: "What's a nearby landmark to help customers find your shop?" }
          ]);
          setStep('shopLandmark');
          break;
        
        case 'shopLandmark':
          setCurrentShop(prev => ({ ...prev, landmark: inputValue }));
          setConversation(prev => [
            ...prev, 
            { type: 'bot', text: "Would you like to add your current location as the shop location? (yes/no)" }
          ]);
          setStep('shopLocationOption');
          break;
        
        case 'shopLocationOption':
          if (inputValue.toLowerCase().startsWith('y')) {
            await getCurrentLocation();
          } else {
            setConversation(prev => [
              ...prev, 
              { type: 'bot', text: "Please enter the latitude of your shop location:" }
            ]);
            setStep('shopLatitude');
          }
          break;
        
        case 'shopLatitude':
          setCurrentShop(prev => ({ ...prev, latitude: parseFloat(inputValue) || null }));
          setConversation(prev => [
            ...prev, 
            { type: 'bot', text: "Please enter the longitude of your shop location:" }
          ]);
          setStep('shopLongitude');
          break;
        
        case 'shopLongitude':
          setCurrentShop(prev => ({ ...prev, longitude: parseFloat(inputValue) || null }));
          setConversation(prev => [
            ...prev, 
            { type: 'bot', text: "Would you like to upload images of your shop? (yes/no)" }
          ]);
          setStep('shopImagesOption');
          break;
        
        case 'shopImagesOption':
          if (inputValue.toLowerCase().startsWith('y')) {
            setConversation(prev => [
              ...prev, 
              { type: 'bot', text: "Please upload images of your shop using the button below." }
            ]);
            setStep('shopImagesUpload');
          } else {
            proceedToArtifacts();
          }
          break;
        
        case 'addArtifact':
          if (inputValue.toLowerCase().startsWith('y')) {
            setConversation(prev => [
              ...prev, 
              { type: 'bot', text: "What's the name of this artifact?" }
            ]);
            setStep('artifactName');
          } else {
            finishShop();
          }
          break;
        
        case 'artifactName':
          setCurrentArtifact(prev => ({ ...prev, name: inputValue }));
          setConversation(prev => [
            ...prev, 
            { type: 'bot', text: "What's the price of this artifact?" }
          ]);
          setStep('artifactPrice');
          break;
        
        case 'artifactPrice':
          setCurrentArtifact(prev => ({ ...prev, price: inputValue }));
          setConversation(prev => [
            ...prev, 
            { type: 'bot', text: "Would you like to add images of this artifact? (yes/no)" }
          ]);
          setStep('artifactImagesOption');
          break;
        
        case 'artifactImagesOption':
          if (inputValue.toLowerCase().startsWith('y')) {
            setConversation(prev => [
              ...prev, 
              { type: 'bot', text: "Please upload images of your artifact using the button below." }
            ]);
            setStep('artifactImagesUpload');
          } else {
            saveArtifact();
          }
          break;
        
        case 'moreArtifacts':
          if (inputValue.toLowerCase().startsWith('y')) {
            setConversation(prev => [
              ...prev, 
              { type: 'bot', text: "What's the name of the next artifact?" }
            ]);
            setStep('artifactName');
          } else {
            finishShop();
          }
          break;
        
        case 'moreShops':
          if (inputValue.toLowerCase().startsWith('y')) {
            setConversation(prev => [
              ...prev, 
              { type: 'bot', text: "What's the name of your next shop location?" }
            ]);
            setStep('shopName');
          } else {
            await submitForm();
          }
          break;
        
        default:
          break;
      }
    } catch (error) {
      console.error('Error processing step:', error);
      setConversation(prev => [
        ...prev, 
        { type: 'bot', text: "Sorry, there was an error processing your input. Please try again." }
      ]);
    } finally {
      setInputValue('');
      setIsLoading(false);
    }
  };

  const getCurrentLocation = useCallback(async () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setConversation(prev => [
        ...prev, 
        { type: 'bot', text: "Geolocation is not supported by this browser. Please enter the latitude manually:" }
      ]);
      setStep('shopLatitude');
      return;
    }

    setConversation(prev => [
      ...prev, 
      { type: 'bot', text: "Getting your location..." }
    ]);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentShop(prev => ({ 
          ...prev, 
          latitude, 
          longitude 
        }));
        setConversation(prev => [
          ...prev, 
          { type: 'bot', text: `Location captured! Latitude: ${latitude}, Longitude: ${longitude}. Would you like to upload images of your shop? (yes/no)` }
        ]);
        setStep('shopImagesOption');
      },
      (error) => {
        console.error('Error getting location:', error);
        setConversation(prev => [
          ...prev, 
          { type: 'bot', text: "Unable to retrieve your location. Please enter the latitude manually:" }
        ]);
        setStep('shopLatitude');
      }
    );
  }, []);

  const proceedToArtifacts = useCallback(() => {
    setConversation(prev => [
      ...prev, 
      { type: 'bot', text: "Now let's add artifacts to this shop. Would you like to add an artifact? (yes/no)" }
    ]);
    setStep('addArtifact');
  }, []);

const saveArtifact = useCallback(async () => {
  // Create a copy of the current artifact with any uploaded images
  const artifactToSave = { ...currentArtifact };
  
  // If we have current images, upload them first
  if (currentImages.length > 0) {
    const uploadedUrls = await uploadImagesToCloudinary();
    if (uploadedUrls.length > 0) {
      artifactToSave.images = [...artifactToSave.images, ...uploadedUrls];
    }
  }
  
  // Update the shop with the artifact
  const updatedShop = { ...currentShop };
  if (currentArtifactIndex >= 0) {
    // Editing existing artifact
    updatedShop.artifacts[currentArtifactIndex] = artifactToSave;
  } else {
    // Adding new artifact
    updatedShop.artifacts = [...updatedShop.artifacts, artifactToSave];
  }
  
  setCurrentShop(updatedShop);
  setCurrentArtifact({ name: '', images: [], price: '' });
  setCurrentArtifactIndex(-1);
  setCurrentImages([]);
  setImagePreviews([]);
  
  setConversation(prev => [
    ...prev, 
    { type: 'bot', text: "Artifact saved! Would you like to add another artifact to this shop? (yes/no)" }
  ]);
  setStep('moreArtifacts');
}, [currentShop, currentArtifact, currentArtifactIndex, currentImages]);

  const finishShop = useCallback(() => {
    const updatedFormData = { ...formData };
    if (currentShopIndex >= 0) {
      // Editing existing shop
      updatedFormData.shops[currentShopIndex] = { ...currentShop };
    } else {
      // Adding new shop
      updatedFormData.shops = [...updatedFormData.shops, { ...currentShop }];
    }
    
    setFormData(updatedFormData);
    setCurrentShop({ name: '', landmark: '', images: [], latitude: null, longitude: null, artifacts: [] });
    setCurrentShopIndex(-1);
    
    setConversation(prev => [
      ...prev, 
      { type: 'bot', text: "Shop saved! Would you like to add another shop? (yes/no)" }
    ]);
    setStep('moreShops');
  }, [formData, currentShop, currentShopIndex]);

 const submitForm = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Prepare the data for insertion
      const submissionData = {
        artisan_id: user.id,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        products: formData.shops,
        updated_at: new Date().toISOString()
      };
      
      console.log('Submitting data:', submissionData);
      
      const { data, error } = await supabase
        .from('artifacts')
        .upsert(submissionData)
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      setConversation(prev => [
        ...prev, 
        { type: 'bot', text: "Thank you! Your products have been successfully listed." }
      ]);
      setStep('complete');
    } catch (error) {
      console.error('Error submitting form:', error);
      setConversation(prev => [
        ...prev, 
        { type: 'bot', text: "Sorry, there was an error submitting your information. Please try again later." }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [formData]);


  // Render image upload interface when in upload steps
  const renderImageUpload = () => {
    const isShopUpload = step === 'shopImagesUpload';
    const title = isShopUpload ? "Shop Images" : "Artifact Images";
    
    return (
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-800 mb-2">{title}</h3>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageSelect}
          multiple
          accept="image/*"
          className="hidden"
        />
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg mb-4"
        >
          Select Images
        </button>
        
        {imagePreviews.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-blue-800 mb-2">Image Previews:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img 
                    src={preview} 
                    alt={`Preview ${index + 1}`} 
                    className="w-full h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = [...currentImages];
                      const newPreviews = [...imagePreviews];
                      newImages.splice(index, 1);
                      newPreviews.splice(index, 1);
                      setCurrentImages(newImages);
                      setImagePreviews(newPreviews);
                    }}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleImageUploadContinue}
                disabled={isUploading}
                className="bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {isUploading ? 'Uploading...' : 'Upload & Continue'}
              </button>
              
              <button
                type="button"
                onClick={handleSkipImageUpload}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Skip Upload
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100">
        <div className="bg-gradient-to-r from-blue-500 via-green-500 to-purple-600 p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold">Artisan Product Listing</h1>
          <p className="mt-2 opacity-90">Let's get your artifacts listed in our marketplace</p>
        </div>
        
        <div className="p-4 md:p-6">
          <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto mb-4 border border-blue-200">
            {conversation.map((msg, index) => (
              <div
                key={index}
                className={`flex mb-4 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-lg p-3 max-w-xs md:max-w-md ${
                    msg.type === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gradient-to-r from-green-100 to-purple-100 text-gray-800 rounded-bl-none border border-green-200'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-gradient-to-r from-green-100 to-purple-100 text-gray-800 rounded-lg rounded-bl-none border border-green-200 p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {(step === 'shopImagesUpload' || step === 'artifactImagesUpload') ? (
            renderImageUpload()
          ) : (
            <form onSubmit={handleSubmit} className="flex">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 px-4 py-2 border border-blue-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Type your response here..."
                disabled={step === 'complete' || isLoading}
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-r-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={!inputValue.trim() || step === 'complete' || isLoading}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Send'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}