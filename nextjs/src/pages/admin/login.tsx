import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Form, Container, Card, Button, FloatingLabel } from 'react-bootstrap';
import { User } from 'utils/types';

export default function Login() {
    const router = useRouter();
    const [form, setForm] = useState({ username: '', password: '' })
    const [error, setError] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const res = await fetch(`/api/admin/login`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        const status = await res.json() as User;
        if (!status.isLoggedIn)
            setError(true)
        else
            router.push('/admin')
    };

    return <>
        <Container className='d-flex justify-content-center align-items-center' style={{ height: '100vh', width: '100vw' }}>
            <Card style={{ height: '50vh', width: '20vw' }}>
                <Card.Body className='d-flex flex-column'>
                    <Card.Title>Admin Login:</Card.Title>
                    <Form className='d-flex flex-column justify-content-around flex-grow-1' onSubmit={handleSubmit}>
                        <FloatingLabel label='Username'>
                            <Form.Control type='text' value={form.username} placeholder='' onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, username: e.target.value })} />
                        </FloatingLabel>
                        <FloatingLabel label='Password'>
                            <Form.Control type='password' value={form.password} placeholder='' onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, password: e.target.value })} />
                        </FloatingLabel>
                        {error && <p>Invalid username or password.</p>}
                        <Button type='submit' className='mt-5'>Login</Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    </>;
}
