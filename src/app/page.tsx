'use client';

import { useState } from 'react';
import TopBar from './components/TopBar';
import SearchInput from './components/SearchInput';
import ImageGrid from './components/ImageGrid';

interface GeneratedImage {
  url: string;
}

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (prompt: string) => {
    setIsGenerating(true);
    setShowImages(true);
    setError(null);
    setImages([]); // Clear previous images
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate images');
      }

      if (!data.images || !Array.isArray(data.images)) {
        throw new Error('Invalid response format');
      }

      // Validate and transform image URLs
      const validatedImages = data.images.map((img: any) => {
        if (!img || typeof img.url !== 'string') {
          throw new Error('Invalid image format in response');
        }
        return { url: img.url };
      });

      console.log('Setting images:', validatedImages);
      setImages(validatedImages);
    } catch (error) {
      console.error('Error generating images:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate images');
      setShowImages(false);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-white relative">
      {/* Background dots pattern */}
      <div className="absolute inset-0 w-full h-full" 
        style={{
          backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          opacity: 0.5,
          zIndex: 0
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        <TopBar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <SearchInput onGenerate={handleGenerate} />
          
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}
          
          <ImageGrid 
            isGenerating={isGenerating} 
            showImages={showImages}
            images={images}
          />
        </div>
      </div>
    </main>
  );
}
