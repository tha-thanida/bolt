'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Settings, Mic, Loader2 } from 'lucide-react';
import { staticSpeakers} from'../app/data/speakers';

interface Speaker {
  id: string;
  name: string;
}

interface VoiceOptionsProps {
  speakerId: string;
  setSpeakerId: (id: string) => void;
  volume: number[];
  setVolume: (volume: number[]) => void;
  speed: number[];
  setSpeed: (speed: number[]) => void;
  typeMedia: string;
  setTypeMedia: (type: string) => void;
  onGenerateVoice: () => void;
  isGenerating: boolean;
}

export default function VoiceOptions({
  speakerId,
  setSpeakerId,
  volume,
  setVolume,
  speed,
  setSpeed,
  typeMedia,
  setTypeMedia,
  onGenerateVoice,
  isGenerating,
}: VoiceOptionsProps) {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);


  useEffect(() => {
    setSpeakers(staticSpeakers);
  }, []);

  return (
    <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5 text-blue-600" />
          <span>Voice Configuration</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Speaker</Label>
          <Select value={speakerId} onValueChange={setSpeakerId}>
            <SelectTrigger className="mt-1" aria-label="Select speaker">
              <SelectValue placeholder="Select speaker" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {speakers.map((speaker) => (
                <SelectItem key={speaker.id} value={speaker.id}>
                  {speaker.name}
                </SelectItem>
              ))}
              {speakers.length === 0 && (
                <div className="text-gray-500 p-2 text-sm">No speakers available</div>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* <div>
          <Label>Volume: {volume.length ? volume[0].toFixed(1) : '0.0'}</Label>
          <Slider
            value={volume}
            onValueChange={setVolume}
            max={1}
            min={0.1}
            step={0.1}
            className="mt-2"
          />
        </div>

        <div>
          <Label>Speed: {speed.length ? speed[0].toFixed(1) : '0.0'}x</Label>
          <Slider
            value={speed}
            onValueChange={setSpeed}
            max={1.5}
            min={0.5}
            step={0.1}
            className="mt-2"
          />
        </div>

        <div>
          <Label>Media Type</Label>
          <Select value={typeMedia} onValueChange={setTypeMedia}>
            <SelectTrigger className="mt-1" aria-label="Select media type">
              <SelectValue placeholder="Select media type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mp3">MP3</SelectItem>
              <SelectItem value="m4a">M4A</SelectItem>
              <SelectItem value="wav">WAV</SelectItem>
            </SelectContent>
          </Select>
        </div> */}

        <Button 
          onClick={onGenerateVoice}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Voice...
            </>
          ) : (
            <>
              <Mic className="mr-2 h-4 w-4" />
              Generate Voice
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
