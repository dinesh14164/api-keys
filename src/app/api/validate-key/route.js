import { NextResponse } from 'next/server';
import { apiKeysService } from '../../../../lib/database';

export async function POST(request) {
  try {
    // Parse the request body
    const { apiKey } = await request.json();

    // Validate that apiKey is provided
    if (!apiKey) {
      return NextResponse.json(
        { 
          valid: false, 
          error: 'API key is required' 
        }, 
        { status: 400 }
      );
    }

    // Validate the API key against the database
    const isValid = await apiKeysService.validateApiKey(apiKey);

    return NextResponse.json({
      valid: isValid,
      message: isValid ? 'API key is valid' : 'API key is invalid'
    });

  } catch (error) {
    console.error('Error validating API key:', error);
    
    return NextResponse.json(
      { 
        valid: false, 
        error: 'Internal server error' 
      }, 
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' }, 
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' }, 
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' }, 
    { status: 405 }
  );
} 