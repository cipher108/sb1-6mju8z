import React, { useRef, useEffect } from 'react';
import { Box } from '@chakra-ui/react';

export function Camera({ isActive, onFrame }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    let animationFrame;
    
    const captureFrame = () => {
      if (videoRef.current && isActive) {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0);
        onFrame(canvas.toDataURL());
      }
      
      if (isActive) {
        animationFrame = requestAnimationFrame(captureFrame);
      }
    };

    if (isActive) {
      startCamera();
      captureFrame();
    } else {
      stopCamera();
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      stopCamera();
    };
  }, [isActive, onFrame]);

  return (
    <Box>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ maxWidth: '100%', maxHeight: '400px' }}
      />
    </Box>
  );
}