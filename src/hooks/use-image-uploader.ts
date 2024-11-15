import { useCallback } from 'react';
import { useToast } from './use-toast';

/**
 * Custom hook for uploading images to an R2 bucket using a signed URL.
 */
const useImageUploader = () => {
  const { toast } = useToast();

  const uploadImage = useCallback((signedUrl: string, file: File) => {
    return new Promise((resolve, reject) => {
      fetch(signedUrl, {
        method: 'PUT',
        body: file,
      }).then((uploadResponse) => {
        if (uploadResponse.ok) {
          console.log('uploadResponse', uploadResponse);
          toast({
            description: 'Uploaded successfully!',
          });
          resolve(uploadResponse);
        } else {
          toast({
            variant: 'destructive',
            description: 'Image upload ',
          });
          reject(new Error('Image upload failed.'));
        }
      });
    });
  }, []);

  return { uploadImage };
};

export { useImageUploader };
