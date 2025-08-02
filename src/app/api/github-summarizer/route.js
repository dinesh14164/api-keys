import { NextResponse } from 'next/server';
import { apiKeysService } from '../../../../lib/database';
import { fetchGithubReadme, summarizeGithubReadme } from '../../../lib/chain';

export async function POST(request) {
  try {
    // Parse the request body
    const { githubUrl } = await request.json();
    // Get API key from x-api-key header if not present in body
    let apiKey = request.headers.get('x-api-key');

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

    if (!isValid) {
      return NextResponse.json({
        valid: false,
        message: 'Invalid API key'
      }, { status: 401 });
    }

    // Validate that githubUrl is provided
    if (!githubUrl) {
      return NextResponse.json(
        { 
          valid: false, 
          error: 'GitHub URL is required' 
        }, 
        { status: 400 }
      );
    }

    // Fetch the README content
    const readmeContent = await fetchGithubReadme(githubUrl);
    
    if (!readmeContent) {
      return NextResponse.json({
        valid: false,
        error: 'Could not fetch README from the provided GitHub URL'
      }, { status: 404 });
    }

    // Summarize the README content
    const summary = await summarizeGithubReadme(readmeContent);

    return NextResponse.json({
      valid: true,
      message: 'GitHub repository summarized successfully',
      data: summary
    });

  } catch (error) {
    console.error('Error in GitHub summarizer:', error);
    
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

