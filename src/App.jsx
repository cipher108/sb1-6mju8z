import React, { useState } from 'react';
import { Box, Button, VStack, Alert, AlertIcon, Text } from '@chakra-ui/react';
import { Camera } from './components/Camera';
import { ImageUpload } from './components/ImageUpload';
import { compareImages } from './utils/imageComparison';

export default function App() {
  const [referenceImages, setReferenceImages] = useState([]);
  const [selectedImageIds, setSelectedImageIds] = useState([]);
  const [isComparing, setIsComparing] = useState(false);
  const [defectFound, setDefectFound] = useState(false);

  const handleImageUpload = (newImage) => {
    setReferenceImages(prev => [...prev, newImage]);
    setSelectedImageIds(prev => [...prev, newImage.id]); // Auto-select new images
  };

  const handleImageSelect = (imageId, isSelected) => {
    setSelectedImageIds(prev => 
      isSelected 
        ? [...prev, imageId]
        : prev.filter(id => id !== imageId)
    );
  };

  const handleFrame = async (frameData) => {
    if (selectedImageIds.length > 0) {
      const selectedImages = referenceImages
        .filter(img => selectedImageIds.includes(img.id))
        .map(img => img.data);
      
      const hasDefect = await compareImages(selectedImages, frameData);
      setDefectFound(hasDefect);
    }
  };

  return (
    <Box p={8}>
      <VStack spacing={6} align="stretch" width="100%">
        <ImageUpload
          onImageUpload={handleImageUpload}
          referenceImages={referenceImages}
          selectedImages={selectedImageIds}
          onImageSelect={handleImageSelect}
        />

        {selectedImageIds.length === 0 && referenceImages.length > 0 && (
          <Alert status="warning">
            <AlertIcon />
            Please select at least one reference image for comparison
          </Alert>
        )}

        <Button
          onClick={() => setIsComparing(!isComparing)}
          isDisabled={selectedImageIds.length === 0}
          alignSelf="center"
        >
          {isComparing ? 'Stop Detection' : 'Start Detection'}
        </Button>

        {isComparing && (
          <Camera
            isActive={isComparing}
            onFrame={handleFrame}
          />
        )}

        {defectFound && (
          <Alert status="error">
            <AlertIcon />
            Defect detected!
          </Alert>
        )}

        <Text fontSize="sm" color="gray.600" textAlign="center">
          Selected {selectedImageIds.length} of {referenceImages.length} reference images
        </Text>
      </VStack>
    </Box>
  );
}