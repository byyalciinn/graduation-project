'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ShoppingBag, 
  Store, 
  Shirt, 
  Laptop, 
  Home, 
  Palette, 
  Dumbbell, 
  Sparkles,
  MapPin,
  Bell,
  User,
  Camera,
  CheckCircle2
} from 'lucide-react';

interface OnboardingData {
  role: 'buyer' | 'seller' | null;
  categories: string[];
  location: {
    city: string;
    postalCode: string;
  };
  notifications: boolean;
  profile: {
    photo: string | null;
    bio: string;
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
  const [data, setData] = useState<OnboardingData>({
    role: null,
    categories: [],
    location: { city: '', postalCode: '' },
    notifications: true,
    profile: { photo: null, bio: '' },
  });

  const totalSteps = 4;
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
    // Save onboarding data to API
    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
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
        alert(result.error || 'Failed to complete onboarding');
      }
    } catch (error) {
      console.error('Onboarding error:', error);
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
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-3xl h-screen flex flex-col py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Woopy Logo" width={32} height={32} />
            <h1 className="text-xl font-bold text-gray-900">WOOPY</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-y-auto">
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
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="mb-6">
                      <div className="w-32 h-32 mx-auto bg-green-100 rounded-xl flex items-center justify-center">
                        <ShoppingBag className="w-16 h-16 text-green-600" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">As a buyer</h3>
                    <p className="text-gray-600 text-sm">
                      It's a best option for you to explore or do something for all by yourself. Later, you can create a team workspace, that's easy.
                    </p>
                  </button>

                  <button
                    onClick={() => handleRoleSelect('seller')}
                    className={`p-8 rounded-2xl border-2 transition-all duration-200 ${
                      data.role === 'seller'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="mb-6">
                      <div className="w-32 h-32 mx-auto bg-green-100 rounded-xl flex items-center justify-center">
                        <Store className="w-16 h-16 text-green-600" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">As a seller</h3>
                    <p className="text-gray-600 text-sm">
                      Let's start collaborating with your teammates and unlock the full access of Woopy. Hope you'll enjoy.
                    </p>
                  </button>
                </div>

                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 h-11 rounded-lg font-medium"
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
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mx-auto mb-3">
                          <Icon className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="font-medium text-sm text-center text-gray-900">
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
                    className="px-6 h-11"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 h-11 rounded-lg font-medium"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Location & Notifications */}
            {currentStep === 3 && (
              <div className="flex flex-col items-center justify-center flex-1 max-w-md mx-auto">
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                    Where are you located?
                  </h2>
                  <p className="text-gray-600">
                    Share your location to see the closest sellers and products
                  </p>
                </div>

                <div className="space-y-4 w-full mb-10">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium text-gray-700">
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
                      className="h-11 border-gray-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700">
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
                      className="h-11 border-gray-300"
                    />
                  </div>

                  <div className="flex items-start space-x-3 pt-4">
                    <Checkbox
                      id="notifications"
                      checked={data.notifications}
                      onCheckedChange={(checked: boolean) =>
                        setData({ ...data, notifications: checked })
                      }
                      className="mt-1"
                    />
                    <Label
                      htmlFor="notifications"
                      className="text-sm cursor-pointer text-gray-700"
                    >
                      Get notifications for new listings nearby
                    </Label>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="px-6 h-11"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 h-11 rounded-lg font-medium"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Profile */}
            {currentStep === 4 && (
              <div className="flex flex-col items-center justify-center flex-1 max-w-md mx-auto">
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                    Complete your profile
                  </h2>
                  <p className="text-gray-600">
                    Add a photo and bio to build trust with other users
                  </p>
                </div>

                <div className="space-y-6 w-full mb-10">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">Profile Photo (Optional)</Label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                        {data.profile.photo ? (
                          <Image
                            src={data.profile.photo}
                            alt="Profile"
                            width={80}
                            height={80}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <Camera className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <Button variant="outline" className="flex-1 h-10 border-gray-300">
                        <Camera className="w-4 h-4 mr-2" />
                        Upload Photo
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
                      Short Bio (Optional)
                    </Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself..."
                      value={data.profile.bio}
                      onChange={(e) =>
                        setData({
                          ...data,
                          profile: { ...data.profile, bio: e.target.value },
                        })
                      }
                      className="min-h-24 resize-none border-gray-300"
                      maxLength={150}
                    />
                    <p className="text-xs text-gray-500 text-right">
                      {data.profile.bio.length}/150
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="px-6 h-11"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleComplete}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 h-11 rounded-lg font-medium"
                  >
                    Complete & Start
                  </Button>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
