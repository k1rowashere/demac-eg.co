import { useRouter } from 'next/router';
import React from 'react';
import Button from 'react-bootstrap/Button';

export default function LogoutButton(props: React.ComponentProps<typeof Button>) {
    const router = useRouter();
    const handleLogout = async () => {
        await fetch(`/api/admin/logout`, { method: 'POST' });
        router.push('/admin/login');
    };
    return (
        <Button onClick={handleLogout} {...props}>
            Logout&nbsp;
            <i className='bi bi-box-arrow-left' />
        </Button>
    );
}
