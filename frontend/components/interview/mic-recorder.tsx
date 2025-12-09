'use client';

import { Button } from '@/components/ui/button';
import { useAudioRecorder } from '@/lib/hooks/use-audio-recorder';
import { Mic, Square, CircleDot } from 'lucide-react';

interface MicRecorderProps {
  onStateChange: (state: 'idle' | 'recording') => void;
  onRecordingComplete: (audioDataUri: string) => void;
  disabled?: boolean;
}

export default function MicRecorder({ onStateChange, onRecordingComplete, disabled = false }: MicRecorderProps) {
  const {
    isRecording,
    startRecording,
    stopRecording,
    recordingTime,
  } = useAudioRecorder({ onRecordingComplete });

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
      onStateChange('idle');
    } else {
      startRecording();
      onStateChange('recording');
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Button
        onClick={handleToggleRecording}
        size="lg"
        variant={isRecording ? 'destructive' : 'default'}
        className="rounded-full w-24 h-24 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        disabled={disabled}
      >
        {isRecording ? (
          <Square className="h-10 w-10" />
        ) : (
          <Mic className="h-10 w-10" />
        )}
      </Button>
      <div className="text-lg font-mono text-muted-foreground flex items-center gap-2">
        {isRecording && <CircleDot className="h-4 w-4 text-destructive animate-pulse" />}
        <span>{formatTime(recordingTime)}</span>
      </div>
      <p className="text-sm text-muted-foreground">
        {isRecording ? "Click to stop recording" : "Click the button to start your answer"}
      </p>
    </div>
  );
}
