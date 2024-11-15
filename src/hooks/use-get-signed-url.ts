import { useToast } from './use-toast';

interface SignedUrlResponse {
  signedUrl: string;
  objectKey: string;
}

const useGetSignedUrl = () => {
  const { toast } = useToast();

  const getSignedUrl = (file: File): Promise<SignedUrlResponse> => {
    return new Promise((resolve, reject) => {
      fetch('/api/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      }).then(async (response) => {
        if (response.ok) {
          const { signedUrl, objectKey } = await response.json();
          resolve({ signedUrl, objectKey });
        } else {
          const { error } = await response.json();

          toast({
            variant: 'destructive',
            title: error,
            description: 'Failed to generate upload URL.',
          });
          reject(new Error(error));
        }
      });
    });
  };

  return { getSignedUrl };
};

export { useGetSignedUrl };
