'use client';

import { useState } from 'react';

interface SearchInputProps {
  onGenerate: (prompt: string) => void;
}

export default function SearchInput({ onGenerate }: SearchInputProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt);
      // Keep the prompt text after submission
      // setPrompt('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mb-12">
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your image here..."
        className="w-full px-6 py-4 text-lg rounded-xl border-2 border-purple-200 
                 bg-purple-50 focus:border-purple-300 focus:ring-2 focus:ring-purple-200 
                 focus:outline-none transition-all duration-200 ease-in-out
                 placeholder-purple-300"
      />
    </form>
  );
} 