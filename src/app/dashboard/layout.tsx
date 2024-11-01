import NavBar from '@/components/navigation/NavBar';
import { PropsWithChildren } from 'react';

export default function Layout(props: PropsWithChildren) {
  return (
    <div className='h-screen flex-row overflow-hidden'>
      <NavBar />
      <div className='grow overflow-y-auto p-4'>{props.children}</div>
    </div>
  );
}
