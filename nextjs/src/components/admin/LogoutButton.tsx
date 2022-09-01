import { useRouter } from 'next/router';
import Button from 'react-bootstrap/Button';

export default function LogoutButton() {
    const router = useRouter();
    const handleLogout = async () => {
        await fetch(`/api/admin/logout`, {
            method: 'GET',
        });
        router.push('/admin/login');
    };
    return (
        <Button onClick={handleLogout}>
            <i className='bi bi-box-arrow-left' />
        </Button>
    );
}
