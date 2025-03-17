'use client';

import { useState } from 'react';

interface ImageGridProps {
  isGenerating: boolean;
  showImages: boolean;
  images: Array<{ url: string }>;
}

export default function ImageGrid({ isGenerating, showImages, images }: ImageGridProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [downloadedIndex, setDownloadedIndex] = useState<number | null>(null);

  if (!showImages) {
    return null;
  }

  // Use actual images if available, otherwise use placeholders
  const placeholderImages = Array(4).fill(null);
  const displayImages = images.length > 0 ? images : placeholderImages;

  const handleCopy = async (url: string, index: number) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = async (url: string, index: number) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `generated-image-${index + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      setDownloadedIndex(index);
      setTimeout(() => setDownloadedIndex(null), 1500);
    } catch (err) {
      console.error('Failed to download:', err);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {displayImages.map((image, index) => (
        <div
          key={index}
          className="aspect-square rounded-lg overflow-hidden relative transition-all duration-500 ease-in-out group"
        >
          {/* Base image/placeholder */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-purple-50 to-gray-100"
          />
          
          {/* Loading overlay - only shown during generation */}
          {isGenerating && (
            <div className="absolute inset-0 backdrop-blur-sm bg-white/30 
                          flex items-center justify-center animate-fade-in">
              <div className="relative">
                {/* Spinning circle */}
                <div className="w-12 h-12 border-4 border-purple-200 rounded-full 
                            border-t-purple-500 animate-spin" />
                
                {/* Center dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                </div>
              </div>
            </div>
          )}

          {/* Generated image or placeholder */}
          {!isGenerating && (
            image?.url ? (
              <>
                <img 
                  src={image.url} 
                  alt={`Generated image ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover animate-fade-in"
                />
                {/* Action buttons */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {/* Copy button */}
                  <button
                    onClick={() => handleCopy(image.url, index)}
                    className="p-2 rounded-full bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm
                             transform transition-all duration-200 hover:scale-110 active:scale-95"
                  >
                    <svg
                      className={`w-5 h-5 ${copiedIndex === index ? 'text-green-500' : 'text-gray-700'}`}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {copiedIndex === index ? (
                        <path d="M5 13l4 4L19 7" />
                      ) : (
                        <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      )}
                    </svg>
                  </button>
                  {/* Download button */}
                  <button
                    onClick={() => handleDownload(image.url, index)}
                    className="p-2 rounded-full bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm
                             transform transition-all duration-200 hover:scale-110 active:scale-95"
                  >
                    <svg
                      className={`w-5 h-5 ${downloadedIndex === index ? 'text-green-500' : 'text-gray-700'}`}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {downloadedIndex === index ? (
                        <path d="M5 13l4 4L19 7" />
                      ) : (
                        <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      )}
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-gray-200 
                          animate-fade-in flex items-center justify-center text-purple-400">
                <svg
                  className="w-12 h-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )
          )}
        </div>
      ))}
    </div>
  );
} 