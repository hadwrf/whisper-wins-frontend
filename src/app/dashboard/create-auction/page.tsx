'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';

const CreateAuction = () => {
  const [imageObjectUrl, setImageObjectUrl] = useState<string | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const imageObjectUrl = URL.createObjectURL(file);
    setImageObjectUrl(imageObjectUrl);
  };

  return (
    <div className='p-4'>
      <div className='grid w-full max-w-sm items-center gap-1.5'>
        <Label htmlFor='picture'>Picture</Label>
        <Input
          multiple
          onChange={handleImageChange}
          id='picture'
          type='file'
        />
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
      </div>
    </div>
  );
};

export default CreateAuction;
