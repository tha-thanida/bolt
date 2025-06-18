'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, Download, Share2, Volume2, Facebook, Twitter } from 'lucide-react';



interface AudioPlayerProps {
  audioUrl: string;
  podcastTitle: string;
}

export default function AudioPlayer({ audioUrl, podcastTitle }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
    };
  }, [audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, [audioUrl]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `${podcastTitle || 'podcast'}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || duration === 0) return;

    const rect = (e.currentTarget).getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    audio.currentTime = newTime;
  };

  const handleShare = (platform: string) => {
    const shareText = `Check out my AI-generated podcast: ${podcastTitle}`;
    const shareUrl = window.location.href;

    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    } else {
      navigator.clipboard.writeText(`${shareText} - ${shareUrl}`);
      alert('Link copied to clipboard!');
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Volume2 className="h-5 w-5 text-orange-600" />
            <span>Audio Player</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {audioUrl ? (
            <>
              <audio ref={audioRef} src={audioUrl} preload="metadata" />

              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2">{podcastTitle || 'Your Podcast'}</h3>

                <div className="flex items-center justify-center space-x-4 mb-4">
                  <Button
                    onClick={togglePlayPause}
                    size="lg"
                    className="rounded-full w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <div
                    className="w-full bg-gray-200 rounded-full h-2 cursor-pointer"
                    onClick={handleSeek}
                  >
                    <div
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Volume2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Generate your podcast to see the audio player</p>
            </div>
          )}
        </CardContent>
      </Card>

      {audioUrl && (
        <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <Share2 className="h-5 w-5 text-pink-600" />
              <span>Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={handleDownload}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Download className="mr-2 h-4 w-4" />
              Download File
            </Button>

            <div className="flex space-x-2">
              <Button
                onClick={() => handleShare('facebook')}
                variant="outline"
                className="flex-1 border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                <Facebook className="mr-2 h-4 w-4" />
                Facebook
              </Button>

              <Button
                onClick={() => handleShare('twitter')}
                variant="outline"
                className="flex-1 border-sky-500 text-sky-600 hover:bg-sky-50"
              >
                <Twitter className="mr-2 h-4 w-4" />
                Twitter
              </Button>
            </div>

            <Button
              onClick={() => handleShare('clipboard')}
              variant="outline"
              className="w-full border-green-500 text-green-600 hover:bg-green-50"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
