import SidebarWrapper from '@/components/shared/siderbar/SidebarWrapper';
import React from 'react'

type Props = React.PropsWithChildren<{
    name: string;
}>

const Layout = ({ children }: Props) => {
    return (
        <SidebarWrapper>
            {children}
        </SidebarWrapper>
    )
}

export default Layout