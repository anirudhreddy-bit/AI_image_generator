import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const requestData = await req.json();
    const falUrl = 'https://fal.run/fal-ai/flux-pro/v1.1-ultra';

    const response = await fetch(falUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Key 4a8081e0-a86b-46aa-86be-c8b53bd3d1bf:2cc6f06a2b2a9340fa9854c56d7ef702`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        prompt: requestData.prompt,
        image_size: "square_hd",
        num_images: requestData.num_images || 4,
        scheduler: "dpmpp_2m",
        num_inference_steps: 50,
        guidance_scale: 7.5,
        negative_prompt: "blurry, low quality, distorted"
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Fal.ai API error:', errorText);
      throw new Error(`Fal.ai API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Raw Fal.ai response:', JSON.stringify(data, null, 2));
    
    // Check if data.images exists and is in the expected format
    if (!data.images || !Array.isArray(data.images)) {
      console.error('Invalid response format from Fal.ai:', data);
      throw new Error('Invalid response format from Fal.ai API');
    }

    // Log the image URLs we're processing
    console.log('Processing image URLs:', data.images);

    // Transform the response, ensuring we have valid URLs
    const transformedData = {
      images: data.images.map((image: any) => {
        // Handle both string URLs and object formats
        const imageUrl = typeof image === 'string' ? image : image.url;
        console.log('Processing image URL:', imageUrl);
        return { url: imageUrl };
      })
    };

    // Log the final transformed data
    console.log('Transformed response:', JSON.stringify(transformedData, null, 2));

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to proxy request to fal.ai' },
      { status: 500 }
    );
  }
} 