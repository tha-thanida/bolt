'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollText } from 'lucide-react';

interface ScriptDisplayProps {
  script: string;
  onScriptChange: (script: string) => void;
}

export default function ScriptDisplay({ script, onScriptChange }: ScriptDisplayProps) {
  return (
    <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <ScrollText className="h-5 w-5 text-green-600" />
          <span>Generated Script</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={script}
          onChange={(e) => onScriptChange(e.target.value)}
          rows={8}
          className="resize-none"
          placeholder="Your generated script will appear here..."
        />
      </CardContent>
    </Card>
  );
}