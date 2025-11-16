'use client';

import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Space_Grotesk } from 'next/font/google';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { loginSchema } from '@/lib/validations/auth';
import { z } from 'zod';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

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
    <div
      className={`relative min-h-screen flex flex-col lg:flex-row overflow-hidden bg-[#FDFBFB] text-[#1F1B24] ${spaceGrotesk.className}`}
    >
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
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 lg:px-12 bg-white/85 backdrop-blur-xl border-b lg:border-b-0 lg:border-r border-[#E3D7D7] shadow-[0_10px_30px_rgba(191,25,37,0.08)] overflow-y-auto">
        <div className="w-full max-w-md space-y-10">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight leading-[1.15]">
              Giriş yap ve <span className="text-[#AC0C35]">topluluğa</span> katıl
            </h1>
            <p className="text-base text-[#4C434F] font-medium">
              Hesabına erişmek için bilgilerini gir. Hoş geldin!
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-[#AC0C35] bg-[#F8D7DA] border border-[#E9B0C0] rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold tracking-wide">
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
                  className="bg-white/70 border-[#1F1B24]/15 placeholder:text-[#908694] focus:border-[#AC0C35] focus:ring-[#AC0C35] text-base"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-semibold tracking-wide">
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-semibold text-[#AC0C35] hover:text-[#8A0A2A] transition-colors"
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
                    className="bg-white/70 border-[#1F1B24]/15 placeholder:text-[#908694] focus:border-[#AC0C35] focus:ring-[#AC0C35] pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B5C6B] hover:text-[#1F1B24] transition-colors"
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
              className="w-full h-12 font-semibold tracking-wide text-white bg-gradient-to-r from-[#AC0C35] via-[#8A0A2A] to-[#6A081F] hover:opacity-90 transition-opacity shadow-[0_10px_25px_rgba(172,12,53,0.35)]"
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
              className="w-full h-12 border border-[#1F1B24]/20 hover:bg-white text-[#1F1B24] font-semibold shadow-[0_6px_20px_rgba(0,0,0,0.06)]"
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
            <div className="text-center text-sm text-[#4C434F]">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="font-semibold text-[#AC0C35] hover:text-[#8A0A2A] underline-offset-4"
              >
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Background Image */}
      <div className="relative hidden lg:flex flex-1 items-center justify-center overflow-hidden">
        <Image
          src="/login-page-right-background.jpg"
          alt="Login Background"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
