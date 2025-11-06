import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { onboardingSchema } from '@/lib/validations/auth';
import { z } from 'zod';

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  console.log('\n🔵 [ONBOARDING] Onboarding process started');
  
  try {
    // Check authentication
    console.log('🔍 [ONBOARDING] Checking user authentication...');
    const session = await auth();

    if (!session?.user?.email) {
      console.error('❌ [ONBOARDING] Unauthorized - No session found');
      console.log(`⏱️  [ONBOARDING] Process failed in ${Date.now() - startTime}ms\n`);
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.log('✅ [ONBOARDING] User authenticated');
    console.log(`📧 [ONBOARDING] User Email: ${session.user.email}`);

    // Parse request data
    console.log('📥 [ONBOARDING] Parsing request data...');
    const data = await req.json();
    console.log('✅ [ONBOARDING] Request data parsed');
    
    // Validate onboarding data
    console.log('🔍 [ONBOARDING] Validating onboarding data...');
    console.log(`🎭 [ONBOARDING] Role: ${data.role}`);
    console.log(`📂 [ONBOARDING] Categories: ${data.categories?.join(', ')}`);
    console.log(`📍 [ONBOARDING] City: ${data.location?.city}`);
    
    const validatedData = onboardingSchema.parse({
      role: data.role,
      categories: data.categories,
      city: data.location.city,
      postalCode: data.location.postalCode || '',
      notifications: data.notifications,
      bio: data.profile?.bio || '',
    });
    console.log('✅ [ONBOARDING] Data validation passed');

    // Get user
    console.log('🔍 [ONBOARDING] Fetching user from database...');
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      console.error('❌ [ONBOARDING] User not found in database');
      console.log(`⏱️  [ONBOARDING] Process failed in ${Date.now() - startTime}ms\n`);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    console.log('✅ [ONBOARDING] User found');
    console.log(`👤 [ONBOARDING] User ID: ${user.id}`);

    // Update user with onboarding data
    console.log('💾 [ONBOARDING] Updating user with onboarding data...');
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        role: validatedData.role,
        categories: validatedData.categories,
        city: validatedData.city,
        postalCode: validatedData.postalCode || null,
        notifications: validatedData.notifications,
        bio: validatedData.bio || null,
        onboardingCompleted: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        onboardingCompleted: true,
      },
    });
    console.log('✅ [ONBOARDING] User updated successfully');
    console.log(`🎭 [ONBOARDING] Final Role: ${updatedUser.role}`);
    console.log(`✔️  [ONBOARDING] Onboarding Completed: ${updatedUser.onboardingCompleted}`);
    console.log(`⏱️  [ONBOARDING] Total process time: ${Date.now() - startTime}ms\n`);

    return NextResponse.json({ 
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error('❌ [ONBOARDING] Error occurred:', error);
    
    if (error instanceof z.ZodError) {
      console.error('🔴 [ONBOARDING] Validation error:', error.issues);
      console.log(`⏱️  [ONBOARDING] Process failed in ${Date.now() - startTime}ms\n`);
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('🔴 [ONBOARDING] Unexpected error:', error);
    console.log(`⏱️  [ONBOARDING] Process failed in ${Date.now() - startTime}ms\n`);
    return NextResponse.json(
      { error: 'Failed to save onboarding data' },
      { status: 500 }
    );
  }
}
