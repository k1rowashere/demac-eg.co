// create a page that will be rendered when the payment is successful
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

Success.disableLayout = true;

const timeout = 3;

export default function Success() {
    const [time, setTime] = useState(timeout);
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace('/store');
        }, timeout * 1000);

        return () => clearTimeout(timer);
    }, [router]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className='d-flex justify-content-center align-items-center text-white'
            style={{ height: '100vh', backgroundColor: '#28a745' }}
        >
            <div className='text-center p-5'>
                <h1>Order Successful!</h1>
                <p>
                    You will be redirected to the store in {time} second
                    {time > 1 && time !== 0 ? 's' : ''}.
                </p>
            </div>
        </div>
    );
}
