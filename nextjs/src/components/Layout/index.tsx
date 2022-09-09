import React from 'react';
import Navbar from './Navbar';
import Header from './Header';
import Footer from './Footer';

type Layout = {
    className?: string;
    navbarProps?: React.ComponentProps<typeof Navbar>;
    headerProps?: React.ComponentProps<typeof Header>;
    children: React.ReactNode;
};

export default function Layout({ className, navbarProps, headerProps, children }: Layout) {
    // undefined guard
    const navbar = navbarProps ? <Navbar {...navbarProps} /> : null;

    return (
        <>
            {
                // wraps with div if has a shared background
                className ? (
                    <div className={className}>
                        {navbar}
                        <Header {...headerProps} />
                        {children}
                    </div>
                ) : (
                    <>
                        {navbar}
                        <Header {...headerProps} />
                        {children}
                    </>
                )
            }
            <Footer showDivider={headerProps && headerProps.showSeperator} />
        </>
    );
}
