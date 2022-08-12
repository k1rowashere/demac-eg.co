import LogoutButton from 'components/admin/LogoutButton';
import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSidePropsContext, GetServerSidePropsResult, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import React from 'react';
import { Button, Container, Stack } from 'react-bootstrap';
import { sessionOptions } from 'utils/constants';



async function handler(ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<{}>> {
    const user = ctx.req.session.user;

    if (!user?.isLoggedIn) {
        ctx.res.statusCode = 302;
        ctx.res.setHeader('Location', `/admin/login`);
    }
    return {
        props: {},
    };
}

export const getServerSideProps = withIronSessionSsr(handler, sessionOptions)


export default function Admin(props: InferGetServerSidePropsType<typeof handler>) {
    return <>
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
}