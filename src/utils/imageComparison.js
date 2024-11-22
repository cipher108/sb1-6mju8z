export async function compareImages(referenceImagesSrc, currentImageSrc) {
  const compareWithSingleImage = async (refSrc, currentSrc) => {
    return new Promise((resolve) => {
      const refImg = new Image();
      const currentImg = new Image();
      
      refImg.onload = () => {
        currentImg.onload = () => {
          const canvas1 = document.createElement('canvas');
          const canvas2 = document.createElement('canvas');
          
          const width = 300;
          const height = 300;
          
          canvas1.width = width;
          canvas1.height = height;
          canvas2.width = width;
          canvas2.height = height;
          
          const ctx1 = canvas1.getContext('2d');
          const ctx2 = canvas2.getContext('2d');
          
          ctx1.drawImage(refImg, 0, 0, width, height);
          ctx2.drawImage(currentImg, 0, 0, width, height);
          
          const data1 = ctx1.getImageData(0, 0, width, height).data;
          const data2 = ctx2.getImageData(0, 0, width, height).data;
          
          let diffCount = 0;
          const threshold = 30;
          const maxDiffs = (width * height) * 0.1;
          
          for (let i = 0; i < data1.length; i += 4) {
            const diff = Math.abs(data1[i] - data2[i]) +
                        Math.abs(data1[i + 1] - data2[i + 1]) +
                        Math.abs(data1[i + 2] - data2[i + 2]);
            
            if (diff > threshold) {
              diffCount++;
            }
            
            if (diffCount > maxDiffs) {
              resolve(true);
              return;
            }
          }
          
          resolve(false);
        };
        currentImg.src = currentSrc;
      };
      refImg.src = refSrc;
    });
  };

  // Compare with all selected reference images
  const results = await Promise.all(
    referenceImagesSrc.map(refSrc => compareWithSingleImage(refSrc, currentImageSrc))
  );

  // Return true if ANY reference image detects a defect
  return results.some(result => result);
}