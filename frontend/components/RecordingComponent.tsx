// frontend/components/RecordingComponent.tsx (Create this file)
// NOTE: This logic assumes you have run "npx shadcn-ui@latest add button"

'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { blobToBase64 } from '@/lib/audioHelpers';
// import { sendAudioForTranscription } from '@/services/api'; // Commented out to avoid circular dependency errors

interface RecordingProps {
  onRecordingComplete: (base64Audio: string) => void;
  disabled: boolean;
}

const RecordingComponent: React.FC<RecordingProps> = ({ onRecordingComplete, disabled }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const base64String = await blobToBase64(audioBlob);
        
        // Stop all tracks to release the microphone immediately
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
        
        onRecordingComplete(base64String); // Pass data up to parent
      };

      recorder.start();
      setIsRecording(true);

    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access denied or failed.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {isRecording ? (
        <Button 
          variant="destructive" 
          size="lg" 
          onClick={stopRecording}
          disabled={disabled}
          className="w-full animate-pulse"
        >
          Stop & Submit Answer
        </Button>
      ) : (
        <Button 
          variant="default" 
          size="lg" 
          onClick={startRecording}
          disabled={disabled}
          className="w-full"
        >
          Start Recording
        </Button>
      )}
      {isRecording && <p className="text-sm text-red-500 font-medium">Recording in progress...</p>}
    </div>
  );
};

export default RecordingComponent;