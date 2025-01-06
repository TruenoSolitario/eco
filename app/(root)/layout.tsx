import React from 'react'

type Props = React.PropsWithChildren<{
    name: string;
}>

const Layout = ({ children }: Props) => {
    return (
        <>
            {children}
        </>
    )
}

export default Layout