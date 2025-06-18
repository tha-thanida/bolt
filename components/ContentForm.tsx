'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { FileText, Mic, Loader2, Sparkles } from 'lucide-react';
import ScriptDisplay from './ScriptDisplay';
import VoiceOptions from './VoiceOptions';

interface ContentFormProps {
  onAudioGenerated: (url: string) => void;
  onTitleChange: (title: string) => void;
}

export default function ContentForm({ onAudioGenerated, onTitleChange }: ContentFormProps) {
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [script, setScript] = useState('');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  
  // Voice options
  const [speakerId, setSpeakerId] = useState('1');
  const [volume, setVolume] = useState([0.8]);
  const [speed, setSpeed] = useState([1.0]);
  const [typeMedia, setTypeMedia] = useState('mp3');

  const handleTitleChange = (value: string) => {
    setTitle(value);
    onTitleChange(value);
  };

  const generateScript = async () => {
    if (!prompt.trim()) return;
    
    setIsGeneratingScript(true);
    try {
      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, title }),
      });
      
      const data = await response.json();
      if (data.success) {
        setScript(data.script);
      } else {
        console.error('Error generating script:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const generateVoice = async () => {
    if (!script.trim()) return;
    
    setIsGeneratingVoice(true);
    try {
      const response = await fetch('/api/generate-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: script,
          speaker: speakerId,
          volume: volume[0],
          speed: speed[0],
          type_media: typeMedia,
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        onAudioGenerated(data.audioUrl);
      } else {
        console.error('Error generating voice:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsGeneratingVoice(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-purple-600" />
            <span>Podcast Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Podcast Title</Label>
            <Input
              id="title"
              placeholder="Enter your podcast title..."
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="prompt">Prompt Your Podcast Idea</Label>
            <Textarea
              id="prompt"
              placeholder="Describe your podcast idea, topic, or specific content you want to discuss..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="mt-1"
            />
          </div>
          
          <Button 
            onClick={generateScript}
            disabled={!prompt.trim() || isGeneratingScript}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isGeneratingScript ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Script...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Script
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Script Display */}
      {script && (
        <ScriptDisplay script={script} onScriptChange={setScript} />
      )}

      {/* Voice Options */}
      {script && (
        <VoiceOptions
          speakerId={speakerId}
          setSpeakerId={setSpeakerId}
          volume={volume}
          setVolume={setVolume}
          speed={speed}
          setSpeed={setSpeed}
          typeMedia={typeMedia}
          setTypeMedia={setTypeMedia}
          onGenerateVoice={generateVoice}
          isGenerating={isGeneratingVoice}
        />
      )}
    </div>
  );
}