'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { ChangeEvent, FormEvent, useState } from 'react';

const CreateAuction = () => {
  const [imageObjectUrl, setImageObjectUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

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
      alert('Please select a file to upload.');
      return;
    }

    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filename: file.name, contentType: file.type }),
    });

    if (response.ok) {
      const { url } = await response.json();

      const uploadResponse = await fetch(url, {
        method: 'PUT',
        body: file,
      });

      if (uploadResponse.ok) {
        alert('Upload successful!');
      } else {
        alert('Upload failed.');
      }
    } else {
      alert('Failed to get pre-signed URL.');
    }
  };

  const getImage = async () => {
    try {
      const response = await fetch('/api/upload');
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
      const utl = await response.text();
      setImageUrl(utl);
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  getImage();

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
          <Button
            onClick={async () => {
              console.log('fetching');
              const response = await fetch('/api/upload', {
                method: 'GET',
              });
              console.log('response', response);
            }}
          >
            Get
          </Button>
          <Image
            src={imageUrl ?? ''}
            alt={`previews`}
            width={300}
            height={300}
          />
        </form>
      </div>
    </div>
  );
};

export default CreateAuction;
