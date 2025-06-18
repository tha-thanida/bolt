import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, speaker = "1", volume = 1, speed = 1, type_media = "mp3" } = await request.json();
    
    const apiKey = process.env.BOTNOI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        success: false, 
        error: 'Botnoi API key not configured' 
      });
    }

    const payload = {
      text,
      speaker,
      volume,
      speed,
      type_media,
      save_file: true,
      language: 'th'
    };

    const response = await fetch('https://api-voice.botnoi.ai/openapi/v1/generate_audio', {
      method: 'POST',
      headers: {
        'Botnoi-Token': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    console.log('Botnoi API response:', data);

    if (response.ok && data.success) {
      return NextResponse.json({ 
        success: true, 
        audioUrl: data.audio_url || data.file_url 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: data.message || 'Failed to generate voice' 
      });
    }
  } catch (error) {
    console.error('Error generating voice:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}
