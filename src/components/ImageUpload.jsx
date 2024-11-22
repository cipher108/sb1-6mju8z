import React from 'react';
import { Box, Button, Image, Text, SimpleGrid, Checkbox } from '@chakra-ui/react';

export function ImageUpload({ onImageUpload, referenceImages, selectedImages, onImageSelect }) {
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageUpload({
          id: Date.now() + Math.random(),
          name: file.name,
          data: e.target.result
        });
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <Box width="100%">
      <Box mb={4}>
        <Button as="label" cursor="pointer">
          Upload Reference Images
          <input
            type="file"
            hidden
            accept="image/*"
            multiple
            onChange={handleImageUpload}
          />
        </Button>
      </Box>

      {referenceImages.length > 0 && (
        <Box>
          <Text mb={2} fontWeight="bold">Reference Images:</Text>
          <SimpleGrid columns={[1, 2, 3]} spacing={4}>
            {referenceImages.map((image) => (
              <Box 
                key={image.id} 
                borderWidth="1px" 
                borderRadius="lg" 
                p={2}
                position="relative"
              >
                <Checkbox
                  position="absolute"
                  top={2}
                  right={2}
                  isChecked={selectedImages.includes(image.id)}
                  onChange={(e) => onImageSelect(image.id, e.target.checked)}
                  zIndex={1}
                />
                <Image 
                  src={image.data} 
                  maxH="200px" 
                  mx="auto"
                />
                <Text fontSize="sm" mt={1} textAlign="center">
                  {image.name}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      )}
    </Box>
  );
}