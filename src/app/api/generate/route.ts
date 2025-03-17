import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    console.log('Generating images for prompt:', prompt);

    const response = await fetch('http://localhost:3000/api/proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        num_images: 4
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate images');
    }

    const result = await response.json();
    console.log('API Response:', result);

    if (!result.images || !Array.isArray(result.images)) {
      throw new Error('Invalid response format from API');
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate images' },
      { status: 500 }
    );
  }
} 