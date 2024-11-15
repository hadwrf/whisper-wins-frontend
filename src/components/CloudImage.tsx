import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { useState } from 'react';

interface CloudImageProps {
  imageKey: string;
}

export const CloudImage = (props: CloudImageProps) => {
  const { toast } = useToast();

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const getImage = async () => {
    try {
      const response = await fetch('/api/image', {
        method: 'GET',
        body: JSON.stringify({ imageKey: props.imageKey }),
      });
      if (!response.ok) {
        toast({
          description: 'Failed to fetch image',
        });
        // console.log('Failed to fetch image');
      }
      const imgUrl = await response.text();
      setImageUrl(imgUrl);
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };
  getImage();

  return (
    <Image
      src={imageUrl ?? ''}
      alt={'cloud loaded image'}
      width={300}
      height={300}
    />
  );
};
