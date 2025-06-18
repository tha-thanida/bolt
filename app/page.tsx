'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import ContentForm from '@/components/ContentForm';
import AudioPlayer from '@/components/AudioPlayer';

export default function Home() {
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [podcastTitle, setPodcastTitle] = useState<string>('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Create Your AI Podcast
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Generate professional podcast scripts with AI and convert them to high-quality voice using advanced text-to-speech technology.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Content Generator */}
          <div className="space-y-6">
            <ContentForm 
              onAudioGenerated={setAudioUrl}
              onTitleChange={setPodcastTitle}
            />
          </div>

          {/* Right Side - Audio Player & Actions */}
          <div className="space-y-6">
            <AudioPlayer 
              audioUrl={audioUrl}
              podcastTitle={podcastTitle}
            />
          </div>
        </div>
      </main>
    </div>
  );
}