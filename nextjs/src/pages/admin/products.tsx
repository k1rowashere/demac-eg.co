import LogoutButton from 'components/admin/LogoutButton';
import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSidePropsContext, GetServerSidePropsResult, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Button, Card, Col, Container, Form, Row, Stack } from 'react-bootstrap';
import { sessionOptions } from 'utils/constants';
import dbQuery from 'utils/db_fetch';
import { product, User } from 'utils/types';



async function handler(ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<{ products: product[] }>> {
    const user = ctx.req.session.user;

    if (!user?.isLoggedIn) {
        ctx.res.statusCode = 302;
        ctx.res.setHeader('Location', `/admin/login`);
        return {
            props: { products: [] },
        };
    }

    const query = await dbQuery(`
            SELECT * FROM products;
        `) as product[];

    return {
        props: {
            products: query.map((el) => ({ ...el }))
        },
    };
}


export const getServerSideProps = withIronSessionSsr(handler, sessionOptions)


export default function ProductEdit(props: InferGetServerSidePropsType<typeof handler>) {
    return <>
        <LogoutButton />
        <Container className='my-5'>
            <h1>Edit Products</h1>
            <Form>
                <Stack direction='horizontal' gap={2}>
                    <Form.Control />
                    <Form.Control />
                    <Form.Control />
                    <Form.Control />
                    <Form.Control />
                </Stack>
                <Stack direction='horizontal' gap={2}>
                    <Button>Add</Button>
                </Stack>
            </Form>
        </Container>
    </>
}