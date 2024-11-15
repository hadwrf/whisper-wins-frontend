import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 } from 'uuid';
import { NextRequest, NextResponse } from 'next/server';

const r2 = new S3Client({
  region: 'auto', // Cloudflare R2 doesn't use regions, but this is required by the SDK
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
  },
});

export async function GET(request: NextRequest) {
  const body: { imageKey: string } = await request.json();

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: body.imageKey,
    });

    const url = await getSignedUrl(r2, command);

    return new NextResponse(url);
  } catch {
    return NextResponse.json({ error: 'Error fetching image from R2' }, { status: 500 });
  }
}

/**
 * Handles HTTP POST requests to generate a signed URL for uploading an image to an R2 bucket.
 *
 * A signed URL is required to securely grant temporary access to upload or download specific files in cloud storage
 * without exposing sensitive credentials or directly opening up access to the entire bucket.
 * This ensures that only authorized users can perform image uploading within a controlled timeframe,
 * protecting both data integrity and security.
 *
 * @see {@link https://developers.cloudflare.com/r2/api/s3/presigned-urls/}
 */
export async function POST() {
  try {
    const objectKey = v4();

    const signedUrl = await getSignedUrl(
      r2,
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: objectKey,
      }),
      { expiresIn: 60 },
    );

    return NextResponse.json({ signedUrl: signedUrl, objectKey: objectKey });
  } catch {
    return NextResponse.json({ error: 'Error uploading image' }, { status: 500 });
  }
}
