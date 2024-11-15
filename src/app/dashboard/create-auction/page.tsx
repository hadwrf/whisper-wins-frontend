'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useImageUploader } from '@/hooks/use-image-uploader';
import { useGetSignedUrl } from '@/hooks/use-get-signed-url';

const CreateAuction = () => {
  const [imageObjectUrl, setImageObjectUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { uploadImage } = useImageUploader();
  const { getSignedUrl } = useGetSignedUrl();

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const imageObjectUrl = URL.createObjectURL(file);
    setImageObjectUrl(imageObjectUrl);

    setFile(file);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      toast({
        variant: 'destructive',
        description: 'Please select a file to upload.',
      });
      return;
    }

    try {
      const { signedUrl } = await getSignedUrl(file);
      uploadImage(signedUrl, file).then(() => {});
    } catch {
      toast({
        variant: 'destructive',
        description: 'Unhandled Error!',
      });
      return;
    }
  };

  return (
    <div className='p-4'>
      <div className='grid w-full max-w-sm items-center gap-1.5'>
        <form onSubmit={handleSubmit}>
          <Label htmlFor='picture'>Picture</Label>
          <Input
            multiple
            onChange={handleImageChange}
            id='picture'
            type='file'
          />
          <Button type='submit'>Upload</Button>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
            {imageObjectUrl && (
              <Image
                src={imageObjectUrl}
                alt={`preview`}
                width={300}
                height={300}
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAuction;
