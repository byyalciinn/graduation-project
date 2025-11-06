import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(req: Request) {
  const startTime = Date.now();
  console.log('\n🔵 [REGISTER] Registration process started');
  
  try {
    // Parse request body
    console.log('📥 [REGISTER] Parsing request body...');
    const body = await req.json();
    console.log('✅ [REGISTER] Request body parsed successfully');
    
    // Validate input
    console.log('🔍 [REGISTER] Validating input data...');
    console.log(`📧 [REGISTER] Email: ${body.email}`);
    console.log(`👤 [REGISTER] Name: ${body.name}`);
    
    const { name, email, password } = registerSchema.parse(body);
    console.log('✅ [REGISTER] Input validation passed');

    // Check if user already exists
    console.log('🔍 [REGISTER] Checking for existing user...');
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('❌ [REGISTER] User already exists with email:', email);
      console.log(`⏱️  [REGISTER] Process completed in ${Date.now() - startTime}ms\n`);
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }
    console.log('✅ [REGISTER] No existing user found');

    // Hash password
    console.log('🔐 [REGISTER] Hashing password...');
    const hashedPassword = await hash(password, 12);
    console.log('✅ [REGISTER] Password hashed successfully');

    // Create user
    console.log('💾 [REGISTER] Creating user in database...');
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    console.log('✅ [REGISTER] User created successfully');
    console.log(`👤 [REGISTER] User ID: ${user.id}`);
    console.log(`📧 [REGISTER] User Email: ${user.email}`);
    console.log(`⏱️  [REGISTER] Total process time: ${Date.now() - startTime}ms\n`);

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ [REGISTER] Error occurred:', error);
    
    if (error instanceof z.ZodError) {
      console.error('🔴 [REGISTER] Validation error:', error.issues);
      console.log(`⏱️  [REGISTER] Process failed in ${Date.now() - startTime}ms\n`);
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('🔴 [REGISTER] Unexpected error:', error);
    console.log(`⏱️  [REGISTER] Process failed in ${Date.now() - startTime}ms\n`);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
