import NavBar from '@/components/navigation/NavBar';
import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  modal: React.ReactNode;
}

export default function Layout(props: Props) {
  return (
    <div className='flex h-screen min-w-[768px] flex-col'>
      <div className='sticky top-0 z-20 shadow-md'>
        <NavBar />
      </div>
      <div className='grow overflow-y-auto'>
        {props.children}
        {props.modal}
      </div>
    </div>
  );
}
