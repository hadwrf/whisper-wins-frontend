import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 } from 'uuid';
import { NextResponse } from 'next/server';

export const r2 = new S3Client({
  region: 'auto', // Cloudflare R2 doesn't use regions, but this is required by the SDK
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

export async function GET(): Promise<{ url: string }> {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: '7be9f4e1-4818-48c6-bfcf-5c3c552876fc',
    });

    const url = await getSignedUrl(r2, command);

    return new NextResponse(url);
  } catch (error) {
    console.error('Error fetching image from R2:', error);
    return new Response('Error fetching image from R2');
  }
}

export async function POST() {
  try {
    console.log(`Generating an upload URL!`);

    // https://developers.cloudflare.com/r2/api/s3/presigned-urls/
    const signedUrl = await getSignedUrl(
      r2,
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: v4(),
      }),
      { expiresIn: 60 },
    );

    return NextResponse.json({ url: signedUrl });
  } catch {
    console.log('error');
  }
}
