'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Space_Grotesk } from 'next/font/google';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { registerSchema } from '@/lib/validations/auth';
import { z } from 'zod';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const startTime = Date.now();
    console.log('\n🔵 [REGISTER-PAGE] Registration process started');

    try {
      // Validate form data
      console.log('🔍 [REGISTER-PAGE] Validating form data...');
      console.log(`📧 [REGISTER-PAGE] Email: ${formData.email}`);
      console.log(`👤 [REGISTER-PAGE] Name: ${formData.name}`);
      const validatedData = registerSchema.parse(formData);
      console.log('✅ [REGISTER-PAGE] Form validation passed');

      // Register user
      console.log('📤 [REGISTER-PAGE] Sending registration request to API...');
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: validatedData.name,
          email: validatedData.email,
          password: validatedData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ [REGISTER-PAGE] Registration failed:', data.error);
        console.log(`⏱️  [REGISTER-PAGE] Process failed in ${Date.now() - startTime}ms\n`);
        setError(data.error || 'Something went wrong');
        setIsLoading(false);
        return;
      }

      console.log('✅ [REGISTER-PAGE] Registration successful');
      console.log(`👤 [REGISTER-PAGE] User ID: ${data.user.id}`);
      console.log(`📧 [REGISTER-PAGE] User Email: ${data.user.email}`);

      // Auto-login after successful registration
      console.log('🔐 [REGISTER-PAGE] Attempting auto-login...');
      const signInResult = await signIn('credentials', {
        email: validatedData.email,
        password: validatedData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        console.error('❌ [REGISTER-PAGE] Auto-login failed:', signInResult.error);
        console.log(`⏱️  [REGISTER-PAGE] Process completed in ${Date.now() - startTime}ms\n`);
        setError('Registration successful but login failed. Please login manually.');
        setIsLoading(false);
        return;
      }

      console.log('✅ [REGISTER-PAGE] Auto-login successful');
      console.log('🔄 [REGISTER-PAGE] Redirecting to onboarding...');
      console.log(`⏱️  [REGISTER-PAGE] Total process time: ${Date.now() - startTime}ms\n`);

      // Redirect to onboarding page
      router.push('/onboarding');
    } catch (error) {
      console.error('❌ [REGISTER-PAGE] Error occurred:', error);
      
      if (error instanceof z.ZodError) {
        console.error('🔴 [REGISTER-PAGE] Validation error:', error.issues);
        setError(error.issues[0].message);
      } else {
        console.error('🔴 [REGISTER-PAGE] Unexpected error:', error);
        setError('Something went wrong. Please try again.');
      }
      
      console.log(`⏱️  [REGISTER-PAGE] Process failed in ${Date.now() - startTime}ms\n`);
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
      className={`min-h-screen flex flex-col lg:flex-row overflow-hidden bg-[#FDFBFB] text-[#1F1B24] ${spaceGrotesk.className}`}
    >
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 lg:px-12 bg-white/85 backdrop-blur-xl border-b lg:border-b-0 lg:border-r border-[#E3D7D7] shadow-[0_10px_30px_rgba(172,12,53,0.12)] overflow-y-auto">
        <div className="w-full max-w-md space-y-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image 
              src="/logo.png" 
              alt="Woopy Logo" 
              width={40} 
              height={40}
              className="object-contain"
            />
            <span className="text-2xl font-semibold tracking-tight">Woopy</span>
          </div>

          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight leading-[1.15]">
              Create an account and <span className="text-[#AC0C35]">get started</span>
            </h1>
            <p className="text-base text-[#4C434F] font-medium">
              Join us! Enter your information so we can begin.
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
                <Label htmlFor="name" className="text-sm font-semibold tracking-wide">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="bg-white/70 border-[#1F1B24]/15 placeholder:text-[#908694] focus:border-[#AC0C35] focus:ring-[#AC0C35] text-base"
                />
              </div>

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
                <Label htmlFor="password" className="text-sm font-semibold tracking-wide">
                  Password
                </Label>
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold tracking-wide">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="bg-white/70 border-[#1F1B24]/15 placeholder:text-[#908694] focus:border-[#AC0C35] focus:ring-[#AC0C35] pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B5C6B] hover:text-[#1F1B24] transition-colors"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
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
              className="w-full h-12 font-semibold tracking-wide text-white bg-[#B0112D] hover:bg-[#8A0A2A] transition-colors shadow-[0_10px_25px_rgba(172,12,53,0.35)]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>

            {/* Google Sign Up Button */}
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

            {/* Sign in link */}
            <div className="text-center text-sm text-[#4C434F]">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold text-[#AC0C35] hover:text-[#8A0A2A] underline-offset-4"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Background Image */}
      <div className="relative hidden lg:flex flex-1 items-center justify-center overflow-hidden">
        <Image
          src="/login-page-right-background.jpg"
          alt="Register Background"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
