import NavBar from '@/app/ui/dashboard/navBar';
import { PropsWithChildren } from 'react';

export default function Layout(props: PropsWithChildren) {
    return (
        <div className="h-screen flex-row overflow-hidden">
            <NavBar />
            <div className="grow p-6 md:overflow-y-auto md:p-12">{props.children}</div>
        </div>
    );
}
