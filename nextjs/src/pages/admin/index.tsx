import LogoutButton from 'components/admin/LogoutButton';
import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import React from 'react';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import { sessionOptions } from 'utils/constants';

async function handler(ctx: GetServerSidePropsContext) {
    const user = ctx.req.session.user;
    if (!user?.isLoggedIn) {
        return {
            redirect: { destination: '/admin/login', permanent: false },
            props: {},
        };
    } else {
        return {
            props: {},
        };
    }
}

export const getServerSideProps = withIronSessionSsr(handler, sessionOptions);

export default function Admin(props: InferGetServerSidePropsType<typeof handler>) {
    return (
        <>
            <LogoutButton />
            <Container className='my-5'>
                <h1>Admin Panel</h1>
                <Stack direction='horizontal' gap={5}>
                    <Link href='/admin/products' passHref>
                        <Button>Edit/Add a product</Button>
                    </Link>
                </Stack>
            </Container>
        </>
    );
}
