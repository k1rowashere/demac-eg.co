import React from 'react';
import Navbar from './Navbar';
import Header from './Header';
import Footer from './Footer';

type Layout = {
    className?: string;
    navbarProps: React.ComponentProps<typeof Navbar>;
    headerProps: React.ComponentProps<typeof Header>;
    children: React.ReactNode;
};

export default function Layout({ className, navbarProps, headerProps, children }: Layout) {
    return (
        <>
            {
                // wraps with div if has a shared background
                className ? (
                    <div className={className}>
                        <Navbar {...navbarProps} />
                        <Header {...headerProps} />
                        {children}
                    </div>
                ) : (
                    <>
                        <Navbar {...navbarProps} />
                        <Header {...headerProps} />
                        {children}
                    </>
                )
            }
            <Footer />
        </>
    );
}
