import { Card, CardContent, CardFooter, CardMedia } from './ui/card';
import { CameraOff } from 'lucide-react';

export const BidCard = () => {
  return (
    <Card className='w-60'>
      <CardMedia>
        <CameraOff className='m-auto size-8 h-full text-slate-300' />
      </CardMedia>
      <CardContent className='h-12 p-0'>Content</CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
};
