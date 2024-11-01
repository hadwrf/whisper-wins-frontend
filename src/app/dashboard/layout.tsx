import { PropsWithChildren } from 'react';
import NavBar from '@/app/ui/dashboard/NavBar';

export default function Layout(props: PropsWithChildren) {
    return (
        <div className="h-screen flex-row overflow-hidden">
            <NavBar />
            <div className="grow overflow-y-auto p-12">{props.children}</div>
        </div>
    );
}
