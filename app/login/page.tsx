'use client';

import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { loginSchema } from '@/lib/validations/auth';
import { z } from 'zod';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const startTime = Date.now();
    console.log('\n🔵 [LOGIN] Login process started');

    try {
      // Validate form data
      console.log('🔍 [LOGIN] Validating form data...');
      console.log(`📧 [LOGIN] Email: ${formData.email}`);
      const validatedData = loginSchema.parse(formData);
      console.log('✅ [LOGIN] Form validation passed');

      // Attempt sign in
      console.log('🔐 [LOGIN] Attempting to sign in with credentials...');
      const result = await signIn('credentials', {
        email: validatedData.email,
        password: validatedData.password,
        redirect: false,
      });

      if (result?.error) {
        console.error('❌ [LOGIN] Sign in failed:', result.error);
        console.log(`⏱️  [LOGIN] Process failed in ${Date.now() - startTime}ms\n`);
        setError('Invalid email or password');
        setIsLoading(false);
      } else {
        console.log('✅ [LOGIN] Sign in successful');
        
        // Fetch user session to check onboarding status
        console.log('🔍 [LOGIN] Fetching user session...');
        const response = await fetch('/api/auth/session');
        const session = await response.json();
        console.log('✅ [LOGIN] Session fetched successfully');
        console.log(`👤 [LOGIN] User ID: ${session?.user?.id}`);
        console.log(`📧 [LOGIN] User Email: ${session?.user?.email}`);
        console.log(`🎭 [LOGIN] User Role: ${session?.user?.role || 'not set'}`);
        console.log(`✔️  [LOGIN] Onboarding Completed: ${session?.user?.onboardingCompleted}`);
        
        // Redirect based on onboarding status and role
        let redirectPath = '/admin-dashboard';
        if (!session?.user?.onboardingCompleted) {
          redirectPath = '/onboarding';
          console.log('🔄 [LOGIN] Redirecting to onboarding (not completed)');
        } else if (session?.user?.role === 'buyer') {
          redirectPath = '/buyer-dashboard';
          console.log('🔄 [LOGIN] Redirecting to buyer dashboard');
        } else if (session?.user?.role === 'seller') {
          redirectPath = '/seller-dashboard';
          console.log('🔄 [LOGIN] Redirecting to seller dashboard');
        } else {
          console.log('🔄 [LOGIN] Redirecting to admin dashboard');
        }
        
        console.log(`⏱️  [LOGIN] Total process time: ${Date.now() - startTime}ms\n`);
        router.push(redirectPath);
        router.refresh();
      }
    } catch (error) {
      console.error('❌ [LOGIN] Error occurred:', error);
      
      if (error instanceof z.ZodError) {
        console.error('🔴 [LOGIN] Validation error:', error.issues);
        setError(error.issues[0].message);
      } else {
        console.error('🔴 [LOGIN] Unexpected error:', error);
        setError('Something went wrong. Please try again.');
      }
      
      console.log(`⏱️  [LOGIN] Process failed in ${Date.now() - startTime}ms\n`);
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center bg-white p-8 overflow-y-auto">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image 
              src="/logo.png" 
              alt="Woopy Logo" 
              width={40} 
              height={40}
              className="object-contain"
            />
            <span className="text-2xl font-bold text-gray-900">Woopy</span>
          </div>

          {/* Header */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-gray-900">Log in to your account</h1>
            <p className="text-base font-medium text-gray-600">
              Welcome back! Please enter your details.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-900">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="bg-white border-gray-300 focus:border-green-600 focus:ring-green-600"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-900 font-medium">
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="bg-white border-gray-300 focus:border-green-600 focus:ring-green-600 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white h-11 font-semibold shadow-sm"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            {/* Google Sign In Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 border-gray-300 hover:bg-gray-50 font-semibold shadow-sm"
              disabled={isLoading}
              onClick={() => signIn('google')}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign up with Google
            </Button>

            {/* Sign up link */}
            <div className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="text-green-600 hover:text-green-700 font-medium underline"
              >
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-green-50 via-green-100 to-emerald-100 items-center justify-center p-8 overflow-hidden">
        <div className="max-w-xl w-full space-y-6">
          {/* Header Text */}
          <div className="space-y-4">
            <h2 className="text-3xl xl:text-4xl font-extrabold leading-[1.15] tracking-tight text-gray-900">
              Welcome to <span className="text-green-600 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Woopy</span>.
              <br />
              <span className="text-gray-800">The Largest Wholesale Marketplace.</span>
            </h2>
            <p className="text-sm xl:text-base text-gray-600 leading-relaxed max-w-lg font-normal">
              One-stop wholesale business solution of imported products. We ensure product quality, on time delivery and hassle free service.
            </p>
            
            {/* User Stats */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden bg-gray-200">
                  <Image
                    src="https://i.pravatar.cc/150?img=1"
                    alt="User 1"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden bg-gray-200">
                  <Image
                    src="https://i.pravatar.cc/150?img=5"
                    alt="User 2"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden bg-gray-200">
                  <Image
                    src="https://i.pravatar.cc/150?img=9"
                    alt="User 3"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden bg-gray-200">
                  <Image
                    src="https://i.pravatar.cc/150?img=12"
                    alt="User 4"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <p className="text-gray-700 font-semibold text-sm xl:text-base">
                20k+ buyers joined with us, now it&apos;s your turn
              </p>
            </div>
          </div>

          {/* Illustration */}
          <div className="relative group">
            <div className="absolute inset-0 bg-white/50 backdrop-blur-md rounded-2xl shadow-xl transition-all duration-300 group-hover:bg-white/60"></div>
            <div className="relative p-6">
              <Image
                src="/illustrion.png"
                alt="E-commerce Illustration"
                width={500}
                height={350}
                className="w-full h-auto object-contain drop-shadow-xl transition-transform duration-300 group-hover:scale-[1.02]"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
