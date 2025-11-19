'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Space_Grotesk } from 'next/font/google';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ShoppingBag, 
  Store, 
  Shirt, 
  Laptop, 
  Home, 
  Palette, 
  Dumbbell, 
  Sparkles
} from 'lucide-react';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

interface OnboardingData {
  role: 'buyer' | 'seller' | null;
  categories: string[];
  location: {
    city: string;
    postalCode: string;
  };
}

const categories = [
  { id: 'fashion', name: 'Fashion & Clothing', icon: Shirt, color: 'bg-pink-100 text-pink-600' },
  { id: 'electronics', name: 'Electronics', icon: Laptop, color: 'bg-blue-100 text-blue-600' },
  { id: 'home', name: 'Home & Living', icon: Home, color: 'bg-green-100 text-green-600' },
  { id: 'art', name: 'Art & Handmade', icon: Palette, color: 'bg-purple-100 text-purple-600' },
  { id: 'sports', name: 'Sports & Outdoor', icon: Dumbbell, color: 'bg-orange-100 text-orange-600' },
  { id: 'accessories', name: 'Accessories & Jewelry', icon: Sparkles, color: 'bg-yellow-100 text-yellow-600' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    role: null,
    categories: [],
    location: { city: '', postalCode: '' },
  });

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const handleRoleSelect = (role: 'buyer' | 'seller') => {
    setData({ ...data, role });
  };

  const handleCategoryToggle = (categoryId: string) => {
    setData({
      ...data,
      categories: data.categories.includes(categoryId)
        ? data.categories.filter((c) => c !== categoryId)
        : [...data.categories, categoryId],
    });
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    // Show analyzing screen
    setIsAnalyzing(true);

    // Save onboarding data to API
    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: data.role,
          categories: data.categories,
          city: data.location.city,
          postalCode: data.location.postalCode,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Wait for animation (2.5 seconds)
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        // Redirect based on role
        if (data.role === 'buyer') {
          router.push('/buyer-dashboard');
        } else if (data.role === 'seller') {
          router.push('/seller-dashboard');
        } else {
          router.push('/dashboard');
        }
      } else {
        console.error('Onboarding failed:', result.error);
        setIsAnalyzing(false);
        alert(result.error || 'Failed to complete onboarding');
      }
    } catch (error) {
      console.error('Onboarding error:', error);
      setIsAnalyzing(false);
      alert('An error occurred. Please try again.');
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.role !== null;
      case 2:
        return data.categories.length > 0;
      case 3:
        return data.location.city.trim() !== '';
      default:
        return false;
    }
  };

  return (
    <div className={`relative min-h-screen bg-[#FDFBFB] flex items-center justify-center p-4 overflow-hidden ${spaceGrotesk.className}`}>
      {/* Logo - Top Left Corner */}
      <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="Woopy Logo"
          width={36}
          height={36}
          className="object-contain"
        />
        <span className="text-2xl font-semibold tracking-tight text-[#1F1B24]">Woopy</span>
      </div>

      {/* Analyzing Screen */}
      {isAnalyzing ? (
        <div className="flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
          {/* Animated Spinner */}
          <div className="relative">
            <div className="w-24 h-24 border-4 border-[#FDECEF] rounded-full"></div>
            <div className="absolute top-0 left-0 w-24 h-24 border-4 border-[#B0112D] border-t-transparent rounded-full animate-spin"></div>
          </div>

          {/* Text Content */}
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-[#1F1B24]">
              Analyzing your preferences...
            </h2>
            <p className="text-lg text-[#4C434F] max-w-md">
              We're personalizing your experience based on your selections
            </p>
          </div>

          {/* Animated Dots */}
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-[#B0112D] rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-[#AC0C35] rounded-full animate-pulse delay-75"></div>
            <div className="w-3 h-3 bg-[#770022] rounded-full animate-pulse delay-150"></div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-3xl h-screen flex flex-col py-8">
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-y-auto mt-16">
            {/* Step 1: Role Selection */}
            {currentStep === 1 && (
              <div className="flex flex-col items-center justify-center flex-1 max-w-2xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                    How would you like to use Woopy?
                  </h2>
                  <p className="text-gray-600">
                    Anyhow, we're here to help you out what's right for you
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 w-full mb-12">
                  <button
                    onClick={() => handleRoleSelect('buyer')}
                    className={`p-8 rounded-2xl border-2 transition-all duration-200 ${
                      data.role === 'buyer'
                        ? 'border-[#AC0C35] bg-[#FDECEF] shadow-md'
                        : 'border-[#E3D7D7] hover:border-[#AC0C35]/30 hover:bg-white/50'
                    }`}
                  >
                    <div className="mb-6">
                      <div className="w-32 h-32 mx-auto bg-[#FDECEF] rounded-xl flex items-center justify-center border border-[#FACDD6]">
                        <ShoppingBag className="w-16 h-16 text-[#770022]" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-[#1F1B24]">As a buyer</h3>
                    <p className="text-[#4C434F] text-sm">
                      Explore products and connect with sellers. Find exactly what you're looking for in our marketplace.
                    </p>
                  </button>

                  <button
                    onClick={() => handleRoleSelect('seller')}
                    className={`p-8 rounded-2xl border-2 transition-all duration-200 ${
                      data.role === 'seller'
                        ? 'border-[#AC0C35] bg-[#FDECEF] shadow-md'
                        : 'border-[#E3D7D7] hover:border-[#AC0C35]/30 hover:bg-white/50'
                    }`}
                  >
                    <div className="mb-6">
                      <div className="w-32 h-32 mx-auto bg-[#FDECEF] rounded-xl flex items-center justify-center border border-[#FACDD6]">
                        <Store className="w-16 h-16 text-[#770022]" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-[#1F1B24]">As a seller</h3>
                    <p className="text-[#4C434F] text-sm">
                      Showcase your products and grow your business. Reach customers looking for what you offer.
                    </p>
                  </button>
                </div>

                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="bg-[#B0112D] hover:bg-[#8A0A2A] text-white px-8 h-12 rounded-lg font-semibold tracking-wide shadow-[0_10px_25px_rgba(172,12,53,0.35)] transition-colors"
                >
                  Let's start
                </Button>
              </div>
            )}

            {/* Step 2: Categories */}
            {currentStep === 2 && (
              <div className="flex flex-col items-center justify-center flex-1 max-w-2xl mx-auto">
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                    {data.role === 'seller' 
                      ? 'What categories do you plan to sell in?' 
                      : 'What categories interest you?'}
                  </h2>
                  <p className="text-gray-600">
                    Select at least one category to personalize your experience
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full mb-10">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    const isSelected = data.categories.includes(category.id);
                    
                    return (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryToggle(category.id)}
                        className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                          isSelected
                            ? 'border-[#AC0C35] bg-[#FDECEF] shadow-md'
                            : 'border-[#E3D7D7] hover:border-[#AC0C35]/30 hover:bg-white/50'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-lg bg-[#FDECEF] border border-[#FACDD6] flex items-center justify-center mx-auto mb-3">
                          <Icon className="w-6 h-6 text-[#770022]" />
                        </div>
                        <h3 className="font-medium text-sm text-center text-[#1F1B24]">
                          {category.name}
                        </h3>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="px-6 h-12 text-[#4C434F] hover:text-[#1F1B24] hover:bg-gray-100"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="bg-[#B0112D] hover:bg-[#8A0A2A] text-white px-8 h-12 rounded-lg font-semibold tracking-wide shadow-[0_10px_25px_rgba(172,12,53,0.35)] transition-colors"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Location */}
            {currentStep === 3 && (
              <div className="flex flex-col items-center justify-center flex-1 max-w-md mx-auto">
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                    Where are you located?
                  </h2>
                  <p className="text-gray-600">
                    Share your location to discover the closest sellers and products
                  </p>
                </div>

                <div className="space-y-4 w-full mb-10">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-semibold tracking-wide text-[#1F1B24]">
                      City
                    </Label>
                    <Input
                      id="city"
                      placeholder="e.g., Istanbul"
                      value={data.location.city}
                      onChange={(e) =>
                        setData({
                          ...data,
                          location: { ...data.location, city: e.target.value },
                        })
                      }
                      className="h-12 bg-white/70 border-[#1F1B24]/15 placeholder:text-[#908694] focus:border-[#AC0C35] focus:ring-[#AC0C35] text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postalCode" className="text-sm font-semibold tracking-wide text-[#1F1B24]">
                      Postal Code (Optional)
                    </Label>
                    <Input
                      id="postalCode"
                      placeholder="e.g., 34000"
                      value={data.location.postalCode}
                      onChange={(e) =>
                        setData({
                          ...data,
                          location: { ...data.location, postalCode: e.target.value },
                        })
                      }
                      className="h-12 bg-white/70 border-[#1F1B24]/15 placeholder:text-[#908694] focus:border-[#AC0C35] focus:ring-[#AC0C35] text-base"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="px-6 h-12 text-[#4C434F] hover:text-[#1F1B24] hover:bg-gray-100"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleComplete}
                    disabled={!canProceed()}
                    className="bg-[#B0112D] hover:bg-[#8A0A2A] text-white px-8 h-12 rounded-lg font-semibold tracking-wide shadow-[0_10px_25px_rgba(172,12,53,0.35)] transition-colors"
                  >
                    Finish onboarding
                  </Button>
                </div>
              </div>
            )}
        </div>
      </div>
      )}
    </div>
  );
}
